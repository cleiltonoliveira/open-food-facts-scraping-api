import { Controller, Get } from '@nestjs/common';
import { ProductFilterService } from './service/product-filter.service';
import { ProductFinderService } from './service/product-finder.service';

@Controller()
export class ProductController {
  constructor(private readonly productFilterService: ProductFilterService, 
    private readonly productFinderService: ProductFinderService,) {}

  @Get()
  getHello(): string {
    return this.productFilterService.fetch();
  }
}
