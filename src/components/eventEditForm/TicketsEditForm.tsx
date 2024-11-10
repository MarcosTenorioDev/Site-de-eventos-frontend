import { useState } from "react";
import EditTicketTypeCard from "../ticketsCards/EditTicketTypeCard";
import { TicketTypeForm } from "../ticketsCards/TicketTypeForm";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";

interface ITicketsEditFormProps {
	ticketTypesProps: any;
	eventId: string;
}

const TicketsEditForm = (props: ITicketsEditFormProps) => {
	const { ticketTypesProps, eventId } = props;
	const [ticketTypes] = useState<any[]>(ticketTypesProps);

	return (
		<Accordion type="single" collapsible className="w-full">
			<AccordionItem value="Event Details">
				<AccordionTrigger className="border border-b-0 rounded-md rounded-b-none px-8 font-bold text-xl text-start">
					Tickets do evento
				</AccordionTrigger>
				<AccordionContent className="p-4 border-x flex flex-wrap justify-center gap-10">
					{ticketTypes.map((ticket) => (
						<EditTicketTypeCard ticket={ticket} key={ticket.id} />
					))}
					<div className="flex w-full justify-end">
						<TicketTypeForm mode="create" eventId={eventId} />
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};

export default TicketsEditForm;
