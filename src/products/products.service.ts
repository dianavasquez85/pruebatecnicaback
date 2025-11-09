import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCTS_SERVICE') private readonly client: ClientProxy,
  ) {}

  async findAll() {
    // llama al microservicio con el pattern { cmd: 'get_accounts' }
    return firstValueFrom(
      this.client.send({ cmd: 'get_accounts' }, {}),
    );
  }

  async findById(id: string) {
    return firstValueFrom(
      this.client.send({ cmd: 'get_product_by_id' }, id),
    );
  }

  async findByUserId(userId: string) {
    return firstValueFrom(
      this.client.send({ cmd: 'get_products_by_user_id' }, userId),
    );
  }
}
