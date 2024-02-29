import { Module } from "@nestjs/common";
import { ProductController } from './controller/product.controller';
import { ProductFinderService } from "./service/product-finder.service";
import { BrowserModule } from "src/common/browser.module";

@Module({
    imports: [BrowserModule],
    controllers: [ProductController],
    providers: [ProductFinderService],
})
export class ProductModule { }