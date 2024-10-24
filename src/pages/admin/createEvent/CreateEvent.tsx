import Attraction from "@/components/attractions/attraction";
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
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
} from "@/components/ui/carousel";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ToastType, useToastContext } from "@/core/contexts/toasts.context";
import { IAddress } from "@/core/interfaces/Address";
import CategoriesService from "@/core/services/categories.service";
import EventsService from "@/core/services/event.service";
import ProducerService from "@/core/services/producer.service";
import TicketTypeService from "@/core/services/ticketType.service";
import UserService from "@/core/services/user.service";
import Autoplay from "embla-carousel-autoplay";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { MinusIcon, PlusIcon, TicketIcon, XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import ageRatingIcon from "@/assets/icons/ageRatingIcon.svg";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AssetsService from "@/core/services/assets.service";

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
									className="h-[80%] flex items-center justify-center my-2 border text-primary rounded-md py-10"
									key={stepProps.label}
								>
									<ThirdStep eventId={eventId} />
								</div>
							</Step>
						);
					} else {
						return (
							<div className="h-[80%] flex items-center justify-center my-2 border text-primary rounded-md py-10">
								<SucessStep />;
							</div>
						);
					}
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
		nextStep,
	} = useStepper();
	const navigate = useNavigate();
	const handleNextStep = () => {
		if (currentStep.description === "Ingressos (opcional)") {
			nextStep();
		}
		if (currentStep.description === "Layout (opcional)") {
			nextStep();
		}
	};
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
										onAddressSave={(address: IAddress) => {
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
				toast.showToast("ticket criado com sucesso", ToastType.Success);
				setTickets((prevTickets) => [...prevTickets, result]);
			});
		} catch {
			toast.showToast(
				"Houve um erro ao criar o ticket para o evento selecionado",
				ToastType.Error
			);
		}
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

const ThirdStep = (props: { eventId: string }) => {
	const { eventId } = props;
	const [imageBanner, setImageBanner] = useState<string>("");
	const eventService = new EventsService();
	const assetsService = new AssetsService();
	const toast = useToastContext();
	const [event, setEvent] = useState<any>();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [attractions, setAttractions] = useState<
		{ id: string; description: string; imageUrl: string; name: string }[]
	>([]);
	const [tickets, setTickets] = useState<
		{ id: string; description: string; price: string; quantity: number }[]
	>([]);
	const [endDate, setEndDate] = useState<Date | undefined>();
	const [/* assetId */, setAssetId] = useState<string>("");
	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsLoading(true);
		const file = event.target.files?.[0];
		if (file) {
			const formData = new FormData();
			formData.append("image", file);

			assetsService
				.uploadAssets(formData)
				.then((response: { url: string }) => {
					/* console.log("Arquivo enviado com sucesso", response); */
					const payload = {
						eventId: eventId,
						type: "main",
						url: response.url,
						description: "banner",
					};
					assetsService
						.postAssets(payload)
						.then((assetCreate: any) => {
							setAssetId(assetCreate.id);
							setIsLoading(false);
						})
						.catch(() => {
							toast.showToast("Erro ao enviar arquivo", ToastType.Error);
							setImageBanner("");
							setIsLoading(false);
						});
				})
				.catch((error) => {
					console.error("Erro ao enviar arquivo", error);
					toast.showToast("Erro ao enviar arquivo", ToastType.Error);
					setImageBanner("");
					setIsLoading(false);
				});

			const reader = new FileReader();
			reader.onloadend = () => {
				setImageBanner(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};
/* 	const removeImageUpload = () => {
		assetsService
			.deleteAssetById(assetId)
			.then((response: any) => {
				console.log("deletado com sucesso");
			})
			.catch(() => {
				console.log("Erro ao deletar asset");
			});
	}; */

	useEffect(() => {
		if (eventId) {
			eventService.getEventById(eventId).then((event) => {
				setEvent(event);
				setAttractions(event.attractions);
				setEndDate(new Date(event.startDate));
				const tickets = event.ticketTypes.map(
					(ticket: {
						id: string;
						description: string;
						price: string;
						quantity: number;
					}) => ({
						id: ticket.id,
						description: ticket.description,
						price: ticket.price,
						quantity: 0,
					})
				);
				setTickets(tickets);
				return event;
			});
		}
	}, []);

	return (
		<div className="flex flex-col w-full px-5 sm:px-10 max-w-4xl">
			{event ? (
				<>
					<h1 className="text-3xl mb-5">
						Já estamos no final, revise a sua tela de evento antes de prosseguir
					</h1>
					{imageBanner ? (
						<div className="relative">
							<img
								src={imageBanner}
								alt="banner do evento"
								className="object-cover w-full h-full rounded-xl max-w-[1140px] max-h-[500px] aspect-video"
							></img>
							{isLoading ? (
								<div className="object-cover w-full absolute top-0 bg-gray-400 bg-opacity-30 h-full rounded-xl max-w-[1140px] max-h-[500px] aspect-video z-20">
									<p className="text-black h-full w-full flex justify-center items-center text-2xl font-semibold">
										Carregando...
									</p>
								</div>
							) : (
								<></>
							)}

							<Button
								className="absolute top-0 right-0 text-white w-max h-max hover:bg-slate-300 hover:bg-opacity-15 hover:text-white z-10"
								variant={"ghost"}
								onClick={() => setImageBanner("")}
							>
								<XCircleIcon className="w-10 h-10" />
							</Button>
						</div>
					) : (
						<>
							<div className="flex items-center justify-center w-full h-full max-w-[1140px] max-h-[500px] aspect-video border-2 border-dashed border-gray-500 rounded-xl hover:border-gray-900 transition-colors duration-300 p-10">
								<label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
									<span className="text-gray-500">
										Parece que você ainda não tem uma imagem para o seu evento,
										por favor selecione uma imagem
									</span>
									<input
										type="file"
										accept="image/*"
										className="hidden"
										onChange={handleImageUpload}
									/>
								</label>
							</div>
						</>
					)}

					<div className="flex w-full max-w-[1140px] justify-start mt-5">
						<Card className="p-5 rounded-3xl shadow-md shadow-gray-500 hover:shadow-lg hover:shadow-gray-500 w-min text-center font-primary">
							<div>
								<p className="text-3xl text-primary font-semibold">
									{endDate?.getDate()}
								</p>
								<p className="text-3xl text-primary font-semibold opacity-50">
									{endDate?.toLocaleString("default", { month: "short" })}
								</p>
								<p className="text-xl text-primary font-semibold opacity-50">
									{endDate?.toLocaleString("default", { weekday: "short" })}
								</p>
								<p className="text-3xl text-primary font-semibold opacity-50">
									{endDate?.getHours()}h
								</p>
							</div>
						</Card>
						<div className="flex justify-center items-start flex-col px-8 font-primary text-xl">
							<p className="mb-1">{event.location}</p>
							<p>{event.format}</p>
						</div>
					</div>
					<div className="flex flex-col lg:flex-row gap-10 mt-14">
						<Card className="w-full h-min">
							<CardHeader>{event.description}</CardHeader>
							<CardContent>
								{attractions.length ? (
									<>
										<h3 className="mb-6 text-xl">Atrações</h3>

										<Carousel
											className="w-10/12 mx-auto"
											plugins={[
												Autoplay({
													delay: 3000,
												}),
											]}
										>
											<CarouselContent>
												{attractions.map((attraction, index) => (
													<CarouselItem
														key={index}
														className="flex items-center justify-center"
													>
														<Attraction
															img={attraction.imageUrl}
															title={attraction.name}
															description={attraction.description}
														/>
													</CarouselItem>
												))}
											</CarouselContent>
											<CarouselPrevious className="hidden md:flex" />
											<CarouselNext className="hidden md:flex" />
										</Carousel>
									</>
								) : (
									""
								)}
								<div>
									<h3 className="font-bold text-xl">Classificação etária</h3>
									<p className="flex items-center gap-3 font-semibold text-lg mt-2">
										<i>
											<img src={ageRatingIcon} alt="" className="w-7" />
										</i>
										{event.ageRating} Anos
									</p>
								</div>
							</CardContent>
						</Card>
						<Card className="min-w-[280px] md:min-w-[330px] h-fit">
							<CardHeader className="bg-primary-dark text-white font-primary rounded-t-sm p-3">
								Ingressos
							</CardHeader>
							{tickets.length ? (
								<>
									<div className="flex flex-col justify-between">
										<CardContent className="p-4 min-w-64 text-start">
											{tickets.map((ticket, index) => (
												<div key={ticket.id} className="flex items-center">
													<div className="w-full">
														<p className="font-semibold text-lg">
															{ticket.description}
														</p>
														<p className="mb-2 text-sm text-primary">
															R$ {ticket.price}
														</p>
													</div>
													<div>
														<div className="flex">
															<Button
																disabled={true}
																variant={"ghost"}
																className="p-0"
																type="button"
																onClick={() => {}}
															>
																<MinusIcon />
															</Button>
															<input
																disabled={true}
																type="number"
																name={`tickets[${index}].quantity`}
																className="max-w-8 text-center"
															/>
															<Button
																disabled={true}
																variant={"ghost"}
																className="p-0"
																type="button"
															>
																<PlusIcon />
															</Button>
														</div>
													</div>
												</div>
											))}
										</CardContent>
										<CardFooter className="flex flex-col relative">
											<AlertDialog>
												<AlertDialogTrigger asChild>
													<Button
														variant="outline"
														className="text-primary border-[1px] py-3 border-black border-opacity-15 hover:text-primary-dark text-sm sm:text-lg md:text-sm lg:text-lg"
													>
														Adicionar código promocional{" "}
														<PlusIcon className="ml-2" />
													</Button>
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle className="text-lg">
															Adicionar Código promocional
														</AlertDialogTitle>
													</AlertDialogHeader>
													<AlertDialogDescription className="text-lg">
														<input
															className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-primary focus-visible:ring-1 focus-visible:to-primary disabled:cursor-not-allowed disabled:opacity-50"
															placeholder="Insira seu código promocional"
														/>
													</AlertDialogDescription>
													<AlertDialogFooter>
														<AlertDialogCancel className="text-lg">
															Cancel
														</AlertDialogCancel>
														<AlertDialogAction className="text-lg">
															Continue
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
											<Button
												type="submit"
												className="absolute -bottom-5 mx-auto text-lg"
											>
												Inscrever-se
											</Button>
										</CardFooter>
									</div>
								</>
							) : (
								<CardContent className="p-4 w-64 mx-auto text-center">
									<h3 className="w-full font-bold text-muted-foreground text-xl">
										{" "}
										Oops... Parece que ainda não há ingressos disponíveis para
										venda
									</h3>
								</CardContent>
							)}
						</Card>
					</div>
					<div className="flex flex-col sm:flex-row justify-center items-center w-full max-w-[1140px] sm:justify-start text-center mt-12 sm:mt-8 font-primary gap-8">
						<div>
							<h2 className="text-4xl font-semibold mb-5">Produtor</h2>
							<img
								src={event.producers?.imageUrl}
								alt=""
								className="w-full aspect-video sm:w-48"
							/>
						</div>
						<div className=" flex flex-col justify-end gap-5">
							<h3 className="text-3xl font-semibold">
								{event.producers?.name}
							</h3>
							<Button className="py-7">Entre em contato</Button>
						</div>
					</div>
					<ButtonsNavigation />
				</>
			) : (
				<></>
			)}
		</div>
	);
};

const SucessStep = () => {
	return (
		<div className="h-40 flex items-center justify-center my-2 border bg-secondary text-primary rounded-md">
			<h1 className="text-xl">Parabéns! O seu evento está pronto!🎉</h1>
		</div>
	);
};
