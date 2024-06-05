import { AxiosInterceptor } from "../interceptor/axios.interceptor";
import { Address } from "../interfaces/Address";

class AddressService {
	private axiosInterceptor: AxiosInterceptor = new AxiosInterceptor();
	private axios = this.axiosInterceptor.getAxiosInstance();

	constructor() {}

	async getAddressById(id: string): Promise<Address> {
		const response = await this.axios.get(
			`${import.meta.env.VITE_API_DEV_URL}/address/${id}`
		);
		return response.data;
	}

	async postAddress(payload: Address): Promise<Address | any> {
		const response = await this.axios.post(
			`${import.meta.env.VITE_API_DEV_URL}/address`,
			payload
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
