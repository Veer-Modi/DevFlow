import { analyzeContent } from '@/lib/ai';
import AbuseLog from '@/models/AbuseLog';
import User from '@/models/User';
import { connectToDatabase } from '@/lib/db';
import { createNotification } from '@/utils/notification';

export async function handleModeration(
  userId: string,
  content: string,
  type: 'post' | 'reply',
  contentId: string
) {
  try {
    await connectToDatabase();
    
    const aiResult = await analyzeContent(content);

    if (aiResult.is_abusive) {
      // Create AbuseLog entry
      const log = new AbuseLog({
        user_id: userId,
        content_type: type,
        content_id: contentId,
        ai_reason: aiResult.reason,
        ai_confidence: aiResult.confidence,
      });
      await log.save();

      // Increment user's abuse count
      const user = await User.findById(userId);
      if (user) {
        user.abuse_count += 1;
        if (user.abuse_count >= 3) {
          user.status = 'blocked';
        }
        await user.save();

        if (user.abuse_count === 1) {
          await createNotification(userId, "Your content was flagged for inappropriate behavior", "warning");
        } else if (user.abuse_count === 2) {
          await createNotification(userId, "Warning: repeated violations may lead to account suspension", "warning");
        } else if (user.abuse_count === 3) {
          await createNotification(userId, "Your account has been blocked due to repeated violations", "blocked");
        }
      }
    }

    return aiResult;
  } catch (error) {
    console.error('Moderation handler error:', error);
    // Ensure failure doesn't break system
    return { is_abusive: false, reason: null, confidence: 0 };
  }
}
