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
        const status = exception.getStatus();
        const msg: string | object = exception.getResponse();

        // If it's a 401 or 403, return 200 but with the error info
        // This avoids red console logs in the browser while letting the frontend know what happened.

        if (status === 401 || status === 403) {
            let message = "Unauthorized";
            if (typeof msg === "string") {
                message = msg;
            } else if (
                typeof msg === "object" &&
                msg !== null &&
                "message" in msg
            ) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                message = String((msg as any).message);
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
}
