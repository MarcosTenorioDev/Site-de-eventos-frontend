import { Input } from "@/components/formInputs/Inputs";
import { Step, type StepItem, Stepper, useStepper } from "@/components/stepper";
import { Button } from "@/components/ui/button";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const steps = [
	{ label: "Step 1", description: "Description" },
	{ label: "Step 2", description: "Description" },
	{ label: "Step 3", description: "Description" },
] satisfies StepItem[];

export default function CreateEvent() {
	const initialValues = {
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

	return (
		<div className="max-w-[1980px] mx-auto text-center min-h-screen px-8 md:px-20 py-10 h-full">
			<Stepper initialStep={0} steps={steps}>
				{steps.map((stepProps, index) => {
					return (
						<Step key={stepProps.label} {...stepProps}>
							<div
								className="h-[80%] flex items-center justify-center my-2 border text-primary rounded-md"
								key={stepProps.label}
							>
								<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
									<Form>{FormSteps(index + 1)}</Form>
								</Formik>
							</div>
						</Step>
					);
				})}
				<Sucess />
			</Stepper>
		</div>
	);
}

const Sucess = () => {
	const {
		nextStep,
		prevStep,
		resetSteps,
		isDisabledStep,
		hasCompletedAllSteps,
		isLastStep,
		isOptionalStep,
	} = useStepper();
	const navigate = useNavigate();
	return (
		<>
			{hasCompletedAllSteps && (
				<div className="h-40 flex items-center justify-center my-2 border bg-secondary text-primary rounded-md">
					<h1 className="text-xl">Parabéns, seu evento foi criado! 🎉</h1>
				</div>
			)}
			<div className="w-full flex justify-end gap-2">
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
						<Button size="sm" onClick={nextStep}>
							{isLastStep ? "Enviar" : isOptionalStep ? "Avançar" : "Próximo"}
						</Button>
					</>
				)}
			</div>
		</>
	);
};

const FormSteps = (currentPage: number) => {
	return (
		<div className="flex flex-col gap-4">
			{currentPage === 1 && (
				<>
					<div className="flex flex-col text-start">
						<Input
							control="title"
							placeholder="Título do evento"
							label="Título do evento"
						/>
					</div>
				</>
			)}
			{currentPage === 2 && (
				<>
					<div className="flex flex-col text-start">
						<Input
							control="category"
							placeholder="Categoria"
							label="Categoria"
						/>
					</div>
				</>
			)}
			{currentPage === 3 && (
				<>
					<div className="flex flex-col text-start">
						<Input
							control="startDate"
							placeholder="Data de início"
							label="Data de início"
						/>
					</div>
				</>
			)}
		</div>
	);
};
