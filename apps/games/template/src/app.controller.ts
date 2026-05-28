import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get("info")
    getInfo() {
        return {
            name: "Math Game",
            type: "microservice",
            version: "0.0.1",
            status: "active",
        };
    }
}
