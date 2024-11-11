import MarkdownEditor from "@/components/MarkdownEditor/MarkdownEditor";
import {
	AddressPicker,
	DateRangePicker,
	Input,
	NumberInput,
	Select,
} from "@/components/formInputs/Inputs";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ToastType, useToastContext } from "@/core/contexts/toasts.context";
import { IAddress } from "@/core/interfaces/Address";
import {
	IEventDetails,
	IEventEditPayload,
} from "@/core/interfaces/Event.interface";
import AssetsService from "@/core/services/assets.service";
import EventsService from "@/core/services/event.service";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Label } from "@radix-ui/react-label";
import {
	ErrorMessage,
	Field,
	FieldArrayRenderProps,
	Form,
	Formik,
} from "formik";
import { UploadIcon } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";

interface IEditEventFormProps {
	event: IEventDetails;
	categories: { value: string; label: string }[];
	producers: {
		value: string;
		label: string;
		image: string;
		description: string;
	}[];
}

const EventEditForm = (props: IEditEventFormProps) => {
	const { event, categories, producers } = props;
	const [newBannerImage, setNewBannerImage] = useState<File>();
	const eventService = new EventsService();
	const assetsService = new AssetsService();
	const toast = useToastContext();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const initialValues: IEventEditPayload = {
		title: event.title,
		description: event.description,
		capacity: event.capacity,
		categoryId: event.categoryId,
		status: event.status,
		startDate: event.startDate,
		endDate: event.endDate,
		format: event.format,
		ageRating: event.ageRating,
		maxTicketsPerUser: event.maxTicketsPerUser,
		additionalDetails: event.additionalDetails,
		producerId: event.producerId,
		addressId: event.addressId,
	};

	const validationSchema = Yup.object({
		title: Yup.string().required("O Título é obrigatório"),
		description: Yup.string().required("Descrição é obrigatória"),
		capacity: Yup.number()
			.moreThan(0, "Capacidade do evento é obrigatório")
			.integer("Apenas números inteiros são permitidos")
			.nullable(),
		categoryId: Yup.string().required("Categoria é obrigatório"),
		startDate: Yup.date(),
		endDate: Yup.date(),
		format: Yup.string().required("Formato é obrigatório"),
		ageRating: Yup.number()
			.required("Classificação etária é obrigatório")
			.positive("Apenas números positivos")
			.integer("Apenas números inteiros"),
		additionalDetails: Yup.string().required(
			"Detalhes adicionais são obrigatórios"
		),
		producerId: Yup.string().required("Produtor é obrigatório"),
		addressId: Yup.string().required("Endereço é obrigatório"),
		maxTicketsPerUser: Yup.number()
			.moreThan(0, "Máx. ingressos por usuário é obrigatório")
			.required("Máx. ingressos por usuário é obrigatório"),
		status: Yup.string().required("Status do evento é obrigatório"),
	});

	const formatTypes = [
		{ value: "", label: "Selecione um formato" },
		{ value: "Presencial", label: "Presencial" },
		{ value: "Remoto", label: "Remoto" },
		{ value: "Híbrido", label: "Híbrido" },
	];

	const handleImageUpload = (event: any) => {
		const file = event.target.files[0];
		if (file) {
			setNewBannerImage(file);
		}
	};

	const onSubmit = (values: IEventEditPayload) => {
		const {
			additionalDetails,
			addressId,
			ageRating,
			capacity,
			categoryId,
			description,
			endDate,
			format,
			maxTicketsPerUser,
			producerId,
			startDate,
			status,
			title,
		} = values;
		const payload: IEventEditPayload = {
			additionalDetails,
			addressId,
			ageRating,
			capacity,
			categoryId,
			description,
			endDate,
			format,
			maxTicketsPerUser,
			producerId,
			startDate,
			status,
			title,
		};

		console.log(event);
		setIsLoading(true);
		eventService
			.updateEvent(payload, event.id)
			.then((event: IEventDetails) => {
				if (newBannerImage) {
					const payload = new FormData();

					payload.append("image", newBannerImage);
					payload.append("eventId", event.id);
					payload.append("type", "image");
					payload.append("description", "main");

					assetsService
						.postAssets(payload)
						.then(() => {
							toast.showToast("Evento editado com sucesso", ToastType.Success);
							window.location.reload();
						})
						.catch(() => {
							toast.showToast(
								"Houve um erro ao editar a imagem do seu evento, por favor, contate o suporte técnico",
								ToastType.Error
							);
							window.location.reload();
						});
					return;
				}

				toast.showToast("Evento editado com sucesso", ToastType.Success);
				window.location.reload();
			})
			.catch(() => {
				toast.showToast(
					"Houve um erro ao editar o seu evento, por favor, contate o suporte técnico",
					ToastType.Error
				);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
			validationSchema={validationSchema}
		>
			{({ setFieldValue, values }) => (
				<Form className="flex flex-col gap-4">
					<div className="flex items-center justify-between mb-6">
						<h1 className="font-bold text-2xl text-start">
							Informações gerais do evento
						</h1>
					</div>

					<Accordion type="single" collapsible>
						<AccordionItem value="Event Details">
							<AccordionTrigger className="border border-b-0 rounded-md rounded-b-none px-8 font-bold text-xl text-start">
								Detalhes do evento{" "}
							</AccordionTrigger>
							<AccordionContent>
								<Card className="border border-t-0 rounded-t-none text-primary">
									<CardHeader>
										<label className="flex flex-col relative items-center justify-center w-full h-full cursor-pointer ">
											<img
												src={
													newBannerImage
														? URL.createObjectURL(newBannerImage)
														: event.assets[0]?.url
												}
												alt={event.title}
												className="w-full aspect-video max-h-64 object-cover rounded-t-lg"
											/>
											<div className="flex w-full h-full flex-col justify-center bg-black/20 md:bg-black/70  items-center absolute top-0 cursor-pointer md:opacity-0 hover:opacity-100">
												<div className="hover:bg-gray-700 p-3 rounded-full">
													<UploadIcon
														className="size-6 text-muted"
														aria-hidden="true"
													/>
												</div>

												<p className="font-medium text-base text-muted text-center">
													Alterar imagem
												</p>
											</div>
											<input
												type="file"
												accept="image/*"
												className="hidden"
												onChange={handleImageUpload}
											/>
										</label>

										<div className="pt-8 text-start">
											<Label className="text-primary font-medium">
												{" "}
												Status do evento:
											</Label>
											<div className="flex justify-start items-center gap-8 pt-1">
												<Badge
													className={` text-xl rounded-full ${
														values.status === "Ativo"
															? "bg-green-500 hover:bg-green-300"
															: "bg-gray-500 hover:bg-gray-300"
													}`}
												>
													{values.status}
												</Badge>
												<Switch
													checked={values.status === "Ativo"}
													onCheckedChange={(checked) =>
														setFieldValue(
															"status",
															checked ? "Ativo" : "Inativo"
														)
													}
												/>
											</div>
											<span className="text-sm flex text-muted-foreground items-center gap-2 font-semibold mt-2">
												<InfoCircledIcon className="w-5 h-5" />
												Obs: o status do seu evento afetará a visibilidade do
												mesmo para os usuários .
											</span>
										</div>
										<div className="flex flex-col text-start pt-4">
											<Input
												control="title"
												placeholder="Título do evento"
												label="Título do evento"
											/>
										</div>
										<div className="flex flex-col text-start pt-2">
											<Label
												htmlFor="description"
												className="font-primary font-medium text-md"
											>
												Descrição do evento
											</Label>
											<div className="border rounded-md mt-2 bg-slate-100">
												<MarkdownEditor
													onValuesChanged={(value) => {
														const hasContent = JSON.parse(
															value
														).root.children.some((c: any) => {
															return c.children.length != 0;
														});
														if (!hasContent) {
															setFieldValue("description", "");
															return;
														}
														setFieldValue("description", value);
													}}
													content={initialValues.description}
												/>
											</div>
											<ErrorMessage name="description">
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
									</CardHeader>
									<CardContent>
										<div className="flex flex-row gap-4 text-start w-full">
											<Select
												control="producerId"
												options={producers}
												className="w-full font-light h-9 text-primary-dark"
												labelClassName="font-normal text-md"
											>
												Produtor
											</Select>

											<Select
												control="categoryId"
												options={categories}
												className="w-full font-light h-9 text-primary-dark"
												labelClassName="font-normal text-md"
											>
												Categoria
											</Select>
										</div>
										<div className="flex flex-wrap justify-center lg:justify-start gap-10 my-5">
											<div className="flex flex-col text-center items-center">
												<NumberInput
													control="capacity"
													placeholder="Capacidade"
													label="Capacidade"
												/>
											</div>
											<div className="flex flex-col text-center items-center">
												{" "}
												<NumberInput
													control="ageRating"
													label="Classificação etária"
													placeholder="0"
												/>
											</div>
											<div className="flex flex-col text-center items-center">
												{" "}
												<NumberInput
													control="maxTicketsPerUser"
													label="Máx. tickets por usuário"
													placeholder="999"
												/>
											</div>
										</div>
										<div className="flex justify-between flex-col lg:flex-row gap-4">
											<div className="flex flex-col text-start w-full">
												<Select
													control="format"
													options={formatTypes}
													className="w-full font-light h-9"
													labelClassName="font-normal text-md"
												>
													Formato
												</Select>
											</div>
											<div className="flex flex-col text-start  w-full">
												<Input
													control="additionalDetails"
													placeholder="Detalhes adicionais"
													label="Detalhes adicionais"
												/>
											</div>
										</div>
										<div>
											<Field name="date">
												{({ field, form }: any) => (
													<DateRangePicker
														{...field}
														className="text-start text-base w-full"
														buttonClassName="font-light h-9 text-primary-dark"
														labelClassName="font-normal"
														onSelect={(value: any) => {
															form.values.startDate = value.from;
															form.values.endDate = value.to
																? value.to
																: value.from;
														}}
														defaultStartDate={{
															from: new Date(),
															to: new Date(),
														}}
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
										</div>
										<div className="mt-4">
											<Field name="addressId">
												{({ form }: FieldArrayRenderProps) => (
													<AddressPicker
														onAddressSave={(address: IAddress) => {
															form.values.addressId = address.id;
														}}
														control="addressId"
														addressId={initialValues.addressId}
													/>
												)}
											</Field>
										</div>
									</CardContent>
									<div className="w-full flex justify-end px-6">
										<Button
											type="submit"
											className="mb-6 bg-green-500 hover:bg-green-300"
											disabled={isLoading}
										>
											{isLoading ? "Carregando..." : "Salvar alterações"}
										</Button>
									</div>
								</Card>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</Form>
			)}
		</Formik>
	);
};

export default EventEditForm;
