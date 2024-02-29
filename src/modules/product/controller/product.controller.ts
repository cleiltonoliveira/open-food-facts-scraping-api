import { Controller, Get } from '@nestjs/common';
import { ProductFinderService } from '../service/product-finder.service';
import { Param } from '@nestjs/common';
import Product from '../model/Product';

@Controller()
export class ProductController {
  constructor(private readonly productFinderService: ProductFinderService) { }

  @Get()
  getHello(): string {
    this.productFinderService.fetch();
    return "ok"
  }

  @Get("products/:productId")
  async getProductById(@Param() params: { productId: string }): Promise<Product> {
    const result = await this.productFinderService.findProductById(params.productId);
    return result
  }
}
