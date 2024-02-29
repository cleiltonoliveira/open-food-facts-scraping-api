export default class ProductFilterResult {
  id: string;
  name: string;
  nutrition: {
    score: any;
    title: string;
  };
  nova: {
    score: any;
    title: string;
  };
}