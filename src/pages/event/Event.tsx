import ageRatingIcon from "@/assets/icons/ageRatingIcon.svg";
import Attraction from "@/components/attractions/attraction";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Carousel,
	CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastType, useToastContext } from "@/core/contexts/toasts.context";
import EventsService from "@/core/services/event.service";
import Autoplay from "embla-carousel-autoplay";
import { MapPinIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Params, useNavigate, useParams } from "react-router-dom";

import { TicketPurchaseOrder } from "@/core/interfaces/Ticket.interface";

import placeholder from "@/assets/images/home/placeholderEventCard.png";
import EventPurchaseCard from "@/components/eventPurchaseCard/eventPurchaseCard";
import EditorView from "@/components/MarkdownEditor/EditorView";
import { IAddress } from "@/core/interfaces/Address";
import { IEventById } from "@/core/interfaces/Event.interface";
import PurchaseOrderService from "@/core/services/purchaseOrder.service";

const Event = () => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);
	const [attractions, setAttractions] = useState<
		{ id: string; description: string; imageUrl: string; name: string }[]
	>([]);
	const [countAlreadyPurchased, setCountAlreadyPurchased] = useState<number>(0);
	const [isLoadedTicketsPurchased, setIsLoadedTicketsPurchased] =
		useState<boolean>(false);
	const purchaseOrderService = new PurchaseOrderService();
	const [tickets, setTickets] = useState<TicketPurchaseOrder[]>([]);
	const eventService = new EventsService();
	const [event, setEvent] = useState<IEventById>();
	const [endDate, setEndDate] = useState<Date | undefined>();
	const { id }: Readonly<Params<string>> = useParams();
	const navigate = useNavigate();
	const toast = useToastContext();

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
						(ticket: TicketPurchaseOrder) => ({
							id: ticket.id,
							description: ticket.description,
							price: ticket.price,
							quantityAvailablePerUser: ticket.quantityAvailablePerUser,
						})
					);
					setAddress(event.Address);
					setTickets(tickets);
					purchaseOrderService
						.GetTicketsQuantityPurchasedByEventId(id)
						.then((ticketsPurchased) => {
							setCountAlreadyPurchased(ticketsPurchased.ticketsPurchased);
						})
						.finally(() => {
							setIsLoadedTicketsPurchased(true);
						});
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
	}, []);

	const loadingComponent = () => {
		return (
			<>
				<div className="flex flex-col justify-center items-center mt-10">
					<Skeleton className="w-full max-w-[1140px] h-full max-h-[500px] aspect-video bg-slate-300 " />
					<div className="flex w-full max-w-[1140px] items-center gap-5 mt-10">
						<Skeleton className="w-32 rounded-3xl h-48 max-h-[500px] aspect-video bg-slate-300 " />
						<div className="w-full flex flex-col gap-5 justify-center items-start">
							<Skeleton className="w-11/12 md:w-7/12 rounded-3xl h-12 max-h-[500px] aspect-video bg-slate-300 " />
							<Skeleton className="w-11/12 md:w-7/12 rounded-3xl h-12 max-h-[500px] aspect-video bg-slate-300 " />
						</div>
					</div>
					<div className="flex flex-col md:flex-row w-full max-w-[1140px] mt-10 justify-between gap-10">
						<Skeleton className="w-full md:w-6/12 max-w-[1140px] h-full max-h-[500px] aspect-video bg-slate-300  rounded-2xl" />
						<Skeleton className="w-full md:w-4/12 max-w-[1140px] h-full max-h-[500px] aspect-video bg-slate-300  rounded-2xl" />
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
									<div className="p-5">
										<EditorView content={event.description} />
									</div>
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

								<EventPurchaseCard
									tickets={tickets}
									event={event}
									ticketsPurchased={countAlreadyPurchased}
									isLoadedTicketsPurchased={isLoadedTicketsPurchased}
								/>
							</div>
							<div className="flex flex-col sm:flex-row justify-center items-center w-full max-w-[1140px] sm:justify-start text-center mt-12 sm:mt-8 font-primary gap-8 mb-16">
								<div>
									<h2 className="text-4xl font-semibold mb-5 text-center">
										Produtor
									</h2>
									<img
										src={event.producers?.imageUrl}
										alt="imagem do produtor do evento"
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
