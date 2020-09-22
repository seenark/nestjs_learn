import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateStockDto {
  @IsNotEmpty()
  @MinLength(2, {
    message: 'Length is too short',
  })
  name: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  stock: number;
}
