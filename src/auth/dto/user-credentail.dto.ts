import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UserCredentialDto {
  @IsString()
  @MinLength(4, { message: 'username must have at least 4 charactors' })
  @MaxLength(20, { message: 'username should not more than 20 charactors' })
  username: string;

  @IsString()
  @MinLength(8, { message: 'Password must have at least 8 charactors' })
  @MaxLength(50, { message: 'Password should not more than 50 charactors' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, {
    message:
      'Password must have a Capital Charactor, LowerCase Charactor and Special Charactor each',
  })
  password: string;
}
