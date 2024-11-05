import PurchaseOrderCards from "@/components/ticketsCards/PurchaseOrderCards";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastType, useToastContext } from "@/core/contexts/toasts.context";
import { IPurchaseOrder } from "@/core/interfaces/PurchaseOrder";
import EventsService from "@/core/services/event.service";
import { useEffect, useState } from "react";

const MyTickets = () => {
	const [myEvents, setMyEvents] = useState<any[]>([]);
	const [activeTab, setActiveTab] = useState("available");
	const eventsService = new EventsService();
	const [isLoading, setIsLoading] = useState(true);
	const toast = useToastContext();

	useEffect(() => {
		eventsService
			.getUserEvents()
			.then((event: any) => {
				setMyEvents(event);
			})
			.catch((err: any) => {
				console.error(err);
				toast.showToast(
					"Oops... parece que não conseguimos recuperar os seus ingressos, por favor contate o suporte técnico!",
					ToastType.Error
				);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	const toggleTab = (tab: string) => {
		setActiveTab(tab);
	};

	const ongoingEvents = myEvents?.filter(
		(event) => new Date(event.startDate) > new Date()
	);
	const pastEvents = myEvents?.filter(
		(event) => new Date(event.startDate) <= new Date()
	);

	const LoadingComponent = () => {
		return (
			<div className="flex-wrap grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 mt-10 px-10">
				<Skeleton className="w-full h-60 bg-gray-300" />
				<Skeleton className="w-full h-60 bg-gray-300" />
				<Skeleton className="w-full h-60 bg-gray-300" />
				<Skeleton className="w-full h-60 bg-gray-300" />
			</div>
		);
	};

	return (
		<div className="max-w-7xl mx-auto text-center min-h-screen">
			<h1 className="text-4xl font-normal py-10">Meus Ingressos</h1>

			<div className="flex justify-center mb-6">
				<button
					className={`mr-4 pb-2 border-b-2 ${
						activeTab === "available"
							? "border-blue-600 font-bold"
							: "border-transparent"
					}`}
					onClick={() => toggleTab("available")}
				>
					Disponíveis
				</button>
				<button
					className={`pb-2 border-b-2 ${
						activeTab === "completed"
							? "border-blue-600 font-bold"
							: "border-transparent"
					}`}
					onClick={() => toggleTab("completed")}
				>
					Encerrados
				</button>
			</div>

			{isLoading ? (
				<LoadingComponent />
			) : (
				<div className="transition-all duration-700 ease-in-out">
					{activeTab === "available" && (
						<div className="transition-opacity duration-700 ease-in-out">
							{ongoingEvents?.length ? (
								<Carousel
									className="mx-auto w-11/12 sm:w-10/12 xl:11/12 2xl:w-full max-w-7xl"
									opts={{
										loop: false,
									}}
								>
									<CarouselContent className="p-4 flex">
										{ongoingEvents.map((event) =>
											event.purchaseOrders.map(
												(purchaseOrder: IPurchaseOrder) => (
													<CarouselItem
														className="basis-auto"
														key={purchaseOrder.id}
													>
														<PurchaseOrderCards
															key={purchaseOrder.id}
															id={purchaseOrder.id}
															address={event.Address}
															img={event.assets[0]?.url}
															startDate={event.startDate}
															title={event.title}
															status={event.status}
															purchaseOrder={purchaseOrder}
														/>
													</CarouselItem>
												)
											)
										)}
									</CarouselContent>
									<CarouselNext className="hidden sm:flex" />
									<CarouselPrevious className="hidden sm:flex" />
								</Carousel>
							) : (
								<p className="text-2xl font-semibold text-muted-foreground">
									Oops... Parece que você não tem nenhum evento disponível.
								</p>
							)}
						</div>
					)}
					{activeTab === "completed" && (
						<div className="transition-opacity duration-700 ease-in-out">
							{pastEvents?.length ? (
								<Carousel
									className="mx-auto w-11/12 sm:w-10/12 xl:11/12 2xl:w-full max-w-7xl"
									opts={{
										loop: false,
									}}
								>
									<CarouselContent className="p-4 flex">
										{pastEvents.map((event) =>
											event.purchaseOrders.map(
												(purchaseOrder: IPurchaseOrder) => (
													<CarouselItem
														className="basis-auto"
														key={purchaseOrder.id}
													>
														<PurchaseOrderCards
															key={purchaseOrder.id}
															id={purchaseOrder.id}
															address={event.Address}
															img={event.assets[0]?.url}
															startDate={event.startDate}
															title={event.title}
															status={event.status}
															purchaseOrder={purchaseOrder}
														/>
													</CarouselItem>
												)
											)
										)}
									</CarouselContent>
									<CarouselNext className="hidden sm:flex" />
									<CarouselPrevious className="hidden sm:flex" />
								</Carousel>
							) : (
								<p className="text-2xl font-semibold text-muted-foreground">
									Oops... Parece que você não tem nenhum evento Encerrado.
								</p>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default MyTickets;
