export interface HttpExceptionResponse {
  statusCode: number;
  error: {
    message: string;
  };
}

export interface CustomHttpExceptionResponse extends HttpExceptionResponse {
  path: string;
  method: string;
  timeStamp: Date;
}
