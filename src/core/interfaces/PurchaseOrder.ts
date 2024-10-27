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
	eventId:string,
	ticketTypes: {ticketTypeId:string}[]
};

export interface IPurchaseOrderReserved {
	id:string,
	eventId:string,
	totalPrice:number,
	quantityTickets:number,
	status:"reserved",
	createdAt:Date,
	updatedAt:Date,
	reservationExpiresAt:Date,
	reservedTicketTypes:{ticketTypeId:string,purchaseOrderId:string, quantity:number}[]
};
