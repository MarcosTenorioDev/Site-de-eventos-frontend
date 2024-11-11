import EventEditForm from "@/components/eventEditForm/eventEditForm";
import TicketsEditForm from "@/components/eventEditForm/TicketsEditForm";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastType, useToastContext } from "@/core/contexts/toasts.context";
import { IEventDetails } from "@/core/interfaces/Event.interface";
import CategoriesService from "@/core/services/categories.service";
import EventsService from "@/core/services/event.service";
import ProducerService from "@/core/services/producer.service";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EventInfo = () => {
	const { id } = useParams();
	const categoriesService = new CategoriesService();
	const producersService = new ProducerService();
	const [event, setEvent] = useState<IEventDetails>();
	const [loading, setLoading] = useState<boolean>(id ? true : false);
	const eventService = new EventsService();
	const toast = useToastContext();
	const navigate = useNavigate();
	const [categories, setCategories] = useState<
		{ value: string; label: string }[]
	>([]);
	const [producers, setProducers] = useState<
		{ value: string; label: string; image: string; description: string }[]
	>([]);

	useEffect(() => {
		if (id) {
			setLoading(true);
			categoriesService.getCategories().then((results) => {
				if (results) {
					const categoriesResult = results.map((categorie) => {
						return {
							value: categorie.id,
							label: categorie.name,
						};
					});
					setCategories([
						{ value: "", label: "Selecione uma opção" },
						...categoriesResult,
					]);
				}
			});
			producersService.getAllProducers().then((results: any) => {
				if (results) {
					const producersResult = results.map((producer: any) => {
						return {
							value: producer.id,
							label: producer.name,
							image: producer.imageUrl,
							description: producer.description,
						};
					});
					setProducers([
						{
							value: "",
							label: "Selecione uma opção",
							image: "",
							description: "",
						},
						...producersResult,
					]);
				}
			});
			eventService
				.getEventDetails(id)
				.then((event) => {
					setEvent(event);
				})
				.catch(() => {
					toast.showToast("Evento não encontrado", ToastType.Error);
					navigate("/managment/event");
				})
				.finally(() => {
					setLoading(false);
				});
			return;
		}
		navigate("/managment");
	}, [id]);

	if (loading) {
		return (
			<>
				<div className="w-full px-16 mx-auto space-y-4 mt-10">
					<Accordion
						type="single"
						defaultValue="item-1"
						className="w-full gap-10 flex flex-col"
					>
						<AccordionItem value="item-1">
							<AccordionTrigger className="flex items-center">
								<Skeleton className="h-14 w-4/6 bg-gray-200" />
							</AccordionTrigger>
							<AccordionContent className="flex flex-col gap-10">
								<div className="space-y-2">
									<Skeleton className="h-6 w-full bg-gray-200" />
									<Skeleton className="h-6 w-[90%] bg-gray-200" />
									<Skeleton className="h-6 w-[75%] bg-gray-200" />
								</div>
								<div className="space-y-2">
									<Skeleton className="h-14 w-1/6 bg-gray-200 mb-6" />
									<Skeleton className="h-6 w-full bg-gray-200" />
									<Skeleton className="h-6 w-[90%] bg-gray-200" />
									<Skeleton className="h-6 w-[75%] bg-gray-200" />
								</div>
								<div className="space-y-2">
									<Skeleton className="h-14 w-3/6 bg-gray-200 mb-6" />
									<Skeleton className="h-6 w-full bg-gray-200" />
									<Skeleton className="h-6 w-[90%] bg-gray-200" />
									<Skeleton className="h-6 w-[75%] bg-gray-200" />
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</>
		);
	}

	return (
		<div className="max-w-[1980px] mx-auto text-center min-h-screen px-4 sm:px-8 md:px-10 py-10 text-primary-dark flex flex-col gap-10">
			{event ? (
				<>
					<EventEditForm
						event={event}
						categories={categories}
						producers={producers}
					/>

					<TicketsEditForm
						ticketTypesProps={event.ticketTypes}
						eventId={event.id}
					/>
				</>
			) : (
				<></>
			)}
		</div>
	);
};

export default EventInfo;
