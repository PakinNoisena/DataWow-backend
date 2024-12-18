import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ZodError } from "zod";
import { ZodValidationException } from "nestjs-zod"; // Assuming this is the error class

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let messageCode = 1000;
    let errorDetails = null;

    // Check if the exception is an instance of ZodValidationException
    if (exception instanceof ZodValidationException) {
      // Extract the ZodError from the ZodValidationException
      const zodError = (exception as any).error as ZodError;
      if (zodError && zodError.errors) {
        status = HttpStatus.BAD_REQUEST;
        message = zodError.errors.map((error) => error.message).join(", ");
        messageCode = 1001;
        errorDetails = zodError.errors;
      }
    }

    // Handle general HttpException (like NotFoundException)
    else if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      status = exception.getStatus();
      if (typeof exceptionResponse === "object") {
        const { message: customMessage, messageCode: customCode } =
          exceptionResponse as any;
        if (customMessage) message = customMessage;
        if (customCode) messageCode = customCode;
      }
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      messageCode,
      errorDetails,
    });
  }
}
