import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export class AxiosInterceptor {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create();

    this.axiosInstance.interceptors.request.use(
      this.handleRequest,
      this.handleRequestError
    );

    this.axiosInstance.interceptors.response.use(
      this.handleResponse,
      this.handleResponseError
    );
  }

  private handleRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const cookies = document.cookie;
    const getCookie = (name: string) => {
      const value = `; ${cookies}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    };
    const token = getCookie("__session");
    
    config.headers.Authorization = token

    return config;
  }

  private handleRequestError(error: any) {
    return error;
  }

  private handleResponse(response: AxiosResponse): AxiosResponse {
    return response;
  }

  private handleResponseError(error: any) {
    
    return error;
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}