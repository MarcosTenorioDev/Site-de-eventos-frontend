import { AxiosInterceptor } from "../interceptor/axios.interceptor";
import { PurchaseOrder } from "../interfaces/PurchaseOrder";

class PurchaseOrderService{
    private axiosInterceptor: AxiosInterceptor = new AxiosInterceptor();
    private axios = this.axiosInterceptor.getAxiosInstance();
  
    constructor(){}


    async PostPurchaseOrder(payload:PurchaseOrder) {
        const response = await this.axios.post(`${import.meta.env.VITE_API_DEV_URL}/purchaseorder`, payload);
        return response.data;
    }

}

export default PurchaseOrderService