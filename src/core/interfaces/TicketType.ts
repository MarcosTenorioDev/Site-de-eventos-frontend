type TicketType = {
	id:string;
	eventId?: string;
	description: string;
	price?: number;
	quantity: number;
	salesStartDate:string;
	salesEndDate:string;
	isActive: boolean;
};

type TicketTypeCreate = {
	eventId: string;
	description: string;
	price: number;
	quantity: number;
	salesStartDate:string;
	salesEndDate:string;
	isActive: boolean;
};
