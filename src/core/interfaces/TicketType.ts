export interface TicketType {
	id: string;
	eventId?: string;
	description: string;
	price?: number;
	quantity: number;
	salesStartDate: string;
	salesEndDate: string;
	isActive: boolean;
}

export interface ITicketTypeForm {
	id?: string;
	eventId: string;
	description: string;
	price: number;
	quantity: number;
	salesStartDate: string;
	salesEndDate: string;
	isActive: boolean;
	reservedQuantity: number | null;
}

export interface EditTicketType {
	quantity: number;
	salesStartDate: Date | string;
	salesEndDate: Date | string;
	isActive: boolean;
	eventId: string;
}

export interface TicketTypeCreate {
	eventId: string;
	description: string;
	price: number;
	quantity: number;
	salesStartDate: string;
	salesEndDate: string;
	isActive: boolean;
}

export interface TicketTypePayload {
	description: string;
	price: number;
	quantity: number;
	salesStartDate: string;
	salesEndDate: string;
	isActive: boolean;
}
