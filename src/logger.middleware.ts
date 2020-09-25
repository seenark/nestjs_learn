import {
  
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log(req)
    // const { keyword } = req.query;
    // if (keyword) {
    //   console.log(keyword);
    //   req.timestamp = Date.now()
    //   next();
    // } else {
    //   throw new BadRequestException('keyword query is missing');
    // }
    next()
  }
}
