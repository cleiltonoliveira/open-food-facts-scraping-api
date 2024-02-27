import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductFinderService {
    fetch(): string {
        return 'Hello World!';
    }
}