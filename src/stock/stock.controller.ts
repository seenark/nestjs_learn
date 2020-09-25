import {
  Body,
  Controller,
  Delete,
  Get,
  NotAcceptableException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChangeStringCasePipe } from 'src/pipes/change-string-case.pipe';
import { CreateStockDto } from './dto/create-stock-dto';
import { StockService } from './stock.service';

import { diskStorage } from 'multer';
import * as fsExtra from 'fs-extra';
import { extname } from 'path';
import { LoggerInterceptor } from 'src/logger.interceptor';

@Controller('stock')
@UseInterceptors(LoggerInterceptor)
export class StockController {
  constructor(private stockService: StockService) {}

  // @Get()
  // getAllStock(): Promise<Product[]> {
  //   return this.stockService.getAllProducts();
  // }
  @Get()
  getProductsByKeyword(@Query('keyword') keyword: string, @Req() req:any) {
    console.log("timestamp: ",req.timestamp)
    return this.stockService.getProductsByKeyword(keyword);
  }

  @Get('/:id')
  getProductById(@Param('id') id: number) {
    return this.stockService.getProductById(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        if (ext.toLowerCase() == '.png' || ext.toLowerCase() == '.jpg') {
          return cb(null, true);
        } else {
          const err = new NotAcceptableException(
            `File type: ${ext} is not supported, Please provide .jpg or .png`,
          );
          return cb(err, false);
        }
      },
    }),
  )
  @UsePipes(ValidationPipe)
  @UsePipes(new ChangeStringCasePipe())
  async createStock(
    @UploadedFile() file,
    @Body() createStockDto: CreateStockDto,
  ) {
    const product = await this.stockService.createProduct(createStockDto);
    const fileExtension = extname(file.filename);
    fsExtra.move(file.path, `./upload/${product.id}${fileExtension}`);
    const imageFileName = product.id + fileExtension;
    product.imageName = imageFileName;
    await product.save();
    return product;
  }

  @Delete('/:id')
  deleteProductById(@Param('id') id: number) {
    return this.stockService.deleteProductById(id);
  }

  @Put('/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        if (ext.toLowerCase() == '.png' || ext.toLowerCase() == '.jpg') {
          return cb(null, true);
        } else {
          const err = new NotAcceptableException(
            `File type: ${ext} is not supported, Please provide .jpg or .png`,
          );
          return cb(err, false);
        }
      },
    }),
  )
  async updateProductById(
    @UploadedFile('file') file: any,
    @Param('id') id: number,
    @Body() createStockDto: CreateStockDto,
  ) {
    // save all text data into database
    const product = await this.stockService.updateProduct(id, createStockDto);
    const { imageName } = product;
    // if user upload file also then delete old file and save new file
    if (file) {
      // remove
      await fsExtra.remove(`./upload/${imageName}`);
      // get extension of file
      const fileExtension = extname(file.filename);
      // rename and add the extension
      fsExtra.move(file.path, `./upload/${product.id}${fileExtension}`);
      // change imageName data in database to match the saved file
      const imageFileName = product.id + fileExtension;
      product.imageName = imageFileName;
      await product.save();
      return product;
    }
  }
}
