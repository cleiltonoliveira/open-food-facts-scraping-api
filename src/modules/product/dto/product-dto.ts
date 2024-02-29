export default class ProductDto {
  title: string;
  quantity: string;
  ingredients: {
    hasPalmOil: any;
    isVegan: any;
    isVegetarian: any;
    list: string[];
  };
  nutrition: {
    score: string;
    values: string[][];
    servingSize: string;
    data: Record<string, { per100g: string; perServing: string }>;
    nova: {
      score: any;
      title: string;
    };
  }
}