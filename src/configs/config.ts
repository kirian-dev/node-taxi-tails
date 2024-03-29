import { MISSING_ENV_VARS_ERROR } from 'src/common/error/system.erorr';

export type AppConfig = {
  mongoDBUri: string;
  mongoDBName: string;
  port: string;
  jwtSecret: string;
  smtpPort: string;
  smtpHost: string;
  smtpUser: string;
  smtpPassword: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsS3Region: string;
  redisHost: string;
  redisPort: string;
};

export const config = (): AppConfig => {
  const {
    MONGODB_URI,
    MONGODB_NAME,
    APP_PORT,
    JWT_SECRET,
    SMTP_USER,
    SMTP_PASSWORD,
    SMTP_HOST,
    SMTP_PORT,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_S3_REGION,
    REDIS_HOST,
    REDIS_PORT,
  } = process.env;

  if (
    !MONGODB_URI ||
    !MONGODB_NAME ||
    !APP_PORT ||
    !JWT_SECRET ||
    !SMTP_USER ||
    !SMTP_PASSWORD ||
    !SMTP_HOST ||
    !SMTP_PORT ||
    !AWS_ACCESS_KEY_ID ||
    !AWS_SECRET_ACCESS_KEY ||
    !AWS_S3_REGION ||
    !REDIS_HOST ||
    !REDIS_PORT
  ) {
    throw new Error(MISSING_ENV_VARS_ERROR);
  }

  return {
    mongoDBUri: MONGODB_URI,
    mongoDBName: MONGODB_NAME,
    port: APP_PORT,
    jwtSecret: JWT_SECRET,
    smtpUser: SMTP_USER,
    smtpPassword: SMTP_PASSWORD,
    smtpHost: SMTP_HOST,
    smtpPort: SMTP_PORT,
    awsAccessKeyId: AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: AWS_SECRET_ACCESS_KEY,
    awsS3Region: AWS_S3_REGION,
    redisHost: REDIS_HOST,
    redisPort: REDIS_PORT,
  };
};
