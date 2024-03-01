import { ApiProperty } from '@nestjs/swagger';
export default class ErrorResponse {
    @ApiProperty({ type: 'integer', example: 404 })
    statusCode: number
    @ApiProperty({ type: 'string' })
    timestamp: string
    @ApiProperty({ type: 'string' })
    path: string
    @ApiProperty({ type: 'string' })
    message: string
}