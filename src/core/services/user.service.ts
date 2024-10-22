import { AxiosInterceptor } from "../interceptor/axios.interceptor";
import { User } from "../interfaces/User";

class UserService {
  private axiosInterceptor: AxiosInterceptor = new AxiosInterceptor();
  private axios = this.axiosInterceptor.getAxiosInstance();

  constructor() {}

  //Ajustar função, não precisa de trycatch se os interceptors estiverem funcionando normalmente
  async getUser(): Promise<User> {
    const response = await this.axios.get(`${import.meta.env.VITE_API_DEV_URL}/users`);
    return response.data;
  }

  async patchUserAditionalInfo(payload: object) {
    const response = await this.axios.patch(
      `${import.meta.env.VITE_API_DEV_URL}/users`,
      payload
    );
    return response.data;
  }
}

export default UserService;
