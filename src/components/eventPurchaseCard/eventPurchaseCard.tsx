import { IEventById } from "@/core/interfaces/Event.interface";
import { TicketPurchaseOrder } from "@/core/interfaces/Ticket.interface";
import PurchaseOrderService from "@/core/services/purchaseOrder.service";
import { SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { InfoCircledIcon, MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

interface IEventPurchaseCard {
	tickets: TicketPurchaseOrder[];
	event: IEventById;
	ticketsPurchased: number;
	isLoadedTicketsPurchased: boolean;
}

const EventPurchaseCard = (props: IEventPurchaseCard) => {
	const { tickets, event, ticketsPurchased, isLoadedTicketsPurchased } = props;
	const purchaseOrderService = new PurchaseOrderService();
	const [ticketCounts, setTicketCounts] = useState<Record<string, number>>(
		tickets.reduce((acc, ticket) => {
			acc[ticket.id] = 0;
			return acc;
		}, {} as Record<string, number>)
	);
	const [total, setTotal] = useState<number>(0);
	const ticketSelectedCount = Object.values(ticketCounts).reduce(
		(sum, count) => sum + count,
		0
	);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleIncrement = (ticketId: string, price: number) => {
		setTicketCounts((prev) => ({
			...prev,
			[ticketId]: prev[ticketId] + 1,
		}));
		setTotal((prev) => prev + price);
	};

	const handleDecrement = (ticketId: string, price: number) => {
		setTicketCounts((prev) => ({
			...prev,
			[ticketId]: Math.max(prev[ticketId] - 1, 0),
		}));
		setTotal((prev) => (prev - price >= 0 ? prev - price : 0));
	};

	const handleSubmit = async () => {
		const values = Object.entries(ticketCounts).flatMap(
			([ticketId, quantity]) => Array(quantity).fill({ ticketTypeId: ticketId })
		);

		const payload = {
			eventId: event.id,
			ticketTypes: values,
		};

		setIsLoading(true);
		await purchaseOrderService
			.PostPurchaseOrder(payload)
			.then((reserverdPurchaseOrder) =>
				navigate(`/checkout/${reserverdPurchaseOrder.id}`)
			)
			.catch((err) => console.log(err))
			.finally(() => setIsLoading(false));
	};

	return (
		<Card className="min-w-[280px] md:min-w-[330px] h-min">
			<CardHeader className="bg-primary-dark text-white font-primary rounded-t-sm p-3">
				Ingressos
			</CardHeader>
			{tickets.length ? (
				<>
					<CardContent className="p-4 min-w-64">
						{tickets.map((ticket) => (
							<div
								key={ticket.id}
								className={`flex items-center border-b last:border-b-0 last:pb-0 py-2 ${
									ticket.quantityAvailablePerUser === 0 ||
									event.maxTicketsPerUser <= ticketsPurchased
										? "opacity-50"
										: ""
								}`}
							>
								<div className="w-full">
									<p className="font-semibold text-lg">{ticket.description}</p>
									<p className="text-sm text-primary">R$ {ticket.price}</p>
									{ticket.quantityAvailablePerUser === 0 && (
										<p className="text-xs text-gray-500 italic">Esgotado</p>
									)}
								</div>
								<div className="flex items-center">
									<Button
										variant="ghost"
										className="p-0"
										type="button"
										onClick={() => handleDecrement(ticket.id, ticket.price)}
										disabled={ticket.quantityAvailablePerUser === 0}
									>
										<MinusIcon />
									</Button>
									<span className="mx-2">{ticketCounts[ticket.id]}</span>
									<Button
										variant="ghost"
										className="p-0"
										type="button"
										onClick={() => handleIncrement(ticket.id, ticket.price)}
										disabled={
											ticket.quantityAvailablePerUser === 0 ||
											event.maxTicketsPerUser <=
												ticketSelectedCount + ticketsPurchased ||
											ticketCounts[ticket.id] >=
												ticket.quantityAvailablePerUser ||
											!isLoadedTicketsPurchased
										}
									>
										<PlusIcon />
									</Button>
								</div>
							</div>
						))}

						{event.maxTicketsPerUser <= ticketsPurchased && (
							<p className="text-muted-foreground text-sm sm:text-xs flex items-center justify-start gap-2 mt-3">
								<InfoCircledIcon className="w-4 h-4 min-w-4 min-h-4" />
								Você atingiu o limite de tickets para este evento.
							</p>
						)}
					</CardContent>
					<CardFooter className="flex flex-col relative border-t">
						<div className="w-full">
							<h3 className="text-md mt-4">Total</h3>
							<h3 className="text-lg text-primary">R$ {total.toFixed(2)}</h3>
						</div>
						<SignedIn>
							<Button
								type="button"
								className="absolute -bottom-5 mx-auto text-lg"
								onClick={handleSubmit}
								disabled={
									ticketSelectedCount === 0 ||
									isLoading ||
									event.maxTicketsPerUser <= ticketsPurchased
								}
							>
								{ticketSelectedCount === 0 ? (
									"Selecione um ingresso"
								) : isLoading ? (
									"Carregando..."
								) : (
									<>
										Comprar ingresso
										<PlusIcon className="ml-2" />
									</>
								)}
							</Button>
						</SignedIn>
						<SignedOut>
							<Button
								asChild
								type="button"
								className="absolute -bottom-5 mx-auto text-lg"
							>
								<SignInButton
									mode="modal"
									forceRedirectUrl={`/event/${event.id}`}
									fallbackRedirectUrl={`/event/${event.id}`}
									signUpForceRedirectUrl={`/event/${event.id}`}
									signUpFallbackRedirectUrl={`/event/${event.id}`}
								>
									Comprar ingresso
								</SignInButton>
							</Button>
						</SignedOut>
					</CardFooter>
				</>
			) : (
				<CardContent className="p-4 w-64 mx-auto text-center">
					<h3 className="w-full font-bold text-muted-foreground text-xl">
						Oops... Parece que ainda não há ingressos disponíveis para venda
					</h3>
				</CardContent>
			)}
		</Card>
	);
};

export default EventPurchaseCard;
