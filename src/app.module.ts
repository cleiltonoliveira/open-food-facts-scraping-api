import { Module } from '@nestjs/common';
import { ProductModule } from './modules/product/product.module';
import { BrowserModule } from './common/browser/browser.module';
import { GlobalExceptionFilter } from './error/global-exception-filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [BrowserModule, ProductModule],
  controllers: [],
  providers: [{
    provide: APP_FILTER,
    useClass: GlobalExceptionFilter,
  },]
})
export class AppModule { }
