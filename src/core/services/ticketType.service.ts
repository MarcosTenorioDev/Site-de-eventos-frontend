import { AxiosInterceptor } from "../interceptor/axios.interceptor";
import { EditTicketType, TicketTypeCreate } from "../interfaces/TicketType";

class TicketTypeService {
	private axiosInterceptor: AxiosInterceptor = new AxiosInterceptor();
	private axios = this.axiosInterceptor.getAxiosInstance();

	constructor() {}

	async postTicketType(ticketType: TicketTypeCreate) {
		const response = await this.axios.post(
			`${import.meta.env.VITE_API_DEV_URL}/ticketType`,
			ticketType
		);
		return response.data;
	}

	async updateTicketType(ticketType: EditTicketType, id: string) {
		const response = await this.axios.put(
			`${import.meta.env.VITE_API_DEV_URL}/ticketType/${id}`,
			ticketType
		);
		return response.data;
	}
}

export default TicketTypeService;
