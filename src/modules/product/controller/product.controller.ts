import { Controller, Get, Query } from '@nestjs/common';
import { ProductFinderService } from '../service/product-finder.service';
import { Param } from '@nestjs/common';
import Product from '../model/product';
import ProductDto from '../dto/product.dto';
import { ProductFilterService } from '../service/product-filter.service';
import ProductFilterResult from '../model/product-filter-result';
import {
  refs,
  ApiExtraModels,
  ApiOkResponse,
  ApiDefaultResponse
} from '@nestjs/swagger';
import { productResponseExample } from 'src/swagger/res/find-by-id-product-response-example';
import ProductDtoSwaggerDescritor from 'src/swagger/product-dto-swagger-descritor';
import ErrorResponse from 'src/error/error-response';
import ProductFilterResultSwaggerDescritor from 'src/swagger/product-filter-result-swagger-descritor';
import { findByFilterResponseExample } from 'src/swagger/res/find-by-filter-response-example';

@Controller()
@ApiExtraModels(ProductDtoSwaggerDescritor, ProductFilterResultSwaggerDescritor)
export class ProductController {
  constructor(private readonly productFinderService: ProductFinderService, private readonly productFilterService: ProductFilterService) { }

  @Get("products/")
  @ApiOkResponse({
    status: 200,
    description: 'List containing product search results using the provided filter',
    schema: { type: 'array', allOf: refs(ProductFilterResultSwaggerDescritor), example: findByFilterResponseExample }
  })
  @ApiDefaultResponse({ type: ErrorResponse, description: 'Default payload for all error responses' })
  async getProductListByFilter(@Query('nutrition') nutrition: string, @Query('nova') nova: string): Promise<ProductFilterResult[]> {
    const result = await this.productFilterService.filter(nutrition, nova);
    return result
  }

  @Get("products/:productId")
  @ApiOkResponse({
    status: 200,
    description: 'Response when the product is found when searching for its id',
    schema: { allOf: refs(ProductDtoSwaggerDescritor), example: productResponseExample }
  })
  @ApiDefaultResponse({ type: ErrorResponse, description: 'Default payload for all error responses' })
  async getProductById(@Param('productId') productId: string): Promise<ProductDto> {
    const product = await this.productFinderService.findProductById(productId);
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
