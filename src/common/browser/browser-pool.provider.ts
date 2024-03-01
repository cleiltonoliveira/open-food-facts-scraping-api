import { Provider, Scope } from '@nestjs/common';
import { BrowserPool } from './browser-pool'; 

export const browserPoolProvider= (poolSize: number): Provider => ({
    provide: BrowserPool,
    useFactory: () => new BrowserPool(poolSize),
    scope: Scope.DEFAULT, 
    inject: [],
  });