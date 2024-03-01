import { Injectable } from "@nestjs/common";
import puppeteer, { Browser } from 'puppeteer';

@Injectable()
export class BrowserPool {
    poolSize: number;
    pool: Browser[];
    initializing: boolean;
    initializationPromise: Promise<void>;

    constructor() {
        this.poolSize = parseInt(process.env.MAX_BROWSER_POOL_SIZE) || 1;
        this.pool = []
        this.initializing = false;
        this.initializationPromise = null;
        this.initialize()
    }

    async initialize() {
        if (this.initializing) {
            await this.initializationPromise;
            return;
        }

        this.initializing = true;
        this.initializationPromise = new Promise<void>(async (resolve) => {
            console.log("Creating browser instances to pool.")

            for (let i = 0; i < this.poolSize; i++) {
                const browser = await puppeteer.launch({ headless: true });
                this.pool.push(browser);
            }

            this.initializing = false;
            resolve();
        });

        await this.initializationPromise
    }

    async acquire(): Promise<Browser> {
        if (this.pool.length === 0) {
            await this.initialize();
        }
        console.log("Requesting browser instance. ")
        return this.pool.pop();
    }

    async release(browser: Browser) {
        if (this.pool.length == this.poolSize) {
            console.log("Full browser pool... closing spare instance.")
            await browser.close();
        } else {
            this.pool.push(browser);
            console.log("Instance returned to pool")
        }
    }

    async close() {
        for (const browser of this.pool) {
            await browser.close();
        }
    }
}