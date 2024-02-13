import { S3 } from 'aws-sdk';
import { config } from 'src/configs/config';

interface UploadFileParams {
  entityId: string;
  entityType: string;
  files: Express.Multer.File[];
}

export const uploadFilesToS3 = async ({
  entityId,
  entityType,
  files,
}: UploadFileParams): Promise<string[]> => {
  const { awsS3Region, awsAccessKeyId, awsSecretAccessKey } = config();

  const s3 = new S3({
    region: awsS3Region,
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    },
  });

  const uploadedUrls: string[] = [];

  for (const file of files) {
    const { buffer, originalname } = file;
    const key = `${entityType}/${entityId}/${originalname}`;

    const params = {
      Bucket: 'taxi-tails',
      Key: key,
      Body: buffer,
    };

    try {
      const uploadResult = await s3.upload(params).promise();
      uploadedUrls.push(uploadResult.Location);
    } catch (error) {
      throw error;
    }
  }

  return uploadedUrls;
};

export const deletePhotosFromS3 = async (
  photoUrls: string[],
): Promise<void> => {
  const { awsS3Region, awsAccessKeyId, awsSecretAccessKey } = config();

  const s3 = new S3({
    region: awsS3Region,
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    },
  });

  for (const url of photoUrls) {
    const [, , , folder, userId, photoName] = url.split('/');

    const params = {
      Bucket: 'taxi-tails',
      Key: `${folder}/${userId}/${photoName}`,
    };

    try {
      await s3.deleteObject(params).promise();
    } catch (error) {
      throw error;
    }
  }
};
