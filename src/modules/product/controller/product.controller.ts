import { Controller, Get, Query } from '@nestjs/common';
import { ProductFinderService } from '../service/product-finder.service';
import { Param } from '@nestjs/common';
import Product from '../model/product';
import ProductDto from '../dto/product-dto';
import { ProductFilterService } from '../service/product-filter.service';

@Controller()
export class ProductController {
  constructor(private readonly productFinderService: ProductFinderService, private readonly productFilterService: ProductFilterService) { }

  @Get("products/")
  getProductListByFilter(@Query() queryParams: any): any {
    const { nutrition, nova } = queryParams;
    const result = this.productFilterService.filter(nutrition, nova);
    return result
  }

  @Get("products/:productId")
  async getProductById(@Param() params: { productId: string }): Promise<any> {
    const product = await this.productFinderService.findProductById(params.productId);
    if (product == null) return {
      error: "Product not found"
    }
    return this.toProductDto(product);
  }

  private toProductDto(product: Product): ProductDto {
    const dto = new ProductDto();
    dto.title = product.title
    dto.quantity = product.quantity
    dto.ingredients = product.ingredients

    let nt = product.nutrition
    const obj: Record<string, { per100g: string; perServing: string }> = {};

    for (const item of nt.data) {
      obj[item.nutritionProperty] = { per100g: item.per100g, perServing: item.perServing };
    }

    dto.nutrition = { score: nt.score, values: nt.values, servingSize: nt.servingSize, data: obj, nova: nt.nova };

    return dto
  }
}
