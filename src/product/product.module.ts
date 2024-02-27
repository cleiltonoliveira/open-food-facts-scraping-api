import { Module } from "@nestjs/common";
import { SiteFetcherService } from './service/site-fetcher.service';
import { ProductController } from './product.controller';
import { ProductFilterService } from "./service/product-filter.service";
import { ProductFinderService } from "./service/product-finder.service";
@Module({
    controllers: [ProductController],
    providers: [SiteFetcherService, ProductFilterService, ProductFinderService],
})
export class ProductModule { }