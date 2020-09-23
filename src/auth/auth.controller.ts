import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredentialDto } from './dto/user-credentail.dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /* sign up */
  /* { username: 'admin', password: 'Abc12345678#' } */
  @Post('/signup')
  @UsePipes(ValidationPipe)
  signUp(@Body() userCredential: UserCredentialDto): Promise<User> {
    return this.authService.signUp(userCredential);
  }

  /* sign in */
  @Post('/signin')
  signIn(@Body() userCredential: UserCredentialDto) {
    console.log(userCredential);
  }
}
