import { DatePicker, Input } from "@/components/formInputs/Inputs";
import TicketsTypesCards from "@/components/ticketsCards/TicketsTypesCards";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { TicketIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useStepper } from "../stepper/use-stepper";
import { Card, CardDescription, CardFooter, CardHeader } from "../ui/card";

interface ISecondStepProps {
	onChangeTicketTypes: (payload: TicketTypeCreate[]) => void;
	ticketTypes: TicketTypeCreate[];
}
const SecondStep = (props: ISecondStepProps) => {
	const [tickets, setTickets] = useState<TicketTypeCreate[]>(props.ticketTypes);
	const { prevStep, nextStep } = useStepper();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const initialValues = {
		eventId: "",
		description: "",
		price: 0,
		quantity: 0,
		salesStartDate: "",
		salesEndDate: "",
		isActive: false,
	};

	const validationSchema = Yup.object({
		description: Yup.string().required("Descrição é obrigatória"),
		price: Yup.number().required("Preço é obrigatório"),
		quantity: Yup.number()
			.required("Quantidade é obrigatória")
			.positive("Quantidade é obrigatória"),
		salesStartDate: Yup.string().required(
			"Inicio de venda dos ingressos é obrigatório"
		),
		salesEndDate: Yup.string().required(
			"Fim de venda dos ingressos é obrigatório"
		),
		isActive: Yup.boolean(),
	});

	const onSubmit = async (values: TicketTypeCreate) => {
		const payload = {
			eventId: "",
			description: values.description,
			price: values.price,
			quantity: values.quantity,
			salesStartDate: values.salesStartDate,
			salesEndDate: values.salesEndDate,
			isActive: values.isActive ? values.isActive : false,
		};
		setTickets([...tickets, payload]);
		setIsModalOpen(false);
	};

	useEffect(() => {
		props.onChangeTicketTypes([...tickets]);
	}, [tickets]);

	return (
		<div className="flex flex-col w-full">
			<h1 className="text-3xl">Hora de criar os ingressos do seu evento!</h1>
			<Card className="mt-5">
				<CardHeader className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 justify-center items-center">
					{tickets ? (
						<>
							{tickets.map((ticket, index) => {
								return (
									<div className="relative">
										<TicketsTypesCards
											key={index}
											description={ticket.description}
											price={ticket.price}
											quantity={ticket.quantity}
											salesEndDate={ticket.salesEndDate}
											salesStartDate={ticket.salesStartDate}
										/>
										<Button
											onClick={() => {
												setTickets((prevTickets) =>
													prevTickets.filter((_, i) => i !== index)
												);
											}}
											className="absolute top-3 right-3 bg-transparent text-red-500 shadow-none  h-6 w-6 min-h-6 min-w-6 hover:bg-red-500 hover:text-accent p-4"
										>
											{" "}
											<TrashIcon className=" h-6 w-6 min-h-6 min-w-6" />
										</Button>
									</div>
								);
							})}
						</>
					) : (
						<h3 className="text-3xl text-muted-foreground opacity-80">
							Oops... parece que você ainda não tem nenhum ingresso criado para
							o seu evento!{" "}
						</h3>
					)}
				</CardHeader>
				<CardDescription></CardDescription>
				<CardFooter className="justify-end items-center pb-0 p-4">
					<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
						<DialogTrigger asChild>
							<Button
								variant="outline"
								className="p-6 h-14 flex items-center justify-center gap-5 w-min"
							>
								<h2 className="text-primary font-semibold text-xl text-nowrap pb-1">
									Criar ingresso
								</h2>
								<TicketIcon className="text-primary w-8 h-8" />
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Criar ingresso</DialogTitle>
							</DialogHeader>
							<Formik
								initialValues={initialValues}
								validationSchema={validationSchema}
								onSubmit={onSubmit}
							>
								<Form className="text-start flex flex-col gap-3">
									<div>
										<Input
											control="description"
											label="Descrição do ingresso"
											placeholder="Descrição do ingresso"
											type="text"
										/>
									</div>
									<div>
										<Input
											control="price"
											label="Valor do ingresso"
											placeholder="Valor do ingresso ex: 200.00"
											type="number"
										/>
									</div>

									<div>
										<Input
											control="quantity"
											label="Quantidade do ingressos disponíveis"
											placeholder="Quantidade de ingressos a ser criado"
											type="number"
										/>
									</div>

									<div>
										<Field name="salesStartDate">
											{({ field, form }: any) => (
												<DatePicker
													{...field}
													placeHolder="Início da liberação de compra dos ingressos"
													control="salesStartDate"
													label="Início da data da venda"
													className="w-full"
													onSelect={(value: any) => {
														form.values.salesStartDate = value;
													}}
												/>
											)}
										</Field>
										<ErrorMessage name="salesStartDate">
											{(message) => (
												<div className="flex items-center">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 14 14"
														className="cl-internal-1sany6l w-4"
													>
														<path
															fill="red"
															fillRule="evenodd"
															d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z"
															clipRule="evenodd"
														></path>
													</svg>
													<p className="text-red-500 font-medium ml-1 text-sm">
														{message}
													</p>
												</div>
											)}
										</ErrorMessage>
									</div>

									<div>
										<Field name="salesEndDate">
											{({ field, form }: any) => (
												<DatePicker
													{...field}
													placeHolder="Fim da liberação de compra dos ingressos"
													control="salesEndDate"
													label="Fim da data da venda"
													className="w-full"
													onSelect={(value: any) => {
														form.values.salesEndDate = value;
													}}
												/>
											)}
										</Field>
										<ErrorMessage name="salesEndDate">
											{(message) => (
												<div className="flex items-center">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 14 14"
														className="cl-internal-1sany6l w-4"
													>
														<path
															fill="red"
															fillRule="evenodd"
															d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z"
															clipRule="evenodd"
														></path>
													</svg>
													<p className="text-red-500 font-medium ml-1 text-sm">
														{message}
													</p>
												</div>
											)}
										</ErrorMessage>
									</div>

									<div className="flex gap-2 mt-2">
										<Label className="pb-1">Ativo</Label>
										<Field name="isActive" type="checkbox" />
									</div>

									<div className="flex w-full justify-end">
										<Button type="submit">Criar ingresso</Button>
									</div>
								</Form>
							</Formik>
						</DialogContent>
					</Dialog>
				</CardFooter>
			</Card>
			<div className="flex self-end gap-6 mt-10">
				<Button onClick={prevStep} size="lg" variant="secondary">
					Voltar
				</Button>
				<Button size="lg" type="submit" onClick={nextStep}>
					Avançar
				</Button>
			</div>
		</div>
	);
};

export default SecondStep;
