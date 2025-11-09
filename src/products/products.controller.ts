import { Controller, Get, Param } from '@nestjs/common';
import { PRODUCTS_MOCK } from './products.mock';

@Controller('products')
export class ProductsController {

  @Get()
  getAllHttp() {
    return PRODUCTS_MOCK;
  }

  @Get(':id')
  getByIdHttp(@Param('id') id: string) {
    return PRODUCTS_MOCK.find((product) => product.id === id);
  }

  @Get('by-user/:userId')
  getByUserHttp(@Param('userId') userId: string) {
    return PRODUCTS_MOCK.filter((product) => product.userId === userId);
  }
}
