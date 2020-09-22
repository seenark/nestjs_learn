import { EntityRepository, Repository } from 'typeorm';
import { CreateStockDto } from './dto/create-stock-dto';
import { Product } from './product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  async createStock(createStockDto: CreateStockDto) {
    const { name, price, stock } = createStockDto;
    const product = new Product();
    product.name = name;
    product.price = price;
    product.stock = stock;
    await product.save();
    return product;
  }
}
