import { S3 } from 'aws-sdk';
import { config } from 'src/configs/config';

interface UploadFileParams {
  entityId: string;
  entityType: string;
  file: Express.Multer.File;
}

export const uploadFileToS3 = async ({
  entityId,
  entityType,
  file,
}: UploadFileParams): Promise<string> => {
  const { awsS3Region, awsAccessKeyId, awsSecretAccessKey } = config();
  const { buffer, originalname } = file;
  const s3 = new S3({
    region: awsS3Region,
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    },
  });

  const key = `${entityType}/${entityId}/${originalname}`;

  const params = {
    Bucket: 'taxi-tails',
    Key: key,
    Body: buffer,
  };

  try {
    const uploadResult = await s3.upload(params).promise();

    return uploadResult.Location;
  } catch (error) {
    throw error;
  }
};
