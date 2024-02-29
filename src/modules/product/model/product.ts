export default class Product {
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
    data: {
      nutritionProperty: string
      per100g: string;
      perServing: string;
    }[];
    nova: {
      score: any;
      title: string;
    };
  }
}