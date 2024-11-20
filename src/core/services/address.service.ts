import { AxiosInterceptor } from "../interceptor/axios.interceptor";
import { IAddress } from "../interfaces/Address";

class AddressService {
	private axiosInterceptor: AxiosInterceptor = new AxiosInterceptor();
	private axios = this.axiosInterceptor.getAxiosInstance();

	constructor() {}

	async getAddressById(id: string): Promise<IAddress> {
		const response = await this.axios.get(
			`${import.meta.env.VITE_API_DEV_URL}/address/${id}`
		);
		return response.data;
	}

	async postAddress(payload: IAddress): Promise<IAddress> {
		const response = await this.axios.post(
			`${import.meta.env.VITE_API_DEV_URL}/address`,
			payload
		);
		return response.data;
	}

	async getCities(): Promise<{ city: string }[]> {
		const response = await this.axios.get(
			`${import.meta.env.VITE_API_DEV_URL}/address/cities`
		);
		return response.data;
	}

	async getApiGovAddress(cep: string) {
		const response = await this.axios.get(
			`https://viacep.com.br/ws/${cep}/json/`
		);
		return response.data;
	}
}

export default AddressService;
