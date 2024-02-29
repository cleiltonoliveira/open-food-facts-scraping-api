import { Module } from '@nestjs/common';
import { ProductModule } from './modules/product/product.module';
import { BrowserModule } from './common/browser/browser.module';

@Module({
  imports: [BrowserModule, ProductModule],
  controllers: [],
  providers: []
})
export class AppModule { }
