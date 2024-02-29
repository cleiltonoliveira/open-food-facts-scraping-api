import { Controller, Get } from '@nestjs/common';
import { ProductFilterService } from './service/product-filter.service';
import { ProductFinderService } from './service/product-finder.service';
import { Param } from '@nestjs/common';
import Product from './Product';

@Controller()
export class ProductController {
  constructor(private readonly productFilterService: ProductFilterService,
    private readonly productFinderService: ProductFinderService) { }

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
