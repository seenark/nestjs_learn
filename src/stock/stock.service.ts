import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';
import { CreateStockDto } from './dto/create-stock-dto';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';

import * as fsExtra from 'fs-extra';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  createProduct(createStockDto: CreateStockDto) {
    return this.productRepository.createStock(createStockDto);
  }

  getAllProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException(`Not found Product with id: ${id}`);
    } else {
      return product;
    }
  }

  async deleteProductById(id: number): Promise<DeleteResult> {
    const product = await this.getProductById(id);
    const { imageName } = product;
    await fsExtra.remove(`upload/${imageName}`);
    return await this.productRepository.delete(id);
  }

  async updateProduct(
    id: number,
    createStockDto: CreateStockDto,
  ): Promise<Product> {
    const product = await this.getProductById(id);
    const { name, price, stock } = createStockDto;
    product.name = name;
    product.price = price;
    product.stock = stock;
    return await product.save();
  }

  async getProductsByKeyword(keyword: string): Promise<Product[]> {
    if (keyword) {
      const query = this.productRepository.createQueryBuilder('Products');
      query.andWhere('LOWER(Products.name) LIKE LOWER(:keyword)', {
        keyword: `%${keyword}%`,
      });
      console.log(query);
      return await query.getMany();
    } else {
      return this.getAllProducts();
    }
  }
}
