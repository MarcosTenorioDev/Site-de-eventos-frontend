import { IAddress } from "./Address";
import { IAssets } from "./Assets.interface";
import { IProducer } from "./Producer.interface";

export interface IrecentEvents {
	addressId: string;
	assets: IAssets[];
	id: string;
	startDate: Date;
	title: string;
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
    status:string
}