import { Injectable } from "@nestjs/common";
import { SiteFetcherService } from "../../../common/browser/site-fetcher.service";
import Product from "../model/product";
import { Page } from "puppeteer";
import NotFoundException from "src/error/custom-exceptions/not-found-exception";

@Injectable()
export class ProductFinderService {

    constructor(private readonly siteFetcherService: SiteFetcherService) { }

    async findProductById(productId: string) {
        const page = await this.siteFetcherService.fetch('https://br.openfoodfacts.org/produto/' + productId)
        await page.waitForSelector('title');
        if (await page.title() == "Erro") {
           throw new NotFoundException(`Product not found for id ${productId}`)
        }
        const foodProduct = new Product();

        await page.waitForSelector('#panel_nutrition_facts_table_content');
        console.log("Starting product extraction...")

        foodProduct.title = await this.getProductTitle(page);
        foodProduct.quantity = await this.getProductQuantity(page);
        foodProduct.ingredients = await this.getProductIngredients(page);;
        foodProduct.nutrition = await this.getProductNutritionDetails(page);

        console.log("Extraction finished!")
        this.siteFetcherService.release(page);

        return foodProduct;
    }

    private async getProductTitle(page: Page) {
        return await page.$eval('.title-1', element => (element as HTMLElement).innerText);
    }

    private async getProductQuantity(page: Page) {
        return await page.$eval('#field_quantity_value', element => (element as HTMLElement).innerText);
    }

    private async getProductIngredients(page: Page) {
        const ingredientList = await page.$$eval('#panel_ingredients_content > div > div > .panel_text', (elements: HTMLElement[]) => elements.map(el => el.innerText));
        const ingAnalyses = await page.$$eval('#panel_ingredients_analysis_content > ul', (elements: HTMLElement[]) => elements.map(el => el.id));

        let hasPalmOil = this.getIngredientAnalysisStatus(ingAnalyses, "en-palm-oil-free", "en-palm-oil-content-unknown");
        let isVegan = this.getIngredientAnalysisStatus(ingAnalyses, "en-non-vegan", "en-vegan-status-unknown");
        let isVegetarian = this.getIngredientAnalysisStatus(ingAnalyses, "en-non-vegetarian", "en-vegetarian-status-unknown");

        let ingredients = { list: ingredientList, hasPalmOil: hasPalmOil, isVegan: isVegan, isVegetarian: isVegetarian }

        return ingredients;
    }

    private getIngredientAnalysisStatus(analysis: string[], negativeTag: string, unknownTag: string): boolean | "unknown" {
        if (analysis.some(value => value.includes(negativeTag))) {
            return false
        } else if (analysis.some(value => value.includes(unknownTag))) {
            return "unknown"
        }
        return true
    }

    private async getProductNutritionDetails(page: Page) {
        const nutriscore = await page.$eval("a[href$='#panel_nutriscore_content'] > img", (element: HTMLElement) => element.getAttribute("src").charAt(element.getAttribute("src").length - 5).toUpperCase());

        let servingSize = await page.evaluate(() => {
            const el = document.querySelector("#panel_serving_size_content > div > div > div") as HTMLElement;
            if (!el) return '';
            return el.innerText.split(":").pop().trim();
        });

        const nutritionValues = await page.$$eval('#panel_nutrient_levels_content > div > ul > li > a', (elements: HTMLElement[]) => elements.map(el => {
            const img = el.children[0] as HTMLElement
            const levelDetail = (el.children[1] as HTMLElement).innerText
            const level = img.getAttribute("src").split("/").pop().replace(".svg", "");
            return [level, levelDetail]
        }));

        const nutritionData = await this.getProductNutritionalData(page);
        const nova = await this.getProductNovaInfo(page);

        let nutrition = { score: nutriscore, values: nutritionValues, servingSize: servingSize, data: nutritionData, nova: nova };

        return nutrition;
    }

    private async getProductNutritionalData(page: Page) {

        const productDataTable = await page.$$eval("#panel_nutrition_facts_table_content table tbody tr", rows => {
            return Array.from(rows, row => {
                const columns = row.querySelectorAll('td');
                return Array.from(columns, column => column.innerText.replace(/\n/g, ""));
            });
        });

        const keys = ["Energia", "Gorduras/lípidos", "Carboidratos", "Fibra alimentar", "Proteínas", "Sal"]

        const nutritionData = productDataTable.filter(row => keys.includes(row[0])) // Filter rows based on condition
            .map(row => {
                const [key, per100g, perServing] = row;
                return { nutritionProperty: key, per100g, perServing };
            });

        return nutritionData
    }
    private async getProductNovaInfo(page: Page) {
        const novaScore = await page.$eval("a[href$='#panel_nova_content'] > img", (element: HTMLElement) => {
            const parts = element.getAttribute("src").split("-");
            const score = parts[parts.length - 1].replace(".svg", "");
            return isNaN(parseInt(score)) ? score : parseInt(score);
        })
        const novaTitle = await page.$eval("a[href$='#panel_nova_content'] > h4", (element: HTMLElement) => element.innerText);

        return { score: novaScore, title: novaTitle }
    }
}