import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/core/services/helper.service";
import { Calendar, Ticket } from "lucide-react";

import { ITicketTypeForm } from "@/core/interfaces/TicketType";
import { Badge } from "../ui/badge";
import { TicketTypeForm } from "./TicketTypeForm";

interface EditTicketTypeCardProps {
	ticket: ITicketTypeForm;
}

export default function EditTicketTypeCard(props: EditTicketTypeCardProps) {
	const { ticket } = props;

	return (
		<Card className="flex-grow max-w-xl bg-gradient-to-br from-blue-600 to-primary-light hover:scale-105 transition-all text-white border-none shadow-lg overflow-hidden">
			<CardContent className="p-0">
				<div className="relative p-6 pb-12">
					<div className="flex flex-col items-center space-y-2 text-center relative">
						<TicketTypeForm
							ticket={ticket}
							mode="edit"
							eventId={ticket.eventId}
						/>
						<Ticket className="h-8 w-8 mb-2" />
						<p className="text-lg font-semibold">{ticket.description}</p>
					</div>
				</div>
				<div className="bg-white text-gray-800 p-6 rounded-t-[2.5rem] space-y-6">
					<Badge
						className={`${
							ticket.isActive
								? "bg-green-500 hover:bg-green-400"
								: "bg-gray-500 hover:bg-gray-400"
						} cursor-default`}
					>
						{ticket.isActive ? "Ativo" : "Inativo"}
					</Badge>
					<div className="flex justify-between items-center">
						<span className="text-lg font-semibold">Valor</span>
						<span className="text-2xl font-bold">
							R${ticket.price?.toFixed(2)}
						</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-lg font-semibold">Nº Ingressos</span>
						<div className="flex items-center space-x-2">
							<span className="text-xl font-bold w-8 text-center">
								{ticket.quantity}
							</span>
						</div>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-lg font-semibold">Quant. Reservada</span>
						<div className="flex items-center space-x-2">
							<span className="text-xl font-bold w-8 text-center">
								{ticket.reservedQuantity}
							</span>
						</div>
					</div>
					<div className="flex items-center">
						<div className="flex items-center space-x-2">
							<Calendar className="h-5 w-5 text-blue-500" />
							<span className="text-sm font-medium">Início das vendas</span>
						</div>
						<p className="text-sm pl-7">{formatDate(ticket.salesStartDate)}</p>
					</div>
					<div className="flex items-center">
						<div className="flex items-center space-x-2">
							<Calendar className="h-5 w-5 text-blue-500" />
							<span className="text-sm font-medium">Fim das vendas</span>
						</div>
						<p className="text-sm pl-7">{formatDate(ticket.salesEndDate)}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
