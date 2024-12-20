import { IAddress } from "./Address";
import { IAssets } from "./Assets.interface";
import { IProducer } from "./Producer.interface";
import { TicketType } from "./TicketType";

export interface IrecentEvents {
	addressId: string;
	assets: IAssets[];
	Address: IAddress;
	id: string;
	startDate: string;
	title: string;
}

export interface IEventPayload {
	title: string;
	description: string;
	capacity: number;
	categoryId: string;
	startDate: Date;
	endDate: Date;
	format: string;
	ageRating: number;
	maxTicketsPerUser: number;
	additionalDetails: string;
	producerId: string;
	addressId: string;
}

export interface IEventEditPayload {
	title: string;
	description: string;
	capacity: number;
	categoryId: string;
	startDate: Date;
	endDate: Date;
	status: string;
	format: string;
	ageRating: number;
	maxTicketsPerUser: number;
	additionalDetails: string;
	producerId: string;
	addressId: string;
}

export interface IEventDetails {
	id: string;
	title: string;
	description: string;
	capacity: number;
	categoryId: string;
	startDate: Date;
	endDate: Date;
	status: string;
	format: string;
	ageRating: number;
	maxTicketsPerUser: number;
	additionalDetails: string;
	producerId: string;
	addressId: string;
	Address: IAddress;
	ticketTypes: TicketType[];
	assets: IAssets[];
}

export interface IEventById {
	Address: IAddress;
	addressId: string;
	additionalDetails: string;
	ageRating: number;
	assets: IAssets[];
	attractions: any[]; //Verificar posteriormente
	capacity: number;
	categoryId: string;
	creatorId: string;
	description: string;
	endDate: string;
	format: string;
	id: string;
	maxTicketsPerUser: number;
	producerId: string;
	producers: IProducer;
	salesStardDate: string;
	showStartDate: string;
	startDate: string;
	status: string; //Verificar posteriormente
	ticketTypes: any[];
	title: string;
}

export interface IEventsCreated {
	id: string;
	title: string;
	addressId: string;
	startDate: Date;
	description: string;
	endDate: Date;
	format: string;
	assets: IAssets[];
	Address: IAddress;
	status: string;
}

export interface IEventSearch {
	id: string;
	title: string;
	status: string;
	assets: IAssets[];
}

export interface IEventFilter {
    cities: string;
    categoryId?: string;
    dateRange?: { to?: string | Date; from?: string | Date };
  }
