import { ApiProperty } from '@nestjs/swagger';

export default class ProductFilterResultSwaggerDescritor {
  
  @ApiProperty({ type: String, description: 'Product bar code' })
  id: string;

  @ApiProperty({ type: String, description: 'Product name' })
  name: string;
  
  @ApiProperty({
    type: 'object',
    properties: {
      score: { type: 'string', description: 'Product score' },
      title: { type: 'string', description: 'Description of the Nutri-Score classification' }
    },
    description: 'Details about the Nutri-Score classification',
  })
  nutrition: {
    score: any;
    title: string;
  };

  @ApiProperty({
    type: 'object',
    properties: {
      score: { oneOf: [{ type: 'integer' }, { type: 'string' }], description: 'Product score' },
      title: { type: 'string', description: 'Description of the NOVA classification' }
    },
    description: 'Details about the NOVA classification',
  })
  nova: {
    score: any;
    title: string;
  };
}