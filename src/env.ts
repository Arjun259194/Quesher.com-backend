import z from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  EMAIL_ADDRESS: z.string().email(),
  EMAIL_TOKEN: z.string(),
  JWT_SECRET: z.string(),
  PORT: z.string().max(4),
});

const envParse = () => envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

export default envParse;
