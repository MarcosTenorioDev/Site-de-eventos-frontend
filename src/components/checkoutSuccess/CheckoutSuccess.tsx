import { Check, Ticket } from "lucide-react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "../ui/card";
import Tickets from "../ticketsCards/Tickets";
import { IAddress } from "@/core/interfaces/Address";
import { TicketCard } from "@/core/interfaces/Ticket.interface";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

interface ICheckoutSucess {
	address: IAddress;
	img: string;
	formatedStartDate: Date;
	tickets: TicketCard[];
}
const CheckoutSuccess = (props: ICheckoutSucess) => {
	return (
		<div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-md sm:text-3xl font-bold text-green-600 flex items-center justify-center">
						<Check className="mr-2" /> Checkout Realizado com Sucesso
					</h1>
				</div>

				<Card className="mb-12">
					<CardHeader className="text-center">
						<CardTitle className="text-2xl sm:text-3xl font-bold mb-2">Parabéns! 🎉</CardTitle>
						<CardDescription className="text-md sm:text-xl">
							Seus ingressos foram comprados com sucesso.
						</CardDescription>
					</CardHeader>
					<CardContent className="text-center">
						<p className="text-md sm:text-lg mb-8 text-primary-dark font-semibold">
							Obrigado pela sua compra. Estamos ansiosos para vê-lo(a) no
							evento!
						</p>
						<Link to={"/mytickets"}>
							<Button size="lg" className="w-full sm:w-auto">
								<Ticket className="mr-2 h-5 w-5" /> Ver Meus Ingressos
							</Button>
						</Link>
					</CardContent>
				</Card>

				<div className="bg-[#e2e8f0] border-[#e2e8f0] shadow overflow-hidden sm:rounded-lg">
					<div className="px-4 py-5 sm:px-6">
						<h2 className="text-lg leading-6 font-medium text-gray-900">
							Ingressos comprados :
						</h2>
						<p className="mt-1 max-w-2xl text-sm text-gray-500">
							Veja os seus ingressos comprados abaixo 
						</p>
					</div>
					<div className="border-t border-gray-200">
						<div className="grid w-full gap-4 p-6 max-w-[750px] bg-[#e2e8f0]">
							{props.tickets.map((ticket) => (
								<Tickets
									address={props.address}
									formatedStartDate={props.formatedStartDate}
									img={props.img}
									ticket={ticket}
									key={ticket.id}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CheckoutSuccess;
