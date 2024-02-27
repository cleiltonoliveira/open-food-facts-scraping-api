import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductFilterService {
    fetch(): string {
        return 'Hello World!';
    }
}