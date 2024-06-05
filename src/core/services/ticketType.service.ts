import { AxiosInterceptor } from "../interceptor/axios.interceptor";

class TicketTypeService{
    private axiosInterceptor: AxiosInterceptor = new AxiosInterceptor();
    private axios = this.axiosInterceptor.getAxiosInstance();
  
    constructor(){}


    async postTicketType(ticketType:TicketTypeCreate) {
        const response = await this.axios.post(`${import.meta.env.VITE_API_DEV_URL}/tickettypes`, ticketType);
        return response.data;
      }

}

export default TicketTypeService