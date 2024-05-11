import { AxiosInterceptor } from "../interceptor/axios.interceptor";

class UserService {
  private axiosInterceptor: AxiosInterceptor = new AxiosInterceptor();
  private axios = this.axiosInterceptor.getAxiosInstance();


  constructor() {}

  //Ajustar função, não precisa de trycatch se os interceptors estiverem funcionando normalmente
    async getUser() {
    try {
      const response = await this.axios.get(
        `${import.meta.env.VITE_API_DEV_URL}/users`
      );
      return response.data;
    } catch (error) {

      /* throw error; */
    }
  }

  putUserAditionalInfo() {}
}

export default UserService;
