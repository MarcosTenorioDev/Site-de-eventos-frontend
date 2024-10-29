import { IAddress } from "./Address";
import { IAssets } from "./Assets.interface";
import { ICategory } from "./Categories.interface";
import { IProducer } from "./Producer.interface";
import { TicketCard } from "./Ticket.interface";

export type IPurchaseOrder = {
	id: string;
	eventId: string;
	status: string;
	totalPrice: number;
	createdAt: string;
	quantityTickets: number;
	tickets: TicketCard[];
};

export interface IPurchaseOrderCreate {
	eventId: string;
	ticketTypes: { ticketTypeId: string }[];
}

export interface IPurchaseOrderReserved {
	id: string;
	eventId: string;
	totalPrice: number;
	quantityTickets: number;
	status: "reserved";
	createdAt: Date;
	updatedAt: Date;
	reservationExpiresAt: Date;
	reservedTicketTypes: {
		ticketTypeId: string;
		purchaseOrderId: string;
		quantity: number;
	}[];
}

export interface IPurchaseOrderCompleted{
	id: string;
	eventId: string;
	totalPrice: number;
	quantityTickets: number;
	status: "reserved";
	createdAt: Date;
	updatedAt: Date;
	reservationExpiresAt: Date;
	reservedTicketTypes:[];
	tickets:TicketCard[]
}

export interface IPurchaseOrderReservedById {
	id: string;
	userId: string;
	eventId: string;
	totalPrice: number;
	quantityTickets: number;
	status: string;
	createdAt: string;
	updatedAt: string;
	reservationExpiresAt: string;
	reservedTicketTypes: ReservedTicketType[];
	event: Event;
}

interface ReservedTicketType {
	ticketTypeId: string;
	purchaseOrderId: string;
	quantity: number;
	ticketType: TicketType;
}

interface TicketType {
	description: string;
	price: number;
}

interface Event {
	ageRating: number;
	Address: IAddress;
	producers: IProducer;
	category: ICategory;
	startDate: string;
	endDate: string;
	title: string;
	assets: IAssets[];
}

export interface ReservePurchaseOrderPayload {
	eventId: string;
	ticketTypes: { participantName: string; participantEmail: string; ticketTypeId: string }[];
}
