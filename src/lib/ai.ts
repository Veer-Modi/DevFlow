interface ModerationResult {
  is_abusive: boolean;
  reason: string | null;
  confidence: number;
}

export async function analyzeContent(content: string): Promise<ModerationResult> {
  const AI_API_KEY = process.env.AI_API_KEY;

  if (!AI_API_KEY) {
    console.warn('AI_API_KEY not set. Using mock moderation (allow all).');
    return { is_abusive: false, reason: null, confidence: 1.0 };
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a strict moderation AI. Analyze the user content. Determine if it is abusive, spam, or harmful. Return exactly a JSON object with strictly these keys: "is_abusive" (boolean), "reason" (string or null if not abusive), and "confidence" (number between 0 and 1).'
          },
          { role: 'user', content }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const resultText = data.choices[0].message.content;
    const result = JSON.parse(resultText);

    return {
      is_abusive: !!result.is_abusive,
      reason: result.reason || null,
      confidence: typeof result.confidence === 'number' ? result.confidence : 0.9,
    };
  } catch (error) {
    console.error('AI Moderation failed:', error);
    // Fallback: allow content but log error
    return { is_abusive: false, reason: null, confidence: 0 };
  }
}
