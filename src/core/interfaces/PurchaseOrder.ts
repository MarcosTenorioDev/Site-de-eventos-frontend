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
