import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { ValidationPipe, Logger } from "@nestjs/common";

async function bootstrap() {
    const logger = new Logger("Bootstrap");

    // Hybrid Application: Supports both HTTP (for health checks) and Redis Microservice
    const app = await NestFactory.create(AppModule);

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.REDIS,
        options: {
            host: process.env.REDIS_HOST ?? "localhost",
            port: parseInt(process.env.REDIS_PORT ?? "6379", 10),
        },
    });

    app.useGlobalPipes(new ValidationPipe());

    const httpPort = process.env.PORT ?? 3001;
    await app.startAllMicroservices();
    await app.listen(httpPort);

    logger.log(
        `Game template HTTP server running on: http://localhost:${httpPort}`,
    );
    logger.log(
        `Game template Redis microservice is connected to: ${process.env.REDIS_HOST ?? "localhost"}:${process.env.REDIS_PORT ?? "6379"}`,
    );
}
void bootstrap();
