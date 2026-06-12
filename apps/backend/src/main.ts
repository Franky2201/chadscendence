import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { join } from "path";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.use(
        helmet({
            crossOriginResourcePolicy: { policy: "cross-origin" },
            contentSecurityPolicy: false, // Disable CSP for now as it can block localhost requests
        }),
    );
    app.use(cookieParser());

    const uploadsPath = join(__dirname, "..", "..", "uploads");
    console.log(`[Backend] Serving static assets from: ${uploadsPath}`);

    app.useStaticAssets(uploadsPath, {
        prefix: "/uploads",
        setHeaders: (res) => {
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
