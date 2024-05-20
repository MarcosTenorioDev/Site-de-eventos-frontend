import { Params } from "react-router-dom";
import { AxiosInterceptor } from "../interceptor/axios.interceptor";

class EventsService {
  private axiosInterceptor: AxiosInterceptor = new AxiosInterceptor();
  private axios = this.axiosInterceptor.getAxiosInstance();

  constructor() {}

  async getEventById(id:string | Readonly<Params<string>>) {
    const response = await this.axios.get(`${import.meta.env.VITE_API_DEV_URL}/events/${id}`);
    return response.data;
  }

  async getEventByCategory(category: string){
    const response = await this.axios.get(`${import.meta.env.VITE_API_DEV_URL}/events/${category}`);
    return response.data
  }

}

export default EventsService;
