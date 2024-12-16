import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let messageCode = 1000;

    if (exception instanceof HttpException) {
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
    });
  }
}
