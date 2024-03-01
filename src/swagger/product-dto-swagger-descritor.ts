import { ApiProperty } from '@nestjs/swagger';

export default class ProductDtoSwaggerDescritor {
  @ApiProperty({ type: String, description: 'Product title' })
  title: string;

  @ApiProperty({ type: String, description: 'Product quantity' })
  quantity: string;

  @ApiProperty({
    type: 'object',
    properties: {
      hasPalmOil: { oneOf: [{ type: 'string' }, { type: 'boolean' }], description: 'Whether the product contains palm oil' },
      isVegan: { oneOf: [{ type: 'string' }, { type: 'boolean' }], description: 'Whether the product is vegan' },
      isVegetarian: { oneOf: [{ type: 'string' }, { type: 'boolean' }], description: 'Whether the product is vegetarian' },
      list: { type: 'array', items: { type: 'string' }, description: 'List of ingredients' },
    },
    description: 'Product ingredients',
  })
  ingredients: {
    hasPalmOil: Boolean;
    isVegan: Boolean;
    isVegetarian: Boolean;
    list: string[];
  };

  @ApiProperty({
    type: 'object',
    properties: {
      score: { type: 'string', description: 'Nutritional score' },
      values: { type: 'array', items: { type: 'array', items: { type: 'string' } }, description: 'Array of nutritional values' },
      servingSize: { type: 'string', description: 'Serving size' },
      data: {
        type: 'object',
        additionalProperties: {
          type: 'object',
          properties: { per100g: { type: 'string', description: 'Value per 100g' }, perServing: { type: 'string', description: 'Value per serving' }, },
        },
        description: 'Detailed nutritional data',
      },
      nova: {
        type: 'object',
        properties: {
          score: { oneOf: [{ type: 'integer' }, { type: 'string' }], description: 'NOVA score' }, title: { type: 'string', description: 'NOVA title' },
        },
      },
    },
    description: 'Product nutrition',
  })
  nutrition: {
    score: string;
    values: string[][];
    servingSize: string;
    data: Record<string, { per100g: string; perServing: string }>;
    nova: {
      score: any;
      title: string;
    };
  };
}