import { Logger } from '@nestjs/common';
import { UserDocument } from 'src/users/schemas/user.schema';

export const userResponseWithId = (user: UserDocument, logger: Logger) => {
  try {
    const userId: string = user._id || '';
    return {
      _id: userId,
    };
  } catch (error) {
    logger.error(`Error in userResponseWithId: ${error.message}`);
    throw error;
  }
};
