export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export class ApiResponse {
  static success<T>(data: T, message = "Success"): IApiResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message = "Error", error?: any): IApiResponse {
    return {
      success: false,
      message,
      error,
    };
  }
}
