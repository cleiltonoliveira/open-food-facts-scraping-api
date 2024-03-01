import { Injectable } from "@nestjs/common";
import { Browser, Page, TimeoutError } from 'puppeteer';
import { BrowserPool } from "src/common/browser/browser-pool";
import GatewayTimeoutException from "src/error/custom-exceptions/gateway-timeout-exception";

@Injectable()
export class SiteFetcherService {
    constructor(private readonly browserPool: BrowserPool) { }

    async fetch(pagePath: string) {
        let browser: Browser;
        try {
            browser = await this.browserPool.acquire();

            const page = await browser.newPage();
            page.setDefaultNavigationTimeout(45000);

            await page.setRequestInterception(true);
            page.on('request', (req) => {
                if (['stylesheet', 'font', 'image'].includes(req.resourceType())) {
                    req.abort();
                } else {
                    req.continue();
                }
            });

            const pageUri = `${process.env.OPEN_FOOD_FACTS_BASE_URL}/${pagePath}`

            console.log(`- Sending request to: ${pageUri}`)
            await page.goto(pageUri);
            console.log(`- Request success!!!`)

            return page;
        } catch (error) {
            if (browser) {
                await browser.close();
            }
            if (error instanceof TimeoutError) {
                throw new GatewayTimeoutException("Gateway Timoutt")
            } else {
                throw error
            }
        }
    }

    async release(page: Page) {
        const browser = page.browser()
        await page.close();
        await this.browserPool.release(browser);
    }
}