export type AppConfig = {
  mongoDBUri: string;
  mongoDBName: string;
  port: string;
  jwtSecret: string;
};

export const config = (): AppConfig => ({
  mongoDBUri: process.env.MONGODB_URI || '',
  mongoDBName: process.env.MONGODB_NAME || '',
  port: process.env.APP_PORT || '',
  jwtSecret: process.env.JWT_SECRET || '',
});
