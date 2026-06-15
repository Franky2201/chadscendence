import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class SilentAuthFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = "Internal Server Error";

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            if (typeof res === "string") {
                message = res;
            } else if (this.isMessageObject(res)) {
                message = String(res.message);
            }
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        // Return 200 but with the error info
        // This avoids red console logs in the browser while letting the frontend know what happened.
        return response.status(HttpStatus.OK).json({
            success: false,
            statusCode: status,
            message,
            error: true,
        });
    }

    private isMessageObject(obj: unknown): obj is { message: unknown } {
        return (
            typeof obj === "object" &&
            obj !== null &&
            "message" in (obj as Record<string, unknown>)
        );
    }
}
