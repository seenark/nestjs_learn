import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { UserCredentialDto } from './dto/user-credentail.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(userCredentialDto: UserCredentialDto): Promise<User> {
    const { username, password } = userCredentialDto;
    /* generate random salt from bcrypt */
    const salt = bcrypt.genSaltSync()

    const user = new User();
    user.username = username;
    user.password = await bcrypt.hashSync(password,salt)
    user.salt = salt
    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'Error, due to this Username already exist',
        );
      } else {
        throw new InternalServerErrorException('Error while save new user' + error);
      }
    }

    return user;
  }


  async verifyUserPassword(userCredentialDto:UserCredentialDto):Promise<string> {
    const { username, password } = userCredentialDto
    const user = await this.findOne({username:username})
    if (user) {
      const passwordMatched = await bcrypt.compareSync(password,user.password)
      if (passwordMatched) {
        return user.username
      }else{
        throw new UnauthorizedException("Password not matched")
      }
    }else{
      throw new UnauthorizedException("Username not matched")
    }

/*  //   CMDEV
    const { username, password } = userCredentialDto
    const user = await this.findOne({username:username})
    if (user) {
      const passwordMatched = await user.verifyPassword(password)
      if (passwordMatched) {
        return username
      }else{
        throw new UnauthorizedException(`Password not matched`)
      }
    }else{
      throw new UnauthorizedException(`incorrected username: ${username}`)
    } */
  }
}
