import { AxiosInterceptor } from "../interceptor/axios.interceptor";
import { IPurchaseOrderCreate, IPurchaseOrderReserved } from "../interfaces/PurchaseOrder";

class PurchaseOrderService{
    private axiosInterceptor: AxiosInterceptor = new AxiosInterceptor();
    private axios = this.axiosInterceptor.getAxiosInstance();
  
    constructor(){}


    async PostPurchaseOrder(payload:IPurchaseOrderCreate):Promise<IPurchaseOrderReserved> {
        const response = await this.axios.post(`${import.meta.env.VITE_API_DEV_URL}/purchaseorders`, payload);
        return response.data;
    }

}

export default PurchaseOrderService