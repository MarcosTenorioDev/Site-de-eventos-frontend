import { AxiosInterceptor } from "../interceptor/axios.interceptor";

class CategoriesService{
    private axiosInterceptor: AxiosInterceptor = new AxiosInterceptor();
    private axios = this.axiosInterceptor.getAxiosInstance();
  
    constructor(){}


    async getCategories() {
        const response = await this.axios.get(`${import.meta.env.VITE_API_DEV_URL}/eventcategories`);
        return response.data;
      }

}

export default CategoriesService