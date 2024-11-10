import { ToastType, useToastContext } from "@/core/contexts/toasts.context";
import { EditTicketType, ITicketTypeForm } from "@/core/interfaces/TicketType";
import TicketTypeService from "@/core/services/ticketType.service";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Label } from "@radix-ui/react-label";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { PenBoxIcon, TicketIcon } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";
import { DatePicker, Input } from "../formInputs/Inputs";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";

interface ITicketTypeFormProps {
	ticket?: ITicketTypeForm;
	mode: "create" | "edit";
	eventId: string;
}

export const TicketTypeForm = (props: ITicketTypeFormProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const ticketTypeService = new TicketTypeService();
	const toast = useToastContext();
	const [isLoadingCreate, setIsLoadingCreate] = useState<boolean>(false);
	const { mode, ticket, eventId } = props;

	const initialValues: ITicketTypeForm = {
		id: ticket?.id || "",
		eventId: eventId,
		description: ticket?.description || "",
		price: ticket?.price || 0,
		quantity: ticket?.quantity || 0,
		salesStartDate: ticket?.salesStartDate || "",
		salesEndDate: ticket?.salesEndDate || "",
		isActive: ticket?.isActive || false,
		reservedQuantity: ticket?.reservedQuantity || 0,
	};

	const validationEditSchema = Yup.object({
		id: Yup.string().required(),
		eventId: Yup.string().required(),
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
	const validationCreateSchema = Yup.object({
		id: Yup.string(),
		eventId: Yup.string(),
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

	const onCreate = async (values: ITicketTypeForm) => {
		if (!values.eventId) {
			return;
		}
		const payload = {
			eventId: values.eventId,
			description: values.description,
			price: values.price,
			quantity: values.quantity,
			salesStartDate: values.salesStartDate,
			salesEndDate: values.salesEndDate,
			isActive: values.isActive,
		};
		setIsLoadingCreate(true);

		ticketTypeService
			.postTicketType(payload)
			.then(() => {
				toast.showToast(
					"Ticket do evento criado com sucesso",
					ToastType.Success
				);
				window.location.reload();
			})
			.catch(() => {
				toast.showToast(
					"Houve um erro ao criar o seu ticket, por favor, contatar o suporte técnico",
					ToastType.Error
				);
			})
			.finally(() => {
				setIsLoadingCreate(false);
			});
		setIsModalOpen(false);
	};

	const onEdit = async (values: ITicketTypeForm) => {
		const { eventId, isActive, quantity, salesEndDate, salesStartDate, id } =
			values;

		if (!id) {
			return;
		}
		const payload: EditTicketType = {
			quantity,
			salesStartDate,
			salesEndDate,
			isActive,
			eventId,
		};

		ticketTypeService
			.updateTicketType(payload, id)
			.then(() => {
				toast.showToast("Ticket editado com sucesso", ToastType.Success);
				window.location.reload();
			})
			.catch(() => {
				toast.showToast(
					"Houve um erro ao editar o seu ticket, por favor, contatar o suporte técnico",
					ToastType.Error
				);
			})
			.finally(() => {});
		console.log(payload);
		setIsModalOpen(false);
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
			<DialogTrigger asChild>
				{mode === "edit" ? (
					<Button variant={"outline"} className="self-end">
						<PenBoxIcon />
					</Button>
				) : (
					<Button
						variant="outline"
						className="p-6 h-14 flex items-center justify-center gap-5 w-min border-primary"
					>
						<h2 className="text-primary font-semibold text-xl text-nowrap pb-1">
							Criar ingresso
						</h2>
						<TicketIcon className="text-primary w-8 h-8" />
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-xl ">
						{mode === "edit" ? "Editar" : "Criar"} ingresso
					</DialogTitle>
				</DialogHeader>
				<Formik
					initialValues={initialValues}
					validationSchema={
						mode === "edit" ? validationEditSchema : validationCreateSchema
					}
					onSubmit={mode === "edit" ? onEdit : onCreate}
				>
					<Form className="text-start flex flex-col gap-3">
						<div>
							<Input
								control="description"
								label="Descrição do ingresso"
								placeholder="Descrição do ingresso"
								type="text"
								disabled={mode === "edit" ? true : false}
							/>
							{mode === "edit" ? (
								<span className="text-xs flex gap-1 text-muted-foreground font-semibold mt-1 ml-1">
									<InfoCircledIcon className="w-4 h-4" /> Não é possível alterar
									a descrição do ticket após criado.
								</span>
							) : null}
						</div>
						<div>
							<Input
								control="price"
								label="Valor do ingresso"
								placeholder="Valor do ingresso ex: 200.00"
								type="number"
								disabled={mode === "edit" ? true : false}
							/>
							{mode === "edit" ? (
								<span className="text-xs flex gap-1 text-muted-foreground font-semibold mt-1 ml-1">
									<InfoCircledIcon className="w-4 h-4" /> Não é possível alterar
									o valor do ticket após criado.
								</span>
							) : null}
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
							<Button
								type="submit"
								disabled={mode === "edit" ? isLoadingCreate : isLoadingCreate}
							>
								{mode === "edit" ? "Editar" : "Criar"} ingresso
							</Button>
						</div>
					</Form>
				</Formik>
			</DialogContent>
		</Dialog>
	);
};
