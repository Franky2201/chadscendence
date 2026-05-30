import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "./../src/app.module";
import { RedisService } from "./../src/redis.service";

describe("AppController (e2e)", () => {
    let app: INestApplication<App>;
    const mockRedis = {
        hset: jest.fn().mockResolvedValue(1),
        hdel: jest.fn().mockResolvedValue(1),
        set: jest.fn().mockResolvedValue("OK"),
        get: jest.fn().mockResolvedValue(null),
        del: jest.fn().mockResolvedValue(1),
        quit: jest.fn().mockResolvedValue("OK"),
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(RedisService)
            .useValue({
                getClient: () => mockRedis,
            })
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it("/ (GET)", () => {
        return request(app.getHttpServer())
            .get("/")
            .expect(200)
            .expect("Hello World!");
    });

    afterEach(async () => {
        await app.close();
    });
});
