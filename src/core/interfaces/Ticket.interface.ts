export type Ticket = {
	id: string;
	participantEmail: string;
	participantName: string;
	price: number;
	purchaseDate: string;
	seatLocation: string | null;
	status: string;
	ticketTypeId: string;
};
export type TicketCard = {
	id: string;
	participantEmail: string;
	participantName: string;
	price: number;
	purchaseDate: string;
	seatLocation: string | null;
	status: string | null;
	ticketTypeId: string;
	ticketType?: {
		description: string;
		isActive: boolean;
		price: number;
	};
};

export type TicketPurchaseOrder = {
	id: string;
	description: string;
	price: number;
	quantityAvailablePerUser: number;
};
