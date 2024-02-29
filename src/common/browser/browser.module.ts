import { Module } from "@nestjs/common";

import { browserPoolProvider } from "./browser-pool.provider";
import { BrowserPool } from "./browser-pool";
import { SiteFetcherService } from "./site-fetcher.service";

@Module({
    providers: [browserPoolProvider(1), SiteFetcherService],
    exports: [BrowserPool, SiteFetcherService]
})
export class BrowserModule { }