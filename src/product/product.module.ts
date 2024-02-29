import { Module } from "@nestjs/common";
import { SiteFetcherService } from './service/site-fetcher.service';
import { ProductController } from './product.controller';
import { ProductFilterService } from "./service/product-filter.service";
import { ProductFinderService } from "./service/product-finder.service";
import { browserPoolProvider } from "src/browser-pool.provider";

@Module({
    controllers: [ProductController],
    providers: [SiteFetcherService, ProductFilterService, ProductFinderService, browserPoolProvider(1)],
})
export class ProductModule { }