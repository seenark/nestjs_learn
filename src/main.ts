import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const serverConfig = config.get('server');

  if (process.env.NODE_ENV === 'production') {
    app.enableCors();
  } else {
    const origin = process.env.ORIGIN || serverConfig.origin
    app.enableCors({
      origin: origin
    })
    console.log("Server accept Origin: " + origin)
  }

  const port = process.env.PORT || serverConfig.port;
  console.log('Server starting ... #1');
  await app.listen(port);
  console.log('NestJS started at Port: ' + port);
}
bootstrap();
