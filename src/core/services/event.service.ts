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

  async getRecentEvents(){
    const response = await this.axios.get(`${import.meta.env.VITE_API_DEV_URL}/events/recent`);
    return response.data
  }

  async getEventByCategory(categoryId:string){
    const response = await this.axios.get(`${import.meta.env.VITE_API_DEV_URL}/events/category/${categoryId}`);
    return response.data
  }

  async getUserEvents(){
    const response = await this.axios.get(`${import.meta.env.VITE_API_DEV_URL}/users/events`)
    return response.data
  }

}

export default EventsService;
