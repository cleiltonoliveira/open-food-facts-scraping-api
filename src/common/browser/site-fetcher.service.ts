import { Injectable } from "@nestjs/common";
import { Browser, Page } from 'puppeteer';
import { BrowserPool } from "src/common/browser/browser-pool";

@Injectable()
export class SiteFetcherService {
    constructor(private readonly browserPool: BrowserPool) { }

    async fetch(pageUrl: string) {
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
            
            console.log(`- Sending request to: ${pageUrl}` )
            await page.goto(pageUrl);
            console.log(`- Request success!!!` )
            return page;
        } catch (error) {
            if (error.name === 'TimeoutError') {
                console.error('Timeout Error:', error);
            } else if (error.name === 'NetworkError') {
                console.error('Network Error:', error);
            } else {
                console.error('An unexpected error occurred:', error);
            }

            if (browser) {
                await browser.close();
            }
        }
    }

    async release(page: Page) {
        const browser = page.browser()
        await page.close();
        await this.browserPool.release(browser);
    }
}