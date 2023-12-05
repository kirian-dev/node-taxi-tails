export class CreateUserResponseDto {
  user: {
    _id: string;
  };

  refreshToken: string;

  accessToken: string;
}
