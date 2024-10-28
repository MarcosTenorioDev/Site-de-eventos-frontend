import { AxiosInterceptor } from "../interceptor/axios.interceptor";
import { IPurchaseOrderCreate, IPurchaseOrderReserved, IPurchaseOrderReservedById } from "../interfaces/PurchaseOrder";

class PurchaseOrderService{
    private axiosInterceptor: AxiosInterceptor = new AxiosInterceptor();
    private axios = this.axiosInterceptor.getAxiosInstance();
  
    constructor(){}


    async PostPurchaseOrder(payload:IPurchaseOrderCreate):Promise<IPurchaseOrderReserved> {
        const response = await this.axios.post(`${import.meta.env.VITE_API_DEV_URL}/purchaseorders`, payload);
        return response.data;
    }

    async GetPurchaseOrderReservedById(id:string):Promise<IPurchaseOrderReservedById> {
        const response = await this.axios.get(`${import.meta.env.VITE_API_DEV_URL}/purchaseorders/reserved/${id}`);
        return response.data;
    }

}

export default PurchaseOrderService