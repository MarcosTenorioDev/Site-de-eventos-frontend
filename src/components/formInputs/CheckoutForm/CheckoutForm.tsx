import { Formik, Form, Field, ErrorMessage } from "formik";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IPurchaseOrderReservedById, ReservePurchaseOrderPayload } from "@/core/interfaces/PurchaseOrder";
import { Button } from "@/components/ui/button";
import * as Yup from "yup";
import PurchaseOrderService from "@/core/services/purchaseOrder.service";
import { useState } from "react";
import { TicketCard } from "@/core/interfaces/Ticket.interface";

interface CheckoutFormProps {
	purchaseOrder: IPurchaseOrderReservedById;
	isSuccessfull: (isSuccessFull:boolean) => void
	tickets: (tickets:TicketCard[]) => void
}

const ParticipantSchema = Yup.object().shape({
	participants: Yup.array().of(
		Yup.object().shape({
			name: Yup.string().required("Nome do participante é obrigatório"),
			email: Yup.string()
				.email("Email inválido")
				.required("Email do participante é obrigatório"),
			ticketTypeId: Yup.string(),
		})
	),
});

export default function CheckoutForm({
	purchaseOrder,
	isSuccessfull,
	tickets
}: CheckoutFormProps) {
	const purchaseOrderService = new PurchaseOrderService()
	const [isLoading, setIsLoading] = useState(false)

	const onSubmit = (values: {
        participants: { email: string; name: string; ticketTypeId: string }[];
    }) => {
        const payload: ReservePurchaseOrderPayload = {
            eventId: purchaseOrder.eventId,
            ticketTypes: values.participants.map((participant) => ({
                participantName: participant.name,
                participantEmail: participant.email,
                ticketTypeId: participant.ticketTypeId,
            })),
        };
        console.log("Payload enviado:", payload);

		setIsLoading(true)
		purchaseOrderService.ReservePurchaseOrderById(purchaseOrder.id, payload).then((response) => {
			isSuccessfull(true)
			tickets(response.tickets)
			
		}).catch(() => {
			
		}).finally(() => {
			 setIsLoading(false)
		})
    };

    
	return (
		<Formik
			initialValues={{
				participants: purchaseOrder.reservedTicketTypes.flatMap((ticket) =>
					Array.from({ length: ticket.quantity }).map(() => ({
						name: "",
						email: "",
						ticketTypeId: ticket.ticketTypeId,
					}))
				),
			}}
			validationSchema={ParticipantSchema}
			onSubmit={onSubmit}
		>
			{({ handleSubmit }) => (
				<Form onSubmit={handleSubmit} className="w-full">
					<Card className="w-full">
						<CardHeader>
							<CardTitle className="text-primary-dark font-semibold text-xl">
								Dados do participante
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6">
							<div className="space-y-4">
								{purchaseOrder.reservedTicketTypes.map((ticket, ticketIndex) =>
									Array.from({ length: ticket.quantity }).map((_, index) => {
										const participantIndex =
											ticketIndex * ticket.quantity + index;
										return (
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
															: `R$ ${ticket.ticketType.price.toFixed(2)}`}
													</Badge>
												</div>
												<div>
													<Field
														as={Input}
														type="text"
														name={`participants[${participantIndex}].name`}
														placeholder="Nome do participante"
														className="w-full px-4 py-2 border rounded-md"
													/>
													<ErrorMessage
														name={`participants[${participantIndex}].name`}
														component="div"
														className="text-red-500 text-sm"
													/>
												</div>
												<div>
													<Field
														as={Input}
														type="email"
														name={`participants[${participantIndex}].email`}
														placeholder="Email do participante"
														className="w-full px-4 py-2 border rounded-md"
													/>
													<ErrorMessage
														name={`participants[${participantIndex}].email`}
														component="div"
														className="text-red-500 text-sm"
													/>
												</div>
											</div>
										);
									})
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
								type="submit"
								className="bg-green-500 hover:bg-green-600 text-white"
								disabled={isLoading}
							>
								{isLoading ? "Carregando..." : "Finalizar pedido"}
							</Button>
						</CardFooter>
					</Card>
				</Form>
			)}
		</Formik>
	);
}
