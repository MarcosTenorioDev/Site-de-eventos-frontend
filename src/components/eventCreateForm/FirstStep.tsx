import { IAddress } from "@/core/interfaces/Address";
import { IEventPayload } from "@/core/interfaces/Event.interface";
import CategoriesService from "@/core/services/categories.service";
import ProducerService from "@/core/services/producer.service";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import {
	AddressPicker,
	DateRangePicker,
	Input,
	NumberInput,
	Select,
} from "../formInputs/Inputs";
import MarkdownEditor from "../MarkdownEditor/MarkdownEditor";
import { useStepper } from "../stepper/use-stepper";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
interface IFirstStepProps {
	onSubmitEvent: (payload: IEventPayload) => void;
	event?: IEventPayload;
}
const FirstStep = (props: IFirstStepProps) => {
	const [categories, setCategories] = useState<
		{ value: string; label: string }[]
	>([{ value: "", label: "Selecione uma opção" }]);
	const { event } = props;
	const { nextStep } = useStepper();

	const [producers, setProducers] = useState<
		{ value: string; label: string; image: ""; description: "" }[]
	>([{ value: "", label: "Selecione uma opção", image: "", description: "" }]);

	const categoriesService = new CategoriesService();
	const producersService = new ProducerService();
	const formatTypes = [
		{ value: "", label: "Selecione um formato" },
		{ value: "Presencial", label: "Presencial" },
		{ value: "Remoto", label: "Remoto" },
		{ value: "Híbrido", label: "Híbrido" },
	];
	useEffect(() => {
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
	}, []);

	const initialValues: IEventPayload = event
		? {
				title: event.title,
				description: event.description,
				capacity: event.capacity,
				categoryId: event.categoryId,
				startDate: event.startDate,
				endDate: event.endDate,
				format: event.format,
				ageRating: event.ageRating,
				maxTicketsPerUser: event.maxTicketsPerUser,
				additionalDetails: event.additionalDetails,
				producerId: event.producerId,
				addressId: event.addressId,
		  }
		: {
				title: "",
				description: "",
				capacity: 0,
				categoryId: "",
				startDate: new Date(),
				endDate: new Date(),
				format: "",
				ageRating: 0,
				maxTicketsPerUser: 0,
				additionalDetails: "",
				producerId: "",
				addressId: "",
		  };

	const validationSchema = Yup.object({
		id: Yup.string(),
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
	});

	const onSubmit = (values: IEventPayload) => {
		const payload = {
			title: values.title,
			description: values.description,
			capacity: values.capacity,
			categoryId: values.categoryId,
			startDate: values.startDate,
			endDate: values.endDate,
			format: values.format,
			maxTicketsPerUser: values.maxTicketsPerUser,
			ageRating: values.ageRating,
			additionalDetails: values.additionalDetails,
			producerId: values.producerId,
			addressId: values.addressId,
		};
		props.onSubmitEvent(payload);
		nextStep();
	};
	return (
		<div className="flex flex-col w-full px-5 sm:px-10 max-w-4xl py-10">
			<h2 className="text-primary-dark text-2xl text-start mb-10">
				Informações do evento:
			</h2>
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={onSubmit}
			>
				{({ setFieldValue }) => (
					<Form className="flex flex-col gap-4">
						<div className="flex flex-col text-start">
							<Input
								control="title"
								placeholder="Título do evento"
								label="Título do evento"
							/>
						</div>
						<div className="flex flex-col text-start">
							<Label
								htmlFor="description"
								className="font-primary font-medium text-md"
							>
								Descrição do evento
							</Label>
							<div className="border rounded-md mt-4 bg-slate-100">
								<MarkdownEditor
									onValuesChanged={(value) => {
										console.log(value);
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
						<Field name="date">
							{({ field, form }: any) => (
								<DateRangePicker
									{...field}
									className="text-start text-base w-full"
									buttonClassName="font-light h-9 text-primary-dark"
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
						<div className="flex flex-col text-start "></div>
						<div className="flex flex-col text-start ">
							<Field name="addressId">
								{({ form }: any) => (
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
						<Button size="lg" type="submit" className="w-fit self-end">
							Avançar
						</Button>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default FirstStep;
