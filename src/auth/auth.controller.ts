import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserCredentialDto } from './dto/user-credentail.dto';
import { GetUsername } from './get-username.decorator';
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
  @HttpCode(200)
  signIn(@Body() userCredential: UserCredentialDto) {
    return this.authService.signIn(userCredential);
  }


  /* test */
  @Get('/test')
  @UseGuards(AuthGuard('jwt'))
  testJwt(@GetUsername() username) {
    console.log(username);
    return username;
  }
}
