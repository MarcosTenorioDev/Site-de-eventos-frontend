import banner1 from "@/assets/mockImages/banner1.jpeg";
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
import { Trash2Icon } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import EventsService from "@/core/services/event.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Params, useParams } from "react-router-dom";

const Event = () => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);
	const [attractions, setAttractions] = useState<
		{ id: string; description: string; imageUrl: string; name: string }[]
	>([]);
	const [tickets, setTickets] = useState<
		{ id: string; description: string; price: string; quantity: number }[]
	>([]);
	const [total, setTotal] = useState<number>(0);
	const [hasPromo, setHasPromo] = useState<boolean>(false);
	const initialValues = {
		tickets,
		promoCode: "",
	};
	const eventService = new EventsService();
	const [event, setEvent] = useState<any>();
	const [endDate, setEndDate] = useState<Date | undefined>();
	const { id }: Readonly<Params<string>> = useParams();

	useEffect(() => {
		if (!api) {
			return;
		}
		setCurrent(api.selectedScrollSnap() + 1);
		api.on("select", () => {
			setCurrent(api.selectedScrollSnap() + 1);
		});
	}, [api]);

	useEffect(() => {
		//criar tratamento de erro posteriormente (404?)
		if(id){
			eventService.getEventById(id).then((event) => {
				console.log(event.assets[0].url);
				setEvent(event);
				setAttractions(event.attractions);
				setCount(event.attractions.length);
				setEndDate(new Date(event.endDate));
				setTickets(event.ticketTypes);
				return event;
			});
		}
		
	}, []);

	const calculateTotal = (
		tickets: {
			id: string;
			description: string;
			price: string;
			quantity: number;
		}[]
	) => {
		const total = tickets.reduce((acc, ticket) => {
			return acc + ticket.quantity * parseInt(ticket.price);
		}, 0);
		setTotal(total);
	};

	const onSubmit = async (values: any) => {
		console.log(values);
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
		<div className="px-10 lg:px-0">
			{event ? (
				<>
					<div className="flex flex-col items-center justify-center mt-4 sm:mt-8 w-full my-56">
						<div className="flex flex-col justify-start items-center w-full">
							<img
								src={event.assets[0].url}
								alt="banner do evento"
								className="object-cover w-full h-full rounded-xl max-w-[1140px] max-h-[500px] aspect-video"
							/>
							<div className="flex w-full max-w-[1140px] justify-start mt-5">
								<Card className="p-5 rounded-3xl shadow-md shadow-gray-500 hover:shadow-lg hover:shadow-gray-500 w-min text-center font-primary">
									<div>
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
								</Card>
								<div className="flex justify-center items-start flex-col px-8 font-primary text-xl">
									<p className="mb-1">{event.location}</p>
									<p>{event.format}</p>
								</div>
							</div>
							<div className="flex flex-col gap-12 md:gap-4 md:flex-row w-full max-w-[1140px] justify-between mt-8 font-primary">
								<Card className="w-full md:w-6/12">
									<CardHeader>{event.description}</CardHeader>
									<CardContent className="">
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
															index + 1 === current ? "bg-black" : "bg-gray-300"
														}`}
													></div>
												))}
											</div>
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
												<CardContent className="p-4 min-w-64">
													{values.tickets.map((ticket, index) => (
														<div key={ticket.id} className="flex items-center">
															<div className="w-full">
																<p className="font-semibold text-lg">
																	{ticket.description}
																</p>
																<p className="mb-2 text-sm text-primary">
																	{ticket.price}
																</p>
															</div>
															<div>
																<div className="flex">
																	<Button
																		variant={"ghost"}
																		className="p-0"
																		type="button"
																		onClick={() => {
																			setFieldValue(
																				`tickets[${index}].quantity`,
																				Math.max(ticket.quantity - 1, 0)
																			);
																			const updatedTickets = [
																				...values.tickets,
																			];
																			updatedTickets[index].quantity = Math.max(
																				ticket.quantity - 1,
																				0
																			);
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
																		onChange={(e: any) => {
																			const value = e.target.value;
																			const updatedTickets = [
																				...values.tickets,
																			];
																			updatedTickets[index].quantity = value;
																			calculateTotal(updatedTickets);
																		}}
																	/>
																	<Button
																		variant={"ghost"}
																		className="p-0"
																		type="button"
																		onClick={() => {
																			setFieldValue(
																				`tickets[${index}].quantity`,
																				ticket.quantity + 1
																			);
																			const updatedTickets = [
																				...values.tickets,
																			];
																			updatedTickets[index].quantity =
																				Math.max(
																				ticket.quantity - 1,
																				0
																			);
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
														<h3 className="text-lg text-primary">R$ {total}</h3>
													</div>
													<Button
														type="submit"
														className="absolute -bottom-5 mx-auto text-lg"
													>
														Inscrever-se
													</Button>
												</CardFooter>
											</Card>
										</Form>
									)}
								</Formik>
							</div>
							<div className="flex flex-col sm:flex-row justify-center items-center w-full max-w-[1140px] sm:justify-start text-center mt-12 sm:mt-8 font-primary gap-8">
								<div>
									<h2 className="text-4xl font-semibold mb-5">Produtor</h2>
									<img
										src={banner1}
										alt=""
										className="w-full aspect-video sm:w-48"
									/>
								</div>
								<div className=" flex flex-col justify-end gap-5">
									<h3 className="text-3xl font-semibold">{event.producer}</h3>
									<Button className="py-7">Entre em contato</Button>
								</div>
							</div>
						</div>
					</div>
				</>
			) : (
				loadingComponent()
			)}
		</div>
	);
};

export default Event;
