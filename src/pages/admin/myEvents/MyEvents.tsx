import { useState, useEffect } from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
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

const MyEvents = () => {
	const [myEvents, setMyEvents] = useState<IEventsCreated[]>([]);
	const eventsService = new EventsService();
	const navigate = useNavigate();
	const toast = useToastContext();

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
					className="hidden sm:flex"
					onClick={() => navigate("event/create")}
				>
					Criar evento <PlusIcon />
				</Button>
			</div>

			<Tabs defaultValue="all">
				<TabsList className="justify-between max-w-7xl items-center gap-0 overflow-x-auto h-12">
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

				<TabsContent value="all">
					{filterEvents("all").length ? (
						<Carousel
							className="mx-auto w-11/12 sm:w-10/12 xl:11/12 2xl:w-full max-w-7xl"
							opts={{
								loop: false,
							}}
						>
							<CarouselContent className="p-4 flex">
								{filterEvents("all").map((card: any) => (
									<CarouselItem className="basis-auto" key={card.id}>
										<MyEventsCards
											id={card.id}
											address={card.Address}
											img={card.assets[0]?.url}
											startDate={card.startDate}
											title={card.title}
										/>
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselNext className="hidden sm:flex" />
							<CarouselPrevious className="hidden sm:flex" />
						</Carousel>
					) : (
						<p className="text-2xl font-semibold text-muted-foreground">
							Oops... Parece que você não tem nenhum evento nessa categoria.
						</p>
					)}
				</TabsContent>

				<TabsContent value="cancelled">
					{filterEvents("cancelled").length ? (
						<Carousel
							className="mx-auto w-11/12 sm:w-10/12 xl:11/12 2xl:w-full max-w-7xl"
							opts={{
								loop: false,
							}}
						>
							<CarouselContent className="p-4 flex">
								{filterEvents("cancelled").map((card: any) => (
									<CarouselItem className="basis-auto" key={card.id}>
										<MyEventsCards
											id={card.id}
											address={card.address}
											img={card.assets[0]?.url}
											startDate={card.startDate}
											title={card.title}
										/>
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselNext className="hidden sm:flex" />
							<CarouselPrevious className="hidden sm:flex" />
						</Carousel>
					) : (
						<p className="text-2xl font-semibold text-muted-foreground">
							Oops... Parece que você não tem nenhum evento nessa categoria.
						</p>
					)}
				</TabsContent>

				<TabsContent value="completed">
					{filterEvents("completed").length ? (
						<Carousel
							className="mx-auto w-11/12 sm:w-10/12 xl:11/12 2xl:w-full max-w-7xl"
							opts={{
								loop: false,
							}}
						>
							<CarouselContent className="p-4 flex">
								{filterEvents("completed").map((card: any) => (
									<CarouselItem className="basis-auto" key={card.id}>
										<MyEventsCards
											id={card.id}
											address={card.address}
											img={card.assets[0]?.url}
											startDate={card.startDate}
											title={card.title}
										/>
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselNext className="hidden sm:flex" />
							<CarouselPrevious className="hidden sm:flex" />
						</Carousel>
					) : (
						<p className="text-2xl font-semibold text-muted-foreground">
							Oops... Parece que você não tem nenhum evento nessa categoria.
						</p>
					)}
				</TabsContent>

				<TabsContent value="ongoing">
					{filterEvents("ongoing").length ? (
						<Carousel
							className="mx-auto w-11/12 sm:w-10/12 xl:11/12 2xl:w-full max-w-7xl"
							opts={{
								loop: false,
							}}
						>
							<CarouselContent className="p-4 flex">
								{filterEvents("ongoing").map((card: any) => (
									<CarouselItem className="basis-auto" key={card.id}>
										<MyEventsCards
											id={card.id}
											address={card.address}
											img={card.assets[0]?.url}
											startDate={card.startDate}
											title={card.title}
										/>
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselNext className="hidden sm:flex" />
							<CarouselPrevious className="hidden sm:flex" />
						</Carousel>
					) : (
						<p className="text-2xl font-semibold text-muted-foreground">
							Oops... Parece que você não tem nenhum evento nessa categoria.
						</p>
					)}
				</TabsContent>

				<TabsContent value="scheduled">
					{filterEvents("scheduled").length ? (
						<Carousel
							className="mx-auto w-11/12 sm:w-10/12 xl:11/12 2xl:w-full max-w-7xl"
							opts={{
								loop: false,
							}}
						>
							<CarouselContent className="p-4 flex">
								{filterEvents("scheduled").map((card: any) => (
									<CarouselItem className="basis-auto" key={card.id}>
										<MyEventsCards
											id={card.id}
											address={card.address}
											img={card.assets[0]?.url}
											startDate={card.startDate}
											title={card.title}
										/>
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselNext className="hidden sm:flex" />
							<CarouselPrevious className="hidden sm:flex" />
						</Carousel>
					) : (
						<p className="text-2xl font-semibold text-muted-foreground">
							Oops... Parece que você não tem nenhum evento nessa categoria.
						</p>
					)}
				</TabsContent>
			</Tabs>
			<Button
				className="sm:hidden my-10"
				onClick={() => navigate("event/create")}
			>
				Criar evento <PlusIcon />
			</Button>
		</div>
	);
};

export default MyEvents;
