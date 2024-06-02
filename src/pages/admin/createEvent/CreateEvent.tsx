import {
	AddressPicker,
	DatePicker,
	DateRangePicker,
	Input,
	Select,
} from "@/components/formInputs/Inputs";
import { Step, type StepItem, Stepper, useStepper } from "@/components/stepper";
import TicketsTypesCards from "@/components/ticketsCards/TicketsTypesCards";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ToastType, useToastContext } from "@/core/contexts/toasts.context";
import { Address } from "@/core/interfaces/Address";
import CategoriesService from "@/core/services/categories.service";
import EventsService from "@/core/services/event.service";
import ProducerService from "@/core/services/producer.service";
import TicketTypeService from "@/core/services/ticketType.service";
import UserService from "@/core/services/user.service";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { TicketIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const steps = [
	{ label: "Etapa 1", description: "Informações gerais" },
	{ label: "Etapa 2", description: "Ingressos (opcional)" },
	{ label: "Etapa 3", description: "Layout (opcional)" },
] satisfies StepItem[];

export default function CreateEvent() {
	const [eventId, setEventId] = useState("");
	return (
		<div className="max-w-[1980px] mx-auto text-center min-h-screen px-2 sm:px-8 md:px-20 py-10 ">
			<Stepper initialStep={0} steps={steps}>
				{steps.map((stepProps, index) => {
					if (index === 0) {
						return (
							<Step key={stepProps.label} {...stepProps}>
								<div
									className="h-[80%] flex items-center justify-center my-2 border text-primary rounded-md py-20"
									key={stepProps.label}
								>
									<FirstStep setEventId={setEventId} />
								</div>
							</Step>
						);
					}
					if (index === 1) {
						return (
							<Step key={stepProps.label} {...stepProps}>
								<div
									className="h-[80%] flex items-center justify-center my-2 border text-primary rounded-md py-10 px-5"
									key={stepProps.label}
								>
									<SecondStep eventId={eventId} />
								</div>
							</Step>
						);
					}
					if (index === 2) {
						return (
							<Step key={stepProps.label} {...stepProps}>
								<div
									className="h-[80%] flex items-center justify-center my-2 border text-primary rounded-md py-20"
									key={stepProps.label}
								>
									<ThirdStep />
								</div>
							</Step>
						);
					}
					<h2>terminou</h2>;
				})}
			</Stepper>
		</div>
	);
}

const ButtonsNavigation = () => {
	const {
		prevStep,
		resetSteps,
		isDisabledStep,
		hasCompletedAllSteps,
		isLastStep,
		isOptionalStep,
		currentStep,
		nextStep
	} = useStepper();
	const navigate = useNavigate();
	const handleNextStep= () => {
		if(currentStep.description === "Ingressos (opcional)"){
			nextStep()
		}
	}
	return (
		<>
			<div className="w-full flex justify-end gap-2 mt-10">
				{hasCompletedAllSteps ? (
					<Button
						size="sm"
						onClick={() => {
							resetSteps;
							navigate("/managment");
						}}
					>
						Concluir
					</Button>
				) : (
					<>
						<Button
							disabled={isDisabledStep}
							onClick={prevStep}
							size="sm"
							variant="secondary"
						>
							Voltar
						</Button>
						<Button size="sm" type="submit" onClick={handleNextStep}>
							{isLastStep ? "Enviar" : isOptionalStep ? "Avançar" : "Próximo"}
						</Button>
					</>
				)}
			</div>
		</>
	);
};

const FirstStep = ({ setEventId }: any) => {
	const { nextStep } = useStepper();
	const toast = useToastContext();

	const [categories, setCategories] = useState<
		{ value: string; label: string }[]
	>([{ value: "", label: "Selecione uma opção" }]);

	const [producers, setProducers] = useState<
		{ value: string; label: string; image: ""; description: "" }[]
	>([{ value: "", label: "Selecione uma opção", image: "", description: "" }]);

	const [userId, setUserId] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const categoriesService = new CategoriesService();
	const producersService = new ProducerService();
	const userService = new UserService();
	const eventsService = new EventsService();
	const formatTypes = [
		{ value: "", label: "Selecione um formato" },
		{ value: "Presencial", label: "Presencial" },
		{ value: "Remoto", label: "Remoto" },
		{ value: "Híbrido", label: "Híbrido" },
	];
	const eventStatus = [
		{ value: "", label: "Selecione uma opção" },
		{ value: "Ativo", label: "Ativo" },
		{ value: "Inativo", label: "Inativo" },
		{ value: "Pré-venda", label: "Pré-venda" },
	];

	useEffect(() => {
		categoriesService.getCategories().then((results: any) => {
			if (results) {
				const categoriesResult = results.map((categorie: any) => {
					return {
						value: categorie.id,
						label: categorie.description,
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
		userService.getUser().then((user: any) => {
			if (user) {
				setUserId(user.id);
			}
		});
	}, []);

	const initialValues = {
		title: "",
		description: "",
		capacity: 0,
		categoryId: "",
		status: "",
		startDate: new Date(),
		endDate: new Date(),
		salesStartDate: "",
		showStartDate: "",
		format: "",
		ageRating: 0,
		additionalDetails: "",
		creatorId: "",
		producerId: "",
		addressId: "",
	};

	const validationSchema = Yup.object({
		id: Yup.string(),
		title: Yup.string().required("O Título é obrigatório"),
		description: Yup.string().required("Descrição é obrigatória"),
		capacity: Yup.number()
			.positive("Apenas números positivos")
			.integer("Apenas números inteiros são permitidos")
			.nullable(),
		categoryId: Yup.string().required("Categoria é obrigatório"),
		status: Yup.string().required("Status é obrigatório"),
		startDate: Yup.date(),
		endDate: Yup.date(),
		salesStartDate: Yup.string().required(
			"Data de início de vendas é obrigatório"
		),
		showStartDate: Yup.string()
			.nullable()
			.required("Data de publicação é obrigatório"),
		format: Yup.string().required("Formato é obrigatório"),
		ageRating: Yup.number()
			.required("Classificação etária é obrigatório")
			.positive("Apenas números positivos")
			.integer("Apenas números inteiros"),
		additionalDetails: Yup.string().required(
			"Detalhes adicionais são obrigatórios"
		),
		creatorId: Yup.string(),
		producerId: Yup.string().required("Produtor é obrigatório"),
		addressId: Yup.string().required("Endereço é obrigatório"),
	});

	const onSubmit = (values: any) => {
		console.log("chegou aqui");
		if (!userId) {
			toast.showToast(
				"Oops... parece que houve um erro ao criar seu evento, por favor contate o suporte técnico",
				ToastType.Error
			);
			return;
		}
		const payload = {
			title: values.title,
			description: values.description,
			capacity: values.capacity,
			categoryId: values.categoryId,
			status: values.status,
			startDate: values.startDate,
			endDate: values.endDate,
			salesStartDate: values.salesStartDate,
			showStartDate: values.showStartDate,
			format: values.format,
			ageRating: values.ageRating,
			price: values.price,
			additionalDetails: values.additionalDetails,
			creatorId: userId,
			producerId: values.producerId,
			addressId: values.addressId,
		};
		setIsLoading(true);
		eventsService
			.postEvent(payload)
			.then((response: any) => {
				setIsLoading(false);
				setEventId(response.data.id);
				toast.showToast("Evento criado com sucesso! 🎉", ToastType.Success);
				nextStep();
			})
			.catch(() => {
				toast.showToast(
					"Oops... parece que houve um erro ao criar o seu evento, por favor contate o suporte técnico",
					ToastType.Error
				);
				setIsLoading(false);
			});
	};
	return (
		<div className="flex flex-col w-full px-5 sm:px-10 max-w-4xl">
			{isLoading ? (
				<>
					<h1>Loading...</h1>
				</>
			) : (
				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={onSubmit}
					enableReinitialize
				>
					<Form className="flex flex-col gap-4">
						<div className="flex flex-col text-start">
							<Input
								control="title"
								placeholder="Título do evento"
								label="Título do evento"
							/>
						</div>
						<div className="flex flex-col text-start">
							<Input
								control="description"
								placeholder="Insira a descrição para os usuários verem"
								label="Descrição do evento"
							/>
						</div>
						<div className="flex flex-col text-start">
							<Select
								control="status"
								options={eventStatus}
								className="w-full font-light h-9 text-muted-foreground"
								labelClassName="font-normal text-md"
							>
								Status do evento
							</Select>
						</div>
						<div className="flex flex-col text-start w-full">
							<Select
								control="producerId"
								options={producers}
								className="w-full font-light h-9 text-muted-foreground"
								labelClassName="font-normal text-md"
							>
								Produtor
							</Select>
						</div>
						<div className="flex justify-between flex-col lg:flex-row gap-4">
							<div className="flex flex-col text-start w-full">
								<Select
									control="categoryId"
									options={categories}
									className="w-full font-light h-9 text-muted-foreground"
									labelClassName="font-normal text-md"
								>
									Categoria
								</Select>
							</div>
							<div className="flex flex-col text-start w-full">
								<Input
									control="capacity"
									placeholder="Capacidade"
									label="Capacidade"
									type="number"
								/>
							</div>
						</div>
						<Field name="date">
							{({ field, form }: any) => (
								<DateRangePicker
									{...field}
									className="text-start text-base w-full"
									buttonClassName="font-normal h-9 text-muted-foreground"
									labelClassName="font-normal"
									onSelect={(value: any) => {
										form.values.startDate = value.from;
										form.values.endDate = value.to ? value.to : value.from;
									}}
									defaultStartDate={{ from: new Date(), to: new Date() }}
								>
									Data
								</DateRangePicker>
							)}
						</Field>
						<ErrorMessage name="date">
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
						<div className="flex justify-between flex-col lg:flex-row gap-4">
							<div className="flex flex-col text-start w-full">
								<Field name="salesStartDate">
									{({ field, form }: any) => (
										<DatePicker
											{...field}
											placeHolder="Início da venda de ingressos"
											control="salesStartDate"
											label="Data da venda"
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
							<div className="flex flex-col text-start w-full">
								<Field name="showStartDate">
									{({ field, form }: any) => (
										<DatePicker
											{...field}
											placeHolder="Data de publicação do evento"
											control="showStartDate"
											label="Publicação"
											className="w-full"
											onSelect={(value: any) => {
												form.values.showStartDate = value;
											}}
										/>
									)}
								</Field>
								<ErrorMessage name="showStartDate">
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
						</div>
						<div className="flex justify-between flex-col lg:flex-row gap-4">
							<div className="flex flex-col text-start w-full">
								<Select
									control="format"
									options={formatTypes}
									className="w-full font-light h-9 text-muted-foreground"
									labelClassName="font-normal text-md"
								>
									Formato
								</Select>
							</div>
							<div className="flex flex-col text-start  w-full">
								<Input
									control="ageRating"
									placeholder="Classificação etária"
									label="Classificação etária"
									type="number"
								/>
							</div>
						</div>
						<div className="flex flex-col text-start ">
							<Input
								control="additionalDetails"
								placeholder="Detalhes adicionais"
								label="Detalhes adicionais"
							/>
						</div>
						<div className="flex flex-col text-start ">
							<Field name="addressId">
								{({ form }: any) => (
									<AddressPicker
										onAddressSave={(address: Address) => {
											console.log(address.id);
											form.values.addressId = address.id;
										}}
										control="addressId"
									/>
								)}
							</Field>
						</div>
						<ButtonsNavigation />
					</Form>
				</Formik>
			)}
		</div>
	);
};

const SecondStep = (props: { eventId: string }) => {
	const { eventId } = props;
	console.log(eventId);
	const ticketTypeService = new TicketTypeService();
	const toast = useToastContext();
	const [tickets, setTickets] = useState<TicketType[]>([]);
	const initialValues = {
		eventId: eventId,
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
		quantity: Yup.number().required("Quantidade é obrigatória"),
		salesStartDate: Yup.string().required(
			"Inicio de venda dos ingressos é obrigatório"
		),
		salesEndDate: Yup.string().required("Descrição é obrigatória"),
		isActive: Yup.boolean(),
	});

	const onSubmit = async (values: TicketTypeCreate) => {
		const payload = {
			eventId: eventId,
			description: values.description,
			price: values.price,
			quantity: values.quantity,
			salesStartDate: values.salesStartDate,
			salesEndDate: values.salesEndDate,
			isActive: values.isActive ? values.isActive : false,
		};
		try {
			await ticketTypeService.postTicketType(payload).then((result: any) => {
				toast.showToast("ticket criado com sucesso", ToastType.Success)
				setTickets((prevTickets) => [...prevTickets, result]);
			});
		} catch {
			toast.showToast("Houve um erro ao criar o ticket para o evento selecionado", ToastType.Error)
		}
		console.log(values);
	};

	return (
		<div className="flex flex-col w-full">
			<h1 className="text-3xl">Hora de criar os ingressos do seu evento!</h1>
			<Card className="mt-5">
				<CardHeader className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 justify-center items-center">
					{tickets ? (
						<>
							{tickets.map((ticket: TicketType) => {
								return (
									<TicketsTypesCards
										id={ticket.id}
										description={ticket.description}
										price={ticket.price}
										quantity={ticket.quantity}
										salesEndDate={ticket.salesEndDate}
										salesStartDate={ticket.salesStartDate}
										key={ticket.id}
									/>
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
					<Dialog>
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
			<ButtonsNavigation />
		</div>
	);
};

const ThirdStep = () => {
	return (
		<>
			<h1>3 step</h1>
			<ButtonsNavigation />
		</>
	);
};
