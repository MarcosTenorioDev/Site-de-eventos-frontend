import { AxiosResponse } from "axios";
import { AxiosInterceptor } from "../interceptor/axios.interceptor";
import { ICategory } from "../interfaces/Categories.interface";

class CategoriesService{
    private axiosInterceptor: AxiosInterceptor = new AxiosInterceptor();
    private axios = this.axiosInterceptor.getAxiosInstance();
  
    constructor(){}


    async getCategories(): Promise<ICategory[]> {
        const response = await this.axios.get(`${import.meta.env.VITE_API_DEV_URL}/event/categories`);
        return response.data;
      }

}

export default CategoriesService