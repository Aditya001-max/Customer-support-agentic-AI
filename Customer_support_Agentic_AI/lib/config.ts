// lib/config.ts — Environment variable loader + validation

function getEnvVar(name: string, required = true): string {
  const value = process.env[name];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value || '';
}

export const config = {
  anthropic: {
    apiKey: () => getEnvVar('ANTHROPIC_API_KEY'),
  },
  gmail: {
    user: () => getEnvVar('GMAIL_USER'),
    appPassword: () => getEnvVar('GMAIL_APP_PASSWORD'),
  },
  supportTeamEmail: () => getEnvVar('SUPPORT_TEAM_EMAIL'),
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};
