import { Injectable } from "@nestjs/common";

@Injectable()
export class SiteFetcherService {
    fetch(): string {
        return 'Hello World!';
    }
}