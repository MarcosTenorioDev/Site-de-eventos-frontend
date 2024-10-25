import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import Attraction from "@/components/attractions/attraction";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
	CarouselApi,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { Field, Formik, Form } from "formik";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import ageRatingIcon from "@/assets/icons/ageRatingIcon.svg";
import {
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/formInputs/Inputs";
import { MapPinIcon, Trash2Icon } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import EventsService from "@/core/services/event.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Params, useNavigate, useParams } from "react-router-dom";
import { useToastContext } from "@/core/contexts/toasts.context";
import { ToastType } from "@/core/contexts/toasts.context";
import PurchaseOrderService from "@/core/services/purchaseOrder.service";
import { SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import UserService from "@/core/services/user.service";
import { User } from "@/core/interfaces/User";
import { TicketPurchaseOrder } from "@/core/interfaces/Ticket.interface";
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
import { IAddress } from "@/core/interfaces/Address";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { IEventById } from "@/core/interfaces/Event.interface";
import placeholder from "@/assets/images/home/placeholderEventCard.png";

const Event = () => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);
	const [attractions, setAttractions] = useState<
		{ id: string; description: string; imageUrl: string; name: string }[]
	>([]);
	const [tickets, setTickets] = useState<TicketPurchaseOrder[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [hasPromo, setHasPromo] = useState<boolean>(false);
	const initialValues = {
		tickets,
		promoCode: "",
	};
	const eventService = new EventsService();
	const [event, setEvent] = useState<IEventById>();
	const [endDate, setEndDate] = useState<Date | undefined>();
	const { id }: Readonly<Params<string>> = useParams();
	const navigate = useNavigate();
	const toast = useToastContext();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [user, setUser] = useState<User>();
	const purchaseOrderService = new PurchaseOrderService();
	const userService = new UserService();
	const toastService = useToastContext();
	const [selectedTickets, setSelectedTickets] =
		useState<{ description: string; quantity: number }[]>();
	useEffect(() => {
		if (!api) {
			return;
		}
		setCurrent(api.selectedScrollSnap() + 1);
		api.on("select", () => {
			setCurrent(api.selectedScrollSnap() + 1);
		});
	}, [api]);
	const [address, setAddress] = useState<IAddress>();

	useEffect(() => {
		//criar tratamento de erro posteriormente (404?)
		if (id) {
			eventService
				.getEventById(id)
				.then((event) => {
					setEvent(event);
					setAttractions(event.attractions);
					setCount(event.attractions.length);
					setEndDate(new Date(event.startDate));
					const tickets = event.ticketTypes.map(
						(ticket: {
							id: string;
							description: string;
							price: string;
							quantity: number;
						}) => ({
							id: ticket.id,
							description: ticket.description,
							price: ticket.price,
							quantity: 0,
						})
					);
					setAddress(event.Address);
					setTickets(tickets);
					return event;
				})
				.catch(() => {
					navigate("/");
					toast.showToast(
						"Não foi possível encontrar o evento solicitado",
						ToastType.Error
					);
				});
		}
		userService.getUser().then((user) => {
			if (user) {
				setUser(user);
			}
		});
	}, []);
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

	const loadingComponent = () => {
		return (
			<>
				<div className="flex flex-col justify-center items-center mt-10">
					<Skeleton className="w-full max-w-[1140px] h-full max-h-[500px] aspect-video bg-slate-500 " />
					<div className="flex w-full max-w-[1140px] items-center gap-5 mt-10">
						<Skeleton className="w-32 rounded-3xl h-48 max-h-[500px] aspect-video bg-slate-500 " />
						<div className="w-full flex flex-col gap-5 justify-center items-start">
							<Skeleton className="w-11/12 md:w-7/12 rounded-3xl h-12 max-h-[500px] aspect-video bg-slate-500 " />
							<Skeleton className="w-11/12 md:w-7/12 rounded-3xl h-12 max-h-[500px] aspect-video bg-slate-500 " />
						</div>
					</div>
					<div className="flex flex-col md:flex-row w-full max-w-[1140px] mt-10 justify-between gap-10">
						<Skeleton className="w-full md:w-6/12 max-w-[1140px] h-full max-h-[500px] aspect-video bg-slate-500  rounded-2xl" />
						<Skeleton className="w-full md:w-4/12 max-w-[1140px] h-full max-h-[500px] aspect-video bg-slate-500  rounded-2xl" />
					</div>
				</div>
			</>
		);
	};

	return (
		<div className="px-4 lg:px-0">
			{event ? (
				<div>
					<div
						className="absolute max-w-[100vw] bg-center -inset-5 bg-cover bg-no-repeat blur-[10px] -z-10 mt-[70px] bg-[100% 100%] max-h-[700px]"
						style={{
							backgroundImage: `url(${encodeURI(event.assets[0]?.url)})`,
						}}
					/>
					<div className="flex flex-col items-center justify-center w-full">
						<div className="flex flex-col justify-start items-center w-full">
							<img
								src={event.assets[0]?.url ? event.assets[0]?.url : placeholder}
								alt="banner do evento"
								className={`object-cover w-full h-full rounded-xl max-w-[1140px] max-h-[500px] aspect-video mt-4 sm:mt-8 lg:mt-20 shadow-md hover:shadow-lg ${
									event.assets[0]?.url ? "" : "border"
								}`}
							/>
							<div className="flex flex-col sm:flex-row sm:justify-start text-center sm:text-start px-0 w-full max-w-[1140px] justify-center items-center mt-5 rounded-lg shadow-sm shadow-gray-400 bg-white sm:px-10 py-5">
								<div className="flex justify-start items-center gap-3 sm:flex-col sm:gap-0 sm:items-center sm:justify-start">
									<p className="text-3xl text-primary font-semibold">
										{endDate?.getDate()}
									</p>
									<p className="text-3xl text-primary font-semibold opacity-50">
										{endDate?.toLocaleString("default", { month: "short" })}
									</p>
									<p className="text-xl text-primary font-semibold opacity-50">
										{endDate?.toLocaleString("default", { weekday: "short" })}
									</p>
									<p className="text-3xl text-primary font-semibold opacity-50">
										{endDate?.getHours()}h
									</p>
								</div>

								<div className="flex justify-center items-start flex-col px-8 font-primary text-xl text-center sm:text-start">
									<div>
										<p className="mb-1 w-full text-3xl font-semibold text-gray-600">
											{event.title} - {event.format}
										</p>
										<p className="flex sm:gap-2 items-start">
											<MapPinIcon className="h-8 w-8 min-h-6 min-w-6" />{" "}
											{address?.street} {address?.number} -{" "}
											{address?.neighborhood} - {address?.city}
										</p>
									</div>
								</div>
							</div>
							<div className="flex flex-col gap-12 md:gap-4 md:flex-row w-full max-w-[1140px] justify-between mt-8 font-primary">
								<Card className="w-full md:w-8/12 h-min">
									<ReactMarkdown className="p-5" remarkPlugins={[remarkGfm]}>
										{event.description}
									</ReactMarkdown>
									<CardContent className="">
										{attractions.length ? (
											<>
												<h3 className="mb-6 text-xl">Atrações</h3>

												<Carousel
													setApi={setApi}
													className="w-10/12 mx-auto"
													plugins={[
														Autoplay({
															delay: 3000,
														}),
													]}
												>
													<CarouselContent>
														{attractions.map((attraction, index) => (
															<CarouselItem
																key={index}
																className="flex items-center justify-center"
															>
																<Attraction
																	img={attraction.imageUrl}
																	title={attraction.name}
																	description={attraction.description}
																/>
															</CarouselItem>
														))}
													</CarouselContent>
													<CarouselPrevious className="hidden md:flex" />
													<CarouselNext className="hidden md:flex" />
												</Carousel>
												<div className="py-2 text-center text-sm text-muted-foreground flex items-center justify-center">
													<div className="flex gap-[4px]">
														{Array.from({ length: count }).map((_, index) => (
															<div
																key={index}
																className={`w-2 h-2 rounded-full ${
																	index + 1 === current
																		? "bg-black"
																		: "bg-gray-300"
																}`}
															></div>
														))}
													</div>
												</div>
											</>
										) : (
											""
										)}
										<div>
											<h3 className="font-bold text-xl">
												Classificação etária
											</h3>
											<p className="flex items-center gap-3 font-semibold text-lg mt-2">
												<i>
													<img src={ageRatingIcon} alt="" className="w-7" />
												</i>
												{event.ageRating} Anos
											</p>
										</div>
									</CardContent>
								</Card>

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
																<div
																	key={ticket.id}
																	className="flex items-center"
																>
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
																					const updatedTickets = [
																						...values.tickets,
																					];
																					updatedTickets[index].quantity =
																						newQuantity;
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
																					const newQuantity =
																						ticket.quantity + 1;
																					setFieldValue(
																						`tickets[${index}].quantity`,
																						newQuantity
																					);
																					const updatedTickets = [
																						...values.tickets,
																					];
																					updatedTickets[index].quantity =
																						newQuantity;
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
															{hasPromo ? (
																<>
																	<p className="text-primary flex items-center justify-center gap-4 border-2 p-2 w-full text-center rounded-full text-lg">
																		{values.promoCode} - 10%{" "}
																		<Trash2Icon
																			className="text-destructive cursor-pointer"
																			onClick={() => {
																				setHasPromo(false);
																				values.promoCode = "";
																			}}
																		/>
																	</p>
																</>
															) : (
																<AlertDialog>
																	<AlertDialogTrigger asChild>
																		<Button
																			variant="outline"
																			className="text-primary border-[1px] py-3 border-black border-opacity-15 hover:text-primary-dark text-sm sm:text-lg md:text-sm lg:text-lg"
																		>
																			Adicionar código promocional{" "}
																			<PlusIcon className="ml-2" />
																		</Button>
																	</AlertDialogTrigger>
																	<AlertDialogContent>
																		<AlertDialogHeader>
																			<AlertDialogTitle className="text-lg">
																				Adicionar Código promocional
																			</AlertDialogTitle>
																		</AlertDialogHeader>
																		<AlertDialogDescription className="text-lg">
																			<Input
																				control="promoCode"
																				placeholder="Insira seu código promocional"
																			/>
																		</AlertDialogDescription>
																		<AlertDialogFooter>
																			<AlertDialogCancel className="text-lg">
																				Cancel
																			</AlertDialogCancel>
																			<AlertDialogAction
																				className="text-lg"
																				onClick={() => setHasPromo(true)}
																			>
																				Continue
																			</AlertDialogAction>
																		</AlertDialogFooter>
																	</AlertDialogContent>
																</AlertDialog>
															)}

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
																			onClick={() =>
																				getTicketsSelected(values.tickets)
																			}
																			className="absolute -bottom-5 mx-auto text-lg"
																		>
																			{isLoading
																				? "Carregando..."
																				: "Comprar ingresso"}
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
																						Data de início:{" "}
																						{formatDate(event.startDate)}
																					</h3>
																					{selectedTickets?.map(
																						(ticket, index) => {
																							return (
																								<>
																									<h3 key={index}>
																										{ticket.description} -{" "}
																										{ticket.quantity}x
																									</h3>
																								</>
																							);
																						}
																					)}

																					<h3>Valor total: R$ {total}</h3>
																				</div>

																				<h2 className="font-bold mt-3 mb-1">
																					Dados do Comprador:
																				</h2>
																				<h3>Email: {user?.email}</h3>
																				<h3>
																					Nome:{" "}
																					{user?.firstName +
																						" " +
																						user?.lastName}
																				</h3>
																			</div>
																		</div>
																		<DialogFooter>
																			<DialogClose className="text-md">
																				<Button variant={"outline"}>
																					Cancel
																				</Button>
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
																	<SignInButton mode="modal">
																		Comprar ingresso
																	</SignInButton>
																</Button>
															</SignedOut>
														</CardFooter>
													</>
												) : (
													<CardContent className="p-4 w-64 mx-auto text-center">
														<h3 className="w-full font-bold text-muted-foreground text-xl">
															{" "}
															Oops... Parece que ainda não há ingressos
															disponíveis para venda
														</h3>
													</CardContent>
												)}
											</Card>
										</Form>
									)}
								</Formik>
							</div>
							<div className="flex flex-col sm:flex-row justify-center items-center w-full max-w-[1140px] sm:justify-start text-center mt-12 sm:mt-8 font-primary gap-8 mb-16">
								<div>
									<h2 className="text-4xl font-semibold mb-5 text-center">
										Produtor
									</h2>
									<img
										src={event.producers?.imageUrl}
										alt=""
										className="w-full aspect-video sm:w-48 mx-auto"
									/>
								</div>
								<div className=" flex flex-col justify-end gap-5">
									<h3 className="text-3xl font-semibold">
										{event.producers?.name}
									</h3>
									<Button className="py-7">Entre em contato</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				loadingComponent()
			)}
		</div>
	);
};

export default Event;
