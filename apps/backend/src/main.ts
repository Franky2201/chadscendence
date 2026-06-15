import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { join } from "path";
import { existsSync, mkdirSync, readFileSync } from "fs";
import { SilentAuthFilter } from "./common/filters/silent-auth.filter";

import { Response } from "express";

async function bootstrap() {
    const certPath = "/etc/backend/tls/server.crt";
    const keyPath = "/etc/backend/tls/server.key";

    let httpsOptions: { cert: Buffer; key: Buffer } | undefined = undefined;
    if (existsSync(certPath) && existsSync(keyPath)) {
        httpsOptions = {
            cert: readFileSync(certPath),
            key: readFileSync(keyPath),
        };
    }

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        httpsOptions,
    });

    app.useGlobalFilters(new SilentAuthFilter());
    app.use(
        helmet({
            crossOriginResourcePolicy: { policy: "cross-origin" },
            contentSecurityPolicy: false, // Disable CSP for now as it can block localhost requests
        }),
    );
    app.use(cookieParser());

    const uploadsPath = join(process.cwd(), "uploads");
    if (!existsSync(uploadsPath)) {
        mkdirSync(uploadsPath, { recursive: true });
    }

    app.useStaticAssets(uploadsPath, {
        prefix: "/uploads",
        setHeaders: (res: Response) => {
            res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        },
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    const configService = app.get(ConfigService);
    const frontendUrl: string =
        configService.get<string>("FRONTEND_URL") ||
        `https://${configService.get<string>("DOMAIN_NAME") || "localhost"}`;
    const allowedOrigins: string[] = frontendUrl
        .split(",")
        .map((url: string) => url.trim());

    app.enableCors({
        origin: allowedOrigins,
        credentials: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        allowedHeaders: "Content-Type, Accept, Authorization",
    });

    app.enableShutdownHooks();

    await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
