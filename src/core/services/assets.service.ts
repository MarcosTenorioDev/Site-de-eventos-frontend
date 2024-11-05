import { AxiosInterceptor } from "../interceptor/axios.interceptor";

class AssetsService {
	private axiosInterceptor: AxiosInterceptor = new AxiosInterceptor();
	private axios = this.axiosInterceptor.getAxiosInstance();

	constructor() {}

	async postAssets(payload: FormData) {
		const response = await this.axios.post(
			`${import.meta.env.VITE_API_DEV_URL}/assets/upload`,
			payload
		);
		return response.data;
	}

	async deleteAssetById(id: string) {
		const response = await this.axios.delete(
			`${import.meta.env.VITE_API_DEV_URL}/assets/${id}`
		);
		return response.data;
	}
}

export default AssetsService;
