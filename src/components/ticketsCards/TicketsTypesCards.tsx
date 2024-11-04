import { formatDate } from "@/core/services/helper.service";
import { TicketCheck } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

const TicketsTypesCards = (props: {
	description: string;
	price: number;
	quantity: number;
	salesStartDate: string;
	salesEndDate: string;
}) => {
	const { description, price, quantity, salesEndDate, salesStartDate } = props;
	return (
		<Card className="w-full">
			<CardHeader className="flex items-center justify-start gap-4">
				<TicketCheck className="text-primary w-8 h-8" />
				<h2 className="text-primary font-semibold pb-2">{description}</h2>
			</CardHeader>
			<CardContent className="border-y-2 flex items-center p-4">
				<div className="flex flex-col text-start">
					<div className="flex items-center">
						<h2 className="text-primary font-semibold">Valor: R$</h2>{" "}
						<Badge
							className={`${
								price === 0
									? "bg-muted-foreground hover:bg-gray-600"
									: "bg-green-500 hover:bg-green-300"
							} text-nowrap ml-3 rounded-full`}
						>
							{price === 0 ? "Gratuito" : `R$ ${price.toFixed(2)}`}
						</Badge>
					</div>
					<h2 className="text-primary font-semibold">
						Quantidade disponível:{" "}
						<span className="text-primary-dark">{quantity}</span>
					</h2>
				</div>
			</CardContent>
			<CardFooter className="flex flex-col p-4">
				<h2 className="text-primary-dark font-semibold pb-2  text-start w-full">
					<span className="text-primary">Início das vendas:</span>{" "}
					{formatDate(salesStartDate)}
				</h2>
				<h2 className="text-primary-dark font-semibold pb-2  text-start w-full">
					<span className="text-primary">Fim das vendas:</span>{" "}
					{formatDate(salesEndDate)}
				</h2>
			</CardFooter>
		</Card>
	);
};

export default TicketsTypesCards;
