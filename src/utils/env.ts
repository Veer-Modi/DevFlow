export function validateEnv() {
  const requiredEnvs = ['MONGODB_URI', 'JWT_SECRET'];
  const missingEnvs = requiredEnvs.filter((env) => !process.env[env]);

  if (missingEnvs.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvs.join(', ')}`
    );
  }
}
