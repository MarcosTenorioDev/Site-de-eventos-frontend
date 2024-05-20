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

const Event = () => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);
	const [attractions, setAttractions] = useState<string[]>([]);
	const [tickets, setTickets] = useState<
		{ id: string; description: string; price: string; quantity: number }[]
	>([]);
	const [total, setTotal] = useState<number>(0);
	const [hasPromo, setHasPromo] = useState<boolean>(false);
	const initialValues = {
		tickets,
		promoCode: "",
	};

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
		const getAttractions = () => {
			setAttractions([banner1, banner1, banner1, banner1]);
			setCount(attractions.length);
		};

		const getTickets = () => {
			setTickets([
				{
					id: "0000-0000-0000",
					description: "Inteira",
					price: "2000",
					quantity: 0,
				},
				{
					id: "1111-1111-1111",
					description: "Meia",
					price: "1000",
					quantity: 0,
				},
			]);
		};

		getAttractions();
		getTickets();
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
		event?.preventDefault();
		console.log(values);
	};

	return (
		<div className="px-10 lg:px-0">
			<div className="flex flex-col items-center justify-center mt-4 sm:mt-8 w-full my-56">
				<div className="flex flex-col justify-start items-center w-full">
					<img
						src={banner1}
						alt="imagem do banner"
						className="object-cover w-full h-full rounded-xl max-w-[1140px] max-h-[500px] aspect-video"
					/>
					<div className="flex w-full max-w-[1140px] justify-start mt-5">
						<Card className="p-5 rounded-3xl shadow-md shadow-gray-500 hover:shadow-lg hover:shadow-gray-500 w-min text-center font-primary">
							<p className="text-3xl text-primary font-semibold">20</p>
							<p className="text-3xl text-primary font-semibold opacity-50">
								abr
							</p>
							<p className="text-xl text-primary font-semibold opacity-50">
								sex
							</p>
							<p className="text-3xl text-primary font-semibold opacity-50">
								21h
							</p>
						</Card>
						<div className="flex justify-center items-start flex-col px-8 font-primary text-xl">
							<p className="mb-1">Rua da batalha, 85, Jordão Alto - Recife</p>
							<p>Presencial</p>
						</div>
					</div>
					<div className="flex flex-col gap-12 md:gap-4 md:flex-row w-full max-w-[1140px] justify-between mt-8 font-primary">
						<Card className="w-full md:w-6/12">
							<CardHeader>
								Lorem ipsum dolor sit amet consectetur adipisicing elit. At
								delectus sed odit officia eum reprehenderit ut, dolores autem
								tenetur in, dolore cum a! Aut, provident consectetur? Natus,
								beatae? Minus, eaque?
							</CardHeader>
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
													img={attraction}
													title="Kenzy"
													description="The React Framework created and maintained by @vercel."
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
																	const updatedTickets = [...values.tickets];
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
																disabled={false}
																type="number"
																name={`tickets[${index}].quantity`}
																className="max-w-8 text-center"
																onChange={(e: any) => {
																	const value = e.target.value;
																	const updatedTickets = [...values.tickets];
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
																	const updatedTickets = [...values.tickets];
																	updatedTickets[index].quantity =
																		ticket.quantity + 1;
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
														<Trash2Icon className="text-destructive cursor-pointer" onClick={() => {setHasPromo(false); values.promoCode = ''}}/>
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
															<AlertDialogAction className="text-lg" onClick={() => setHasPromo(true)}>
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
					<div className="flex w-full max-w-[1140px] justify-start mt-8 font-primary gap-8">
						<div>
							<h2 className="text-4xl font-semibold mb-5">Produtor</h2>
							<img src={banner1} alt="" className="w-48" />
						</div>
						<div className=" flex flex-col justify-end gap-5">
							<h3 className="text-3xl font-semibold">YE interprise</h3>
							<Button className="py-7">Entre em contato</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Event;
