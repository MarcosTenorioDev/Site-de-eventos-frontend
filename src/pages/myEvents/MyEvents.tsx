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

const MyEvents = () => {
	const [myEvents, setMyEvents] = useState<any[]>([]);
	const eventsService = new EventsService();

	useEffect(() => {
		eventsService
			.getUserEvents()
			.then((event: any) => {
				console.log(event);
			})
			.catch((err: any) => {
				console.error(err);
			});

		setMyEvents([
			{
				id: "3ff5b679-b651-4204-86ef-3e6d1bbbe920",
				title: "Rave Subaquática",
				addressId: "c718bd49-13ad-4604-bf59-7f3bb3599ac1",
				startDate: "2024-02-10T20:00:00.000Z",
				assets: [
					{
						id: "6b80c474-1835-469e-8a3c-3995d5cfd408",
						url: "https://assets-obon-backend-prd.s3.amazonaws.com/f188c114195b724dc711-evento1.png",
						type: "main",
						description: "",
					},
				],
				address: {
					id: "5e7e119f-703c-4f1d-9288-4475b5bdc16a",
					street: "Avenida Presidente Vargas",
					number: "2000",
					complement: null,
					neighborhood: "Centro",
					city: "Porto Alegre",
					state: "RS",
					zipCode: "90040-004",
				},
				ticket: {
					ticketTypeId: "1a4c32bf-3f62-444d-94a3-ec8264dba4b8",
					status: "active",
					ticketType: {
						eventId: "1a4c32bf-3f62-444d-94a3-ec8264dba4b8",
						description: "Inteira",
						price: "150",
						quantity: 4,
						isActive: true,
					},
				},
			},

			{
				id: "5e661ed6-b03b-4a55-a2fc-ca810361e21f",
				title: "Baile de Carnaval",
				addressId: "360d23e9-cd70-4686-9e6f-56c31791b4a5",
				startDate: "2024-02-10T20:00:00.000Z",
				assets: [
					{
						id: "6b80c474-1835-469e-8a3c-3995d5cfd408",
						url: "https://assets-obon-backend-prd.s3.amazonaws.com/f188c114195b724dc711-evento1.png",
						type: "main",
						description: "",
					},
				],
				address: {
					id: "5e7e119f-703c-4f1d-9288-4475b5bdc16a",
					street: "Avenida Presidente Vargas",
					number: "2000",
					complement: null,
					neighborhood: "Centro",
					city: "Porto Alegre",
					state: "RS",
					zipCode: "90040-004",
				},
				ticket: {
					ticketTypeId: "1a4c32bf-3f62-444d-94a3-ec8264dba4b8",
					status: "active",
					ticketType: {
						eventId: "1a4c32bf-3f62-444d-94a3-ec8264dba4b8",
						description: "Inteira",
						price: "150",
						quantity: 4,
						isActive: true,
					},
				},
			},
			{
				id: "a6810258-f30b-4c18-97c1-379643d508ad",
				title: "Show do Rock",
				addressId: "539e33c5-5809-4709-ba98-429124e294b1",
				startDate: "2024-02-10T20:00:00.000Z",
				assets: [
					{
						id: "6b80c474-1835-469e-8a3c-3995d5cfd408",
						url: "https://assets-obon-backend-prd.s3.amazonaws.com/f188c114195b724dc711-evento1.png",
						type: "main",
						description: "",
					},
				],
				address: {
					id: "5e7e119f-703c-4f1d-9288-4475b5bdc16a",
					street: "Avenida Presidente Vargas",
					number: "2000",
					complement: null,
					neighborhood: "Centro",
					city: "Porto Alegre",
					state: "RS",
					zipCode: "90040-004",
				},
				ticket: {
					ticketTypeId: "1a4c32bf-3f62-444d-94a3-ec8264dba4b8",
					status: "active",
					ticketType: {
						eventId: "1a4c32bf-3f62-444d-94a3-ec8264dba4b8",
						description: "Inteira",
						price: "150",
						quantity: 4,
						isActive: true,
					},
				},
			},
			{
				id: "83deb3bb-9bbb-47f2-b87d-407057938ffe",
				title: "Festa do Branco",
				addressId: "5d50a661-6d02-4994-8ef4-9a98783b4112",
				startDate: "2024-02-10T20:00:00.000Z",
				assets: [
					{
						id: "6b80c474-1835-469e-8a3c-3995d5cfd408",
						url: "https://assets-obon-backend-prd.s3.amazonaws.com/f188c114195b724dc711-evento1.png",
						type: "main",
						description: "",
					},
				],
				address: {
					id: "5e7e119f-703c-4f1d-9288-4475b5bdc16a",
					street: "Avenida Presidente Vargas",
					number: "2000",
					complement: null,
					neighborhood: "Centro",
					city: "Porto Alegre",
					state: "RS",
					zipCode: "90040-004",
				},
				ticket: {
					ticketTypeId: "1a4c32bf-3f62-444d-94a3-ec8264dba4b8",
					status: "active",
					ticketType: {
						eventId: "1a4c32bf-3f62-444d-94a3-ec8264dba4b8",
						description: "Inteira",
						price: "150",
						quantity: 4,
						isActive: true,
					},
				},
			},
			{
				id: "ac4fc645-d7c6-4e80-9dd1-ade2b23e2b65",
				title: "Noite do Sertanejo",
				addressId: "5e7e119f-703c-4f1d-9288-4475b5bdc16a",
				startDate: "2024-02-10T20:00:00.000Z",
				assets: [
					{
						id: "6b80c474-1835-469e-8a3c-3995d5cfd408",
						url: "https://assets-obon-backend-prd.s3.amazonaws.com/f188c114195b724dc711-evento1.png",
						type: "main",
						description: "",
					},
				],
				address: {
					id: "5e7e119f-703c-4f1d-9288-4475b5bdc16a",
					street: "Avenida Presidente Vargas",
					number: "2000",
					complement: null,
					neighborhood: "Centro",
					city: "Porto Alegre",
					state: "RS",
					zipCode: "90040-004",
				},
				ticket: {
					ticketTypeId: "1a4c32bf-3f62-444d-94a3-ec8264dba4b8",
					status: "active",
					ticketType: {
						eventId: "1a4c32bf-3f62-444d-94a3-ec8264dba4b8",
						description: "Inteira",
						price: "150",
						quantity: 4,
						isActive: true,
					},
				},
			},
			{
				id: "a22b412e-1887-4b79-be1e-9c2e2f396688",
				title: "Festa à Fantasia",
				addressId: "5e9b9f70-2962-4d79-9774-13b5497d12e7",
				startDate: "2024-10-31T22:00:00.000Z",
				assets: [
					{
						id: "6b80c474-1835-469e-8a3c-3995d5cfd408",
						url: "https://assets-obon-backend-prd.s3.amazonaws.com/f188c114195b724dc711-evento1.png",
						type: "main",
						description: "",
					},
				],
				address: {
					id: "5e7e119f-703c-4f1d-9288-4475b5bdc16a",
					street: "Avenida Presidente Vargas",
					number: "2000",
					complement: null,
					neighborhood: "Centro",
					city: "Porto Alegre",
					state: "RS",
					zipCode: "90040-004",
				},
				ticket: {
					ticketTypeId: "1a4c32bf-3f62-444d-94a3-ec8264dba4b8",
					status: "active",
					ticketType: {
						eventId: "1a4c32bf-3f62-444d-94a3-ec8264dba4b8",
						description: "Inteira",
						price: "150",
						quantity: 4,
						isActive: true,
					},
				},
			},
			{
				id: "94aa7388-d947-4d8e-ba83-f16e641bdb3e",
				title: "Sunset Party",
				addressId: "7a29ba32-1cb1-41ff-aa33-32d6ad7e889d",
				startDate: "2024-06-21T16:00:00.000Z",
				assets: [
					{
						id: "6b80c474-1835-469e-8a3c-3995d5cfd408",
						url: "https://assets-obon-backend-prd.s3.amazonaws.com/f188c114195b724dc711-evento1.png",
						type: "main",
						description: "",
					},
				],
				address: {
					id: "5e7e119f-703c-4f1d-9288-4475b5bdc16a",
					street: "Avenida Presidente Vargas",
					number: "2000",
					complement: null,
					neighborhood: "Centro",
					city: "Porto Alegre",
					state: "RS",
					zipCode: "90040-004",
				},
				ticket: {
					ticketTypeId: "1a4c32bf-3f62-444d-94a3-ec8264dba4b8",
					status: "active",
					ticketType: {
						eventId: "1a4c32bf-3f62-444d-94a3-ec8264dba4b8",
						description: "Inteira",
						price: "150",
						quantity: 4,
						isActive: true,
					},
				},
			},
			{
				id: "0776ec3e-3bf1-4279-bca9-92f970ead69a",
				title: "Show de Pop",
				addressId: "c34e5abb-4be3-4a78-998e-4d862c9a8c95",
				startDate: "2024-11-10T19:00:00.000Z",
				assets: [
					{
						id: "6b80c474-1835-469e-8a3c-3995d5cfd408",
						url: "https://assets-obon-backend-prd.s3.amazonaws.com/f188c114195b724dc711-evento1.png",
						type: "main",
						description: "",
					},
				],
				address: {
					id: "5e7e119f-703c-4f1d-9288-4475b5bdc16a",
					street: "Avenida Presidente Vargas",
					number: "2000",
					complement: null,
					neighborhood: "Centro",
					city: "Porto Alegre",
					state: "RS",
					zipCode: "90040-004",
				},
				ticket: {
					ticketTypeId: "1a4c32bf-3f62-444d-94a3-ec8264dba4b8",
					status: "active",
					ticketType: {
						eventId: "1a4c32bf-3f62-444d-94a3-ec8264dba4b8",
						description: "Inteira",
						price: "150",
						quantity: 4,
						isActive: true,
					},
				},
			},
			{
				id: "4415409a-c268-47d2-b35d-046c3863d306",
				title: "Festa de Réveillon",
				addressId: "de1e82eb-0b16-4924-8693-d387be1fde06",
				startDate: "2024-12-31T20:00:00.000Z",
				assets: [
					{
						id: "6b80c474-1835-469e-8a3c-3995d5cfd408",
						url: "https://assets-obon-backend-prd.s3.amazonaws.com/f188c114195b724dc711-evento1.png",
						type: "main",
						description: "",
					},
				],
				address: {
					id: "5e7e119f-703c-4f1d-9288-4475b5bdc16a",
					street: "Avenida Presidente Vargas",
					number: "2000",
					complement: null,
					neighborhood: "Centro",
					city: "Porto Alegre",
					state: "RS",
					zipCode: "90040-004",
				},
				ticket: {
					ticketTypeId: "1a4c32bf-3f62-444d-94a3-ec8264dba4b8",
					status: "active",
					ticketType: {
						eventId: "1a4c32bf-3f62-444d-94a3-ec8264dba4b8",
						description: "Inteira",
						price: "150",
						quantity: 4,
						isActive: true,
					},
				},
			},
		]);
	}, []);

	const filterEvents = (status: string) => {
		const now = new Date();
		return myEvents.filter((event) => {
			const eventStartDate = new Date(event.startDate);
			switch (status) {
				case "all":
					return true;
				case "cancelled":
					return event.ticket.status === "cancelled";
				case "completed":
					return eventStartDate <= now;
				case "ongoing":
					return eventStartDate > now;
				case "scheduled":
					return eventStartDate > now && event.ticket.status === "active";
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
					<h2 className="w-11/12 text-lg sm:text-xl sm:font-semibold lg:text-4xl xl:text-5xl font-normal">A escolha dos melhores, para eventos inesquecíveis</h2>
				</div>
				<h3 className="absolute text-7xl top-0 sm:text-8xl lg:text-[148px] text-primary-light opacity-35 lg:-top-5 z-0">Obon</h3>
			</div>
			<div className="flex flex-col sm:flex-row justify-between items-center pt-10 pb-4">
				<h1 className="text-4xl font-normal text-start">Meus Eventos</h1>
				<Button className="hidden sm:flex">
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
			<Button className="sm:hidden my-10">
				Criar evento <PlusIcon />
			</Button>
		</div>
	);
};

export default MyEvents;
