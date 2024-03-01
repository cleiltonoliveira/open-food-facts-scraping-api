import { Injectable } from "@nestjs/common";
import { SiteFetcherService } from "../../../common/browser/site-fetcher.service";
import ProductFilterResult from "../model/product-filter-result";
import { Page } from "puppeteer";
import NotFoundException from "src/error/custom-exceptions/not-found-exception";

@Injectable()
export class ProductFilterService {

    constructor(private readonly siteFetcherService: SiteFetcherService) { }

    async filter(nutritionParam: string, novaParam: string): Promise<ProductFilterResult[]> {
        const url = `https://br.openfoodfacts.org/${this.composeUri(nutritionParam, novaParam)}`

        console.log(`Preparing to fetch products with filter${nutritionParam ? ' nutrition=' + nutritionParam : ''}${novaParam ? ' nova=' + novaParam : ''}`)

        const page = await this.siteFetcherService.fetch(url)

        await page.waitForSelector('title');
        if (await page.title() == "Erro") {
            throw new NotFoundException(`No products found for the filter${nutritionParam ? ' nutrition=' + nutritionParam : ''}${novaParam ? ' nova=' + novaParam : ''}`)
        }

        await page.waitForSelector('#products_match_all');

        console.log("Starting product list extraction...")

        let productList: ProductFilterResult[] = await this.extractProductDetails(page)

        while (await this.hasNextPage(page)) {
            await this.goToNextPage(page)
            await page.waitForSelector('#products_match_all');
            let newElements = await this.extractProductDetails(page)
            productList.push(...newElements)
        }
        console.log("Extraction finished!")
        this.siteFetcherService.release(page);
        return productList;
    }

    private async hasNextPage(page: Page): Promise<Boolean> {
        return await page.evaluate(() => {
            const el = document.querySelector("#pages");
            if (!el) return false
            const nextButton = document.querySelector('a[rel="next$nofollow"]');
            if (nextButton) return true
            return false
        });
    }

    private async goToNextPage(page: Page) {
        await Promise.all([
            page.waitForNavigation(),
            page.click('a[rel="next$nofollow"]')
        ])
    }

    private async extractProductDetails(page: Page): Promise<any> {

        const products = await page.$$eval('#products_match_all a', (elements: HTMLElement[]) => {

            function extractProductCode(element: HTMLElement): any {
                const regex = /\/produto\/(\d+)(?:\/|$)/;
                const match = element.getAttribute('href').match(regex);
                return match ? match[1] : null;
            }

            function extractScore(element: HTMLElement): any {
                const score = element.getAttribute('src').split("/").pop().split("-").pop().replace(".svg", "");
                if (!isNaN(parseInt(score))) {
                    return parseInt(score)
                }
                if (score.length == 1) {
                    return score.toUpperCase()
                }
                return score
            }

            function extractNutritionDetail(element: HTMLElement) {
                const score = extractScore(element)
                const titleText = element.getAttribute('title')
                const index = titleText.indexOf('-', 7);
                const title = index !== -1 ? titleText.substring(index + 1).trim() : titleText
                return { score: score, title: title }
            }

            function extractNovaDetail(element: HTMLElement) {
                const score = extractScore(element)
                const titleText = element.getAttribute('title')
                const index = titleText.indexOf('-');
                const title = index !== -1 ? titleText.substring(index + 1).trim() : titleText
                return { score: score, title: title }
            }

            return elements.map((el) => {
                const name = (el.querySelector(".list_product_name") as HTMLElement).innerText;
                const code = extractProductCode(el);
                const nutritionElement = el.querySelector(".list_product_icons:first-child")
                const novaElement = el.querySelector(".list_product_icons:nth-last-child(2)")
                const nutrition = extractNutritionDetail(nutritionElement as HTMLElement)
                const nova = extractNovaDetail(novaElement as HTMLElement)

                return { id: code, name, nutrition: nutrition, nova };
            })
        });
        return products
    }

    private composeUri(nutritionalGradeParam: string, novaGroupParam: string) {
        let path = ""
        if (nutritionalGradeParam) {
            path = `${path}nutrition-grade/${nutritionalGradeParam}/`
        }
        if (novaGroupParam) {
            path = `${path}nova-group/${novaGroupParam}`
        }
        return path
    }
}