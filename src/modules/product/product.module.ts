import { Module } from "@nestjs/common";
import { ProductController } from './controller/product.controller';
import { ProductFinderService } from "./service/product-finder.service";
import { BrowserModule } from "src/common/browser/browser.module";
import { ProductFilterService } from "./service/product-filter.service";

@Module({
    imports: [BrowserModule],
    controllers: [ProductController],
    providers: [ProductFinderService, ProductFilterService],
})
export class ProductModule { }