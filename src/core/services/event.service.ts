import { Params } from "react-router-dom";
import { AxiosInterceptor } from "../interceptor/axios.interceptor";
import {
	IEventById,
	IEventDetails,
	IEventEditPayload,
	IEventSearch,
	IEventsCreated,
	IrecentEvents,
} from "../interfaces/Event.interface";

class EventsService {
	private axiosInterceptor: AxiosInterceptor = new AxiosInterceptor();
	private axios = this.axiosInterceptor.getAxiosInstance();

	constructor() {}

	async getEventById(
		id: string | Readonly<Params<string>>
	): Promise<IEventById> {
		const response = await this.axios.get(
			`${import.meta.env.VITE_API_DEV_URL}/events/${id}`
		);
		return response.data;
	}

	async getRecentEvents(): Promise<IrecentEvents[]> {
		const response = await this.axios.get(
			`${import.meta.env.VITE_API_DEV_URL}/events/recent`
		);
		return response.data;
	}

	async getEventByCategory(categoryId: string) {
		const response = await this.axios.get(
			`${import.meta.env.VITE_API_DEV_URL}/events/category/${categoryId}`
		);
		return response.data;
	}

	async getEventByCreatorId(): Promise<IEventsCreated[]> {
		const response = await this.axios.get(
			`${import.meta.env.VITE_API_DEV_URL}/events/created`
		);
		return response.data;
	}

	async postEvent(event: any) {
		const response = await this.axios.post(
			`${import.meta.env.VITE_API_DEV_URL}/events`,
			event
		);
		return response.data;
	}

	async getUserEvents() {
		const response = await this.axios.get(
			`${import.meta.env.VITE_API_DEV_URL}/users/events`
		);
		return response.data;
	}
	async getEventDetails(id: string): Promise<IEventDetails> {
		const response = await this.axios.get(
			`${import.meta.env.VITE_API_DEV_URL}/events/details/${id}`
		);
		return response.data;
	}

	async updateEvent(
		payload: IEventEditPayload,
		id: string
	): Promise<IEventDetails> {
		const response = await this.axios.put(
			`${import.meta.env.VITE_API_DEV_URL}/events/${id}`,
			payload
		);
		return response.data;
	}

	async getEventByName(searchTerm: string): Promise<IEventSearch[]> {
		const response = await this.axios.get(
			`${import.meta.env.VITE_API_DEV_URL}/events/title/${searchTerm}`
		);
		return response.data;
	}
}

export default EventsService;
