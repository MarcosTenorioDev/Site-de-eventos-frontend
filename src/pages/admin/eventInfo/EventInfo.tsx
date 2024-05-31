import { useState, useEffect } from "react";
import { Input } from "@/components/formInputs/Inputs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";

const EventInfo = () => {
	const { id } = useParams();
	const initialValues = {
		id: "",
		title: "",
		description: "",
		capacity: 0,
		category: "",
		status: "",
		startDate: "",
		endDate: "",
		salesStartDate: "",
		showStartDate: "" || null,
		format: "",
		ageRating: 0,
		price: "",
		additionalDetails: "",
		creatorId: "",
		producerId: "",
		addressId: "",
	};

	const validationSchema = Yup.object({
		id: Yup.string(),
		title: Yup.string().required("Title is required"),
		description: Yup.string().required("Description is required"),
		capacity: Yup.number()
			.required("Capacity is required")
			.positive()
			.integer(),
		category: Yup.number().required("Category is required"),
		status: Yup.string().required("Status is required"),
		startDate: Yup.date().required("Start Date is required"),
		endDate: Yup.date().required("End Date is required"),
		salesStartDate: Yup.date().required("Sales Start Date is required"),
		showStartDate: Yup.date().nullable(),
		format: Yup.string().required("Format is required"),
		ageRating: Yup.number()
			.required("Age Rating is required")
			.positive()
			.integer(),
		price: Yup.string().required("Price is required"),
		additionalDetails: Yup.string().required("Additional Details are required"),
		creatorId: Yup.string().required("Creator ID is required"),
		producerId: Yup.string().required("Producer ID is required"),
		addressId: Yup.string().required("Address ID is required"),
	});

	const onSubmit = (values: any) => {
		console.log(values);
	};

	const [formValues, setFormValues] = useState(initialValues);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (id) {
			setTimeout(() => {
				const fetchedData = {
					id: "00000-0-000000000",
					title: "Workshop Online de Design Thinking",
					description:
						"Um workshop virtual para explorar os princípios do design thinking e aplicá-los em projetos práticos",
					capacity: 20,
					category: "950666a4-b453-4a77-8446-ff8b47732403",
					status: "Ativo",
					startDate: "2024-12-15T14:00:00Z",
					endDate: "2024-12-15T16:00:00Z",
					salesStartDate: "2024-11-01T00:00:00Z",
					showStartDate: null,
					format: "Presencial",
					ageRating: 6,
					price: "R$50.00",
					additionalDetails:
						"Aulas divertidas de culinária para crianças com atividades práticas.",
					creatorId: "378bc080-c277-42f0-8948-2a46804817db",
					producerId: "e60bc84d-9203-44cd-99ad-183d55f82e1b",
					addressId: "5e9b9f70-2962-4d79-9774-13b5497d12e7",
				};
				setFormValues(fetchedData);
				setLoading(false);
			}, 2000);
            return
		}
        setLoading(false)
	}, []);

	return (
		<div className="max-w-[1980px] mx-auto text-center min-h-screen px-8 md:px-20 py-10">
			<div className="flex items-center justify-between max-w-3xl ">
				<h1 className="font-bold text-2xl text-start">Informações gerais</h1>
			</div>

			<Card className="max-w-3xl mt-10">
				<CardHeader className="pt-4 pb-0">
					<h4 className="text-xl text-end">{formValues.status}</h4>
				</CardHeader>
				<CardContent>
					{loading ? (
						<p>Loading...</p>
					) : (
						<Formik
							initialValues={formValues}
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
								<div className="flex justify-between flex-col lg:flex-row gap-4">
									<div className="flex flex-col text-start">
										<Input
											control="category"
											placeholder="Categoria"
											label="Categoria"
										/>
									</div>
									<div className="flex flex-col text-start">
										<Input
											control="capacity"
											placeholder="Capacidade"
											label="Capacidade"
										/>
									</div>
									<div className="flex flex-col text-start">
										<Input
											control="capacity"
											placeholder="Capacidade"
											label="Categoria"
										/>
									</div>
								</div>
								<div className="flex justify-between flex-col lg:flex-row gap-4">
									<div className="flex flex-col text-start ">
										<Input
											control="startDate"
											placeholder="Data de início"
											label="Data de início"
										/>
									</div>
									<div className="flex flex-col text-start ">
										<Input
											control="endDate"
											placeholder="Data de encerramento"
											label="Data de encerramento"
										/>
									</div>
									<div className="flex flex-col text-start ">
										<Input
											control="salesStartDate"
											placeholder="Início da venda de ingressos"
											label="Data da venda"
										/>
									</div>
								</div>
								<div className="flex justify-between flex-col lg:flex-row gap-4">
									<div className="flex flex-col text-start w-full">
										<Input
											control="format"
											placeholder="Formato"
											label="Formato"
										/>
									</div>
									<div className="flex flex-col text-start  w-full">
										<Input
											control="ageRating"
											placeholder="Classificação etária"
											label="Classificação etária"
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
							</Form>
						</Formik>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default EventInfo;
