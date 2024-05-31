import { AxiosInterceptor } from "../interceptor/axios.interceptor";

class ProducerService {
  private axiosInterceptor: AxiosInterceptor = new AxiosInterceptor();
  private axios = this.axiosInterceptor.getAxiosInstance();

  constructor() {}

  async getAllProducers() {
    const response = await this.axios.get(`${import.meta.env.VITE_API_DEV_URL}/producers`);
    return response.data;
  }

}

export default ProducerService;
