import { useState, useEffect } from "react";
import MyEventsCards from "@/components/eventCards/MyEventsCards";
import EventsService from "@/core/services/event.service";
import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
} from "@/components/tabs/Tabs";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ToastType, useToastContext } from "@/core/contexts/toasts.context";
import { IEventsCreated } from "@/core/interfaces/Event.interface";
import { Skeleton } from "@/components/ui/skeleton";

const MyEvents = () => {
	const [myEvents, setMyEvents] = useState<IEventsCreated[]>([]);
	const eventsService = new EventsService();
	const navigate = useNavigate();
	const toast = useToastContext();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		eventsService
			.getEventByCreatorId()
			.then((events) => {
				setMyEvents(events);
			})
			.catch((err) => {
				console.error(err);
				toast.showToast(
					"Oops... parece que não conseguimos recuperar os seus dados, por favor contate o suporte técnico!",
					ToastType.Error
				);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	const filterEvents = (status: string) => {
		const now = new Date();
		return myEvents.filter((event) => {
			const eventStartDate = new Date(event.startDate);
			switch (status) {
				case "all":
					return true;
				case "cancelled":
					return event.status === "Cancelado";
				case "completed":
					return eventStartDate <= now;
				case "ongoing":
					return eventStartDate > now;
				case "scheduled":
					return eventStartDate > now && event.status === "Ativo";
				default:
					return true;
			}
		});
	};

	const LoadingComponent = () => {
		return (
			<>
			<div className="flex-wrap grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 mt-10 px-10">
				<Skeleton className="w-full h-60 bg-gray-300" />
				<Skeleton className="w-full h-60 bg-gray-300" />
				<Skeleton className="w-full h-60 bg-gray-300" />
			</div>
			<div className="flex-wrap grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 mt-10 px-10">
				<Skeleton className="w-full h-60 bg-gray-300" />
				<Skeleton className="w-full h-60 bg-gray-300" />
				<Skeleton className="w-full h-60 bg-gray-300" />
			</div></>
		);
	};

	return (
		<div className="max-w-[1980px] mx-auto text-center min-h-screen px-8 md:px-20">
			<div className="w-11/12 xl:w-full sm:w-10/12 max-w-[1980px] mx-auto bg-primary-dark h-52 md:h-60 flex-col overflow-hidden flex items-end justify-end mt-10 bg-contain bg-center bg-no-repeat relative">
				<div className="text-white text-4xl flex items-start justify-start w-11/12 h-2/6 font-bold gap-5">
					<span>#</span>
					<h3 className="pt-6">Obon</h3>
				</div>
				<div className="bg-primary-light w-11/12 h-4/6 text-start flex items-center justify-center ">
					<h2 className="w-11/12 text-lg sm:text-xl sm:font-semibold lg:text-4xl xl:text-5xl font-normal">
						A escolha dos melhores, para eventos inesquecíveis
					</h2>
				</div>
				<h3 className="absolute text-7xl top-0 sm:text-8xl lg:text-[148px] text-primary-light opacity-35 lg:-top-5 z-0">
					Obon
				</h3>
			</div>
			<div className="flex flex-col sm:flex-row justify-between items-center pt-10 pb-4">
				<h1 className="text-4xl font-normal text-start">Meus Eventos</h1>
				<Button
					className="flex mt-6 sm:mt-0"
					onClick={() => navigate("event/create")}
				>
					Criar evento <PlusIcon />
				</Button>
			</div>

			<Tabs defaultValue="all">
				<TabsList className="justify-between max-w-7xl items-center gap-0 overflow-x-auto h-12 mb-10">
					<TabsTrigger value="all" className="flex-1 justify-center mx-0">
						Todos ({filterEvents("all").length})
					</TabsTrigger>
					<TabsTrigger value="cancelled" className="flex-1 justify-center mx-0">
						Cancelados ({filterEvents("cancelled").length})
					</TabsTrigger>
					<TabsTrigger value="completed" className="flex-1 justify-center mx-0">
						Encerrados ({filterEvents("completed").length})
					</TabsTrigger>
					<TabsTrigger value="ongoing" className="flex-1 justify-center mx-0">
						Em Andamento ({filterEvents("ongoing").length})
					</TabsTrigger>
					<TabsTrigger value="scheduled" className="flex-1 justify-center mx-0">
						Agendados ({filterEvents("scheduled").length})
					</TabsTrigger>
				</TabsList>

				{isLoading ? (
					<LoadingComponent />
				) : (
					<div className="mb-14">
						<TabsContent value="all">
							{filterEvents("all").length ? (
								<div className="flex gap-10 flex-wrap">
									{filterEvents("all").map((card: any) => (
										<MyEventsCards
											key={card.id}
											id={card.id}
											address={card.Address}
											img={card.assets[0]?.url}
											startDate={card.startDate}
											title={card.title}
										/>
									))}
								</div>
							) : (
								<p className="text-2xl font-semibold text-muted-foreground">
									Oops... Parece que você não tem nenhum evento nessa categoria.
								</p>
							)}
						</TabsContent>

						<TabsContent value="cancelled">
							{filterEvents("cancelled").length ? (
								<div className="flex gap-10 flex-wrap">
									{filterEvents("cancelled").map((card: any) => (
										<MyEventsCards
											key={card.id}
											id={card.id}
											address={card.Address}
											img={card.assets[0]?.url}
											startDate={card.startDate}
											title={card.title}
										/>
									))}
								</div>
							) : (
								<p className="text-2xl font-semibold text-muted-foreground">
									Oops... Parece que você não tem nenhum evento nessa categoria.
								</p>
							)}
						</TabsContent>

						<TabsContent value="completed">
							{filterEvents("completed").length ? (
								<div className="flex gap-10 flex-wrap">
									{filterEvents("completed").map((card: any) => (
										<MyEventsCards
											key={card.id}
											id={card.id}
											address={card.Address}
											img={card.assets[0]?.url}
											startDate={card.startDate}
											title={card.title}
										/>
									))}
								</div>
							) : (
								<p className="text-2xl font-semibold text-muted-foreground">
									Oops... Parece que você não tem nenhum evento nessa categoria.
								</p>
							)}
						</TabsContent>

						<TabsContent value="ongoing">
							{filterEvents("ongoing").length ? (
								<div className="flex gap-10 flex-wrap">
									{filterEvents("ongoing").map((card: any) => (
										<MyEventsCards
											key={card.id}
											id={card.id}
											address={card.Address}
											img={card.assets[0]?.url}
											startDate={card.startDate}
											title={card.title}
										/>
									))}
								</div>
							) : (
								<p className="text-2xl font-semibold text-muted-foreground">
									Oops... Parece que você não tem nenhum evento nessa categoria.
								</p>
							)}
						</TabsContent>

						<TabsContent value="scheduled">
							{filterEvents("scheduled").length ? (
								<div className="flex gap-10 flex-wrap">
									{filterEvents("scheduled").map((card: any) => (
										<MyEventsCards
											key={card.id}
											id={card.id}
											address={card.Address}
											img={card.assets[0]?.url}
											startDate={card.startDate}
											title={card.title}
										/>
									))}
								</div>
							) : (
								<p className="text-2xl font-semibold text-muted-foreground">
									Oops... Parece que você não tem nenhum evento nessa categoria.
								</p>
							)}
						</TabsContent>
					</div>
				)}
			</Tabs>
		</div>
	);
};

export default MyEvents;
