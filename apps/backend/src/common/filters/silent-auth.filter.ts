import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class SilentAuthFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = Number(exception.getStatus());
        const msg: unknown = exception.getResponse();

        // If it's a 401, 403 or 409, return 200 but with the error info
        // This avoids red console logs in the browser while letting the frontend know what happened.
        if (status === 401 || status === 403 || status === 409) {
            let message = "Error";

            if (typeof msg === "string") {
                message = msg;
            } else if (this.isMessageObject(msg)) {
                message = String(msg.message);
            }

            return response.status(HttpStatus.OK).json({
                success: false,
                statusCode: status,
                message,
                error: true,
            });
        }

        response.status(status).json(msg);
    }

    private isMessageObject(obj: unknown): obj is { message: unknown } {
        return (
            typeof obj === "object" &&
            obj !== null &&
            "message" in (obj as Record<string, unknown>)
        );
    }
}
