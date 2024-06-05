import { formatDate } from "@/core/services/helper.service";
import { TicketCheck } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";

const TicketsTypesCards = (props: {
	id: string;
	description: string;
	price: number | undefined;
	quantity: number;
	salesStartDate: string;
	salesEndDate: string;
}) => {
	const { id, description, price, quantity, salesEndDate, salesStartDate } =
		props;
	return (
		<Card className="w-full" key={id}>
			<CardHeader className="flex items-center justify-start gap-4">
				<TicketCheck className="text-primary w-8 h-8" />
				<h2 className="text-primary font-semibold pb-2">{description}</h2>
			</CardHeader>
			<CardContent className="border-y-2 flex items-center p-4">
				<div className="flex flex-col text-start">
					<h2 className="text-primary font-normal">Valor: R$ {price}</h2>
					<h2 className="text-primary font-normal">
						Quantidade disponível: {quantity}
					</h2>
				</div>
			</CardContent>
			<CardFooter className="flex flex-col p-4">
				<h2 className="text-primary font-normal pb-2  text-start w-full">
					<span className="text-primary-dark">Início das vendas:</span>{" "}
					{formatDate(salesStartDate)}
				</h2>
				<h2 className="text-primary font-normal pb-2  text-start w-full">
					<span className="text-primary-dark">Fim das vendas:</span>{" "}
					{formatDate(salesEndDate)}
				</h2>
			</CardFooter>
		</Card>
	);
};

export default TicketsTypesCards;
