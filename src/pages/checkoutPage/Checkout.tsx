import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, AlertTriangle } from "lucide-react";
import { PersonIcon } from "@radix-ui/react-icons";
import { formatDate } from "@/core/services/helper.service";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import placeholder from "@/assets/images/home/placeholderEventCard.png";
import { IPurchaseOrderReservedById } from "@/core/interfaces/PurchaseOrder";
import { Link, useNavigate, useParams } from "react-router-dom";
import PurchaseOrderService from "@/core/services/purchaseOrder.service";
import { Skeleton } from "@/components/ui/skeleton";

export default function Checkout() {
	const [timeLeft, setTimeLeft] = useState(0);
	const [purchaseOrder, setPurchaseOrder] =
		useState<IPurchaseOrderReservedById>();
	const [isLoading, setIsLoading] = useState(true);
	const params = useParams();
	const purchaseOrderService = new PurchaseOrderService();
	const navigate = useNavigate();

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	useEffect(() => {
		if (params.id) {
			purchaseOrderService
				.GetPurchaseOrderReservedById(params.id)
				.then((purchaseOrder) => {
					setPurchaseOrder(purchaseOrder);

					// Calcula o tempo restante em segundos
					const expiresAt = new Date(
						purchaseOrder.reservationExpiresAt
					).getTime();
					const currentTime = new Date().getTime();
					const timeDifference = Math.floor((expiresAt - currentTime) / 1000);

					setTimeLeft(timeDifference > 0 ? timeDifference : 0);
				})
				.catch(() => {
					navigate(`/`);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [params.id]);

	const LoadingComponent = () => (
		<div className="min-h-screen bg-gray-100 flex flex-col">
			<div className="flex flex-col justify-center items-center gap-10">
				<Skeleton className="w-full h-full max-h-[150px] md:max-h-[300px] aspect-video bg-slate-300 rounded-none" />
				<div className="px-5 w-full flex flex-col gap-10">
					<Skeleton className="w-full max-w-[1140px] h-full max-h-[100px] md:max-h-[150px] aspect-video bg-slate-300" />
					<Skeleton className="w-full max-w-[1140px] h-full md:max-h-[400px] aspect-video bg-slate-300" />
				</div>
			</div>
		</div>
	);

	if(isLoading) return LoadingComponent();

	return (
		<>
			{purchaseOrder ? (
				<div className="min-h-screen bg-gray-100 flex flex-col">
					<div
						className="relative h-64 bg-cover bg-center"
						style={{
							backgroundImage: `url(${
								purchaseOrder.event.assets[0]?.url
									? purchaseOrder.event.assets[0]?.url
									: placeholder
							})`,
						}}
					>
						<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
							<div className="text-center text-white">
								<h1 className="text-4xl font-bold mb-2">
									{purchaseOrder.event.title}
								</h1>
								<p className="text-xl">{purchaseOrder.event.category.name}</p>
							</div>
						</div>
					</div>

					<div className="flex-grow p-4 flex flex-col items-center justify-start">
						<div className="w-full max-w-4xl space-y-6">
							<h2 className="text-3xl font-bold text-center mb-6">
								Finalize o seu pedido
							</h2>

							<Card className="w-full">
								<CardContent className="p-6 flex flex-col md:flex-row gap-6">
									<div className="md:w-1/3">
										<img
											src={
												purchaseOrder.event.assets[0]?.url
													? purchaseOrder.event.assets[0]?.url
													: placeholder
											}
											alt="Event"
											className="w-full h-48 object-cover rounded-lg"
										/>
									</div>
									<div className="md:w-2/3 space-y-4">
										<h3 className="text-2xl font-semibold">
											Detalhes do evento
										</h3>
										<div className="flex items-center gap-2 text-gray-600">
											<Calendar className="w-5 h-5" />
											<span>{formatDate(purchaseOrder.event.startDate)}</span>
										</div>
										<div className="flex items-center gap-2 text-gray-600">
											<Clock className="w-5 h-5" />
											<span>
												Abertura do evento as{" "}
												{new Date(purchaseOrder.event.startDate).getHours()}:
												{new Date(purchaseOrder.event.startDate).getMinutes()}{" "}
											</span>
										</div>
										<div className="flex items-center gap-2 text-gray-600">
											<MapPin className="w-5 h-5" />
											<span>
												{" "}
												{purchaseOrder.event.Address?.street}{" "}
												{purchaseOrder.event.Address?.number} -{" "}
												{purchaseOrder.event.Address?.neighborhood} -{" "}
												{purchaseOrder.event.Address?.city}
											</span>
										</div>
										<div className="flex items-center gap-2 text-gray-600">
											<PersonIcon className="w-5 h-5" />
											<span>+{purchaseOrder.event.ageRating}</span>
										</div>
									</div>
								</CardContent>
							</Card>

							{timeLeft === 0 ? (
								<Card className="w-full shadow-lg rounded-lg bg-white border border-gray-200">
									<CardHeader className="bg-red-100 rounded-t-lg">
										<CardTitle className="text-xl font-semibold text-red-800">
											Atenção: O tempo para finalizar seu pedido acabou!
										</CardTitle>
									</CardHeader>
									<CardContent className="p-6">
										<div className="bg-red-50 border flex-col lg:flex-row border-red-200 rounded-lg p-4 flex items-center justify-between text-center lg:text-start">
											<div className="flex flex-col lg:flex-row items-center">
												<AlertTriangle className="w-8 h-8 text-red-600 mr-4" />
												<p className="text-lg font-medium text-red-700">
													Mas não se preocupe, você pode retornar a página do
													evento e iniciar a compra novamente!
												</p>
											</div>
											<p className="text-4xl font-bold text-red-800">
												{formatTime(timeLeft)}
											</p>
										</div>
									</CardContent>
									<div className="p-6">
										<Link to={`/event/${purchaseOrder.eventId}`}>
											<Button
												variant={"destructive"}
												onClick={() => {}}
												className="w-full text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
											>
												Retornar à tela de evento
											</Button>
										</Link>
									</div>
								</Card>
							) : (
								<>
									<Card className="w-full shadow-lg rounded-lg bg-white border border-gray-200">
										<CardHeader className="bg-yellow-100 rounded-t-lg">
											<CardTitle className="text-xl font-semibold text-yellow-800">
												Não se preocupe, seus ingressos estão reservados, mas
												por tempo limitado!
											</CardTitle>
										</CardHeader>
										<CardContent className="p-6">
											<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
												<div className="flex items-center">
													<AlertTriangle className="w-8 h-8 text-yellow-600 mr-4" />
													<p className="text-lg font-medium text-yellow-700">
														Tempo restante para finalizar o seu pedido:
													</p>
												</div>
												<p className="text-4xl font-bold text-yellow-800">
													{formatTime(timeLeft)}
												</p>
											</div>
										</CardContent>
									</Card>

									<Card className="w-full">
										<CardHeader>
											<CardTitle className="text-primary-dark font-semibold text-xl">
												Dados do participante
											</CardTitle>
										</CardHeader>
										<CardContent className="p-6">
											<div className="space-y-4">
												{purchaseOrder.reservedTicketTypes.map((ticket) =>
													Array.from({ length: ticket.quantity }).map(
														(_, index) => (
															<div
																key={`${ticket.ticketTypeId}-${index}`}
																className="space-y-2 bg-muted border-gray-300 border rounded-lg p-6"
															>
																<div className="flex items-center justify-between">
																	<h3 className="text-md font-semibold">
																		Participante Nº {index + 1} -{" "}
																		{ticket.ticketType.description}
																	</h3>
																	<Badge
																		className={`${
																			ticket.ticketType.price === 0
																				? "bg-muted-foreground hover:bg-gray-600"
																				: "bg-green-500 hover:bg-green-300"
																		} text-nowrap`}
																	>
																		{ticket.ticketType.price === 0
																			? "Gratuito"
																			: `R$ ${ticket.ticketType.price.toFixed(
																					2
																			  )}`}{" "}
																	</Badge>
																</div>
																<Input
																	type="text"
																	placeholder="Nome do participante"
																	className="w-full px-4 py-2 border rounded-md"
																/>
																<Input
																	type="email"
																	placeholder="Email do participante"
																	className="w-full px-4 py-2 border rounded-md "
																/>
															</div>
														)
													)
												)}
											</div>
										</CardContent>
										<CardFooter className="flex justify-between items-center">
											<p className="text-lg font-medium">
												{purchaseOrder.reservedTicketTypes.reduce(
													(acc, ticket) => acc + ticket.quantity,
													0
												)}{" "}
												tickets selecionados
											</p>
											<Button
												size="lg"
												className="bg-green-500 hover:bg-green-600 text-white"
											>
												Complete Order
											</Button>
										</CardFooter>
									</Card>
								</>
							)}
						</div>
					</div>
				</div>
			) : (
				navigate("/")
			)}
		</>
	);
}
