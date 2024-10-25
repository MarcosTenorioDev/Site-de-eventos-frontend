import { Field, Formik, Form } from "formik";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import PurchaseOrderService from "@/core/services/purchaseOrder.service";
import { SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { User } from "@/core/interfaces/User";
import { formatDate } from "@/core/services/helper.service";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToastContext, ToastType } from "@/core/contexts/toasts.context";
import { TicketPurchaseOrder } from "@/core/interfaces/Ticket.interface";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import UserService from "@/core/services/user.service";
import { IEventById } from "@/core/interfaces/Event.interface";

interface IEventPurchaseCard {
	tickets: TicketPurchaseOrder[];
    event: IEventById;
    id?: string
}

const EventPurchaseCard = (props: IEventPurchaseCard) => {
	const { tickets, event, id } = props;
	const [total, setTotal] = useState<number>(0);
	const initialValues = {
		tickets,
		promoCode: "",
	};
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [user, setUser] = useState<User>();
	const purchaseOrderService = new PurchaseOrderService();
	const toastService = useToastContext();
	const [selectedTickets, setSelectedTickets] =
		useState<{ description: string; quantity: number }[]>();
	const userService = new UserService();
	const toast = useToastContext();

	const calculateTotal = (tickets: typeof initialValues.tickets) => {
		const newTotal = tickets.reduce((acc, ticket) => {
			return acc + parseFloat(ticket.price) * ticket.quantity;
		}, 0);

		setTotal(newTotal);
	};

	const getTicketsSelected = (
		tickets: { description: string; quantity: number }[]
	) => {
		const filteredTickets = tickets.filter((ticket) => ticket.quantity > 0);
		setSelectedTickets(filteredTickets);
	};

	const onSubmit = async (values: any) => {
		const hasTickets = values.tickets.find(
			(ticket: any) => ticket.quantity !== 0
		);

		if (!hasTickets) {
			toastService.showToast("Selecione um ingresso", ToastType.Error);
			return;
		}

		if (id && user) {
			setIsLoading(true);
			values.tickets.map((ticket: TicketPurchaseOrder) => {
				if (ticket.quantity <= 0) return;
				const payload: any = {
					eventId: id,
					participantEmail: user.email,
					participantName: user.firstName + " " + user.lastName,
					quantityTickets: ticket.quantity,
					status: "pendente",
					ticketTypeId: ticket.id,
					userId: user.id,
				};
				purchaseOrderService
					.PostPurchaseOrder(payload)
					.then(() => {
						toast.showToast("Incrição feita com sucesso", ToastType.Success);

						setIsLoading(false);
					})
					.catch(() => {
						toast.showToast(
							`Houve um erro ao processar sua incrição para o ticket ${ticket.description}`,
							ToastType.Error
						);
						setIsLoading(false);
					});
			});
		}
	};

	userService.getUser().then((user) => {
		if (user) {
			setUser(user);
		}
	});

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
			enableReinitialize={true}
		>
			{({ values, setFieldValue }) => (
				<Form>
					<Card className="min-w-[280px] md:min-w-[330px]">
						<CardHeader className="bg-primary-dark text-white font-primary rounded-t-sm p-3">
							Ingressos
						</CardHeader>
						{tickets.length ? (
							<>
								<CardContent className="p-4 min-w-64">
									{values.tickets.map((ticket, index) => (
										<div key={ticket.id} className="flex items-center">
											<div className="w-full">
												<p className="font-semibold text-lg">
													{ticket.description}
												</p>
												<p className="mb-2 text-sm text-primary">
													R$ {ticket.price}
												</p>
											</div>
											<div>
												<div className="flex">
													<Button
														variant={"ghost"}
														className="p-0"
														type="button"
														onClick={() => {
															const newQuantity = Math.max(
																ticket.quantity - 1,
																0
															);
															setFieldValue(
																`tickets[${index}].quantity`,
																newQuantity
															);
															const updatedTickets = [...values.tickets];
															updatedTickets[index].quantity = newQuantity;
															calculateTotal(updatedTickets);
														}}
													>
														<MinusIcon />
													</Button>
													<Field
														disabled={true}
														type="number"
														name={`tickets[${index}].quantity`}
														className="max-w-8 text-center"
													/>
													<Button
														variant={"ghost"}
														className="p-0"
														type="button"
														onClick={() => {
															const newQuantity = ticket.quantity + 1;
															setFieldValue(
																`tickets[${index}].quantity`,
																newQuantity
															);
															const updatedTickets = [...values.tickets];
															updatedTickets[index].quantity = newQuantity;
															calculateTotal(updatedTickets);
														}}
													>
														<PlusIcon />
													</Button>
												</div>
											</div>
										</div>
									))}
								</CardContent>
								<CardFooter className="flex flex-col relative">
									<div className="w-full">
										<h3 className="text-md mt-4">Total</h3>
										<h3 className="text-lg text-primary">
											R$ {total.toFixed(2)}
										</h3>
									</div>
									<SignedIn>
										<Dialog>
											<DialogTrigger asChild>
												<Button
													onClick={() => getTicketsSelected(values.tickets)}
													className="absolute -bottom-5 mx-auto text-lg"
												>
													{isLoading ? "Carregando..." : "Comprar ingresso"}
													<PlusIcon className="ml-2" />
												</Button>
											</DialogTrigger>
											<DialogContent className="">
												<DialogHeader>
													<DialogTitle className="text-xl text-center">
														Confirme sua compra abaixo
													</DialogTitle>
												</DialogHeader>
												<div className="text-md">
													<img
														src={event.assets[0]?.url}
														alt="imagem do evento"
														className="rounded-sm aspect-video"
													/>
													<h2 className="text-2xl font-bold w-full text-center my-2">
														{event.title}
													</h2>

													<div className="mt-5">
														<div>
															<h2 className="font-bold mb-1">
																Dados do ingresso:
															</h2>
															<h3>
																Data de início: {formatDate(event.startDate)}
															</h3>
															{selectedTickets?.map((ticket, index) => {
																return (
																	<>
																		<h3 key={index}>
																			{ticket.description} - {ticket.quantity}x
																		</h3>
																	</>
																);
															})}

															<h3>Valor total: R$ {total}</h3>
														</div>

														<h2 className="font-bold mt-3 mb-1">
															Dados do Comprador:
														</h2>
														<h3>Email: {user?.email}</h3>
														<h3>
															Nome: {user?.firstName + " " + user?.lastName}
														</h3>
													</div>
												</div>
												<DialogFooter>
													<DialogClose className="text-md">
														<Button variant={"outline"}>Cancel</Button>
													</DialogClose>
													<DialogClose
														className="text-md"
														onClick={() => onSubmit(values)}
													>
														<Button>Comprar ingresso</Button>
													</DialogClose>
												</DialogFooter>
											</DialogContent>
										</Dialog>
									</SignedIn>
									<SignedOut>
										<Button
											asChild
											type="button"
											className="absolute -bottom-5 mx-auto text-lg"
										>
											<SignInButton mode="modal">Comprar ingresso</SignInButton>
										</Button>
									</SignedOut>
								</CardFooter>
							</>
						) : (
							<CardContent className="p-4 w-64 mx-auto text-center">
								<h3 className="w-full font-bold text-muted-foreground text-xl">
									{" "}
									Oops... Parece que ainda não há ingressos disponíveis para
									venda
								</h3>
							</CardContent>
						)}
					</Card>
				</Form>
			)}
		</Formik>
	);
};

export default EventPurchaseCard;
