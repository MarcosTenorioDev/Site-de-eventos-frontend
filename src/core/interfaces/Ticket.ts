export type Ticket = {
	ticketTypeId: string;
	purchaseOrderId?: string;
	participantName?: string;
	participantEmail?: string;
	price?: string;
	status?: string;
	cancelledBy?: string;
	purchaseDate?: string;
	seatLocation?: string;
	ticketType: TicketType;
};