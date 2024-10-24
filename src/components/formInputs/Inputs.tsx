import { Label } from "@radix-ui/react-label";
import { Field, ErrorMessage, Formik, Form } from "formik";
import MaskedInput from "react-text-mask";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import {
	Calendar as CalendarIcon,
	PlusIcon,
	TrashIcon,
} from "lucide-react";
import { DateRange } from "react-day-picker";
import * as Yup from "yup";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import AddressService from "@/core/services/address.service";
import { IAddress } from "@/core/interfaces/Address";
import { formatCep } from "@/core/services/helper.service";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
//Input de texto default que pode receber uma máscara
export const Input = (props: {
	control: string;
	disabled?: boolean;
	label?: string;
	mask?: (string | RegExp)[];
	placeholder?: string;
	type?: string;
	onBlur?: any;
}) => {
	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		if (props.onBlur) {
			props.onBlur(e.target.value);
		}
	};
	return (
		<>
			<Label htmlFor={props.control}>{props.label}</Label>
			{props.mask ? (
				<Field name={props.control}>
					{({ field }: any) => (
						<MaskedInput
							{...field}
							disabled={props.disabled}
							type={props.type ? props.type : "text"}
							mask={props.mask}
							placeholder={props.placeholder}
							className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-primary focus-visible:ring-1 focus-visible:to-primary disabled:cursor-not-allowed disabled:opacity-50"
							onBlur={(value: any) => handleBlur(value)}
						/>
					)}
				</Field>
			) : (
				<Field
					onBlur={(value: any) => handleBlur(value)}
					disabled={props.disabled}
					name={props.control}
					type={props.type ? props.type : "text"}
					placeholder={props.placeholder}
					className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-primary focus-visible:ring-1 focus-visible:to-primary disabled:cursor-not-allowed disabled:opacity-50"
				/>
			)}

			<div className="flex items-center">
				<ErrorMessage name={props.control}>
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
							<p className="text-red-500 font-medium ml-1 text-sm">{message}</p>
						</div>
					)}
				</ErrorMessage>
			</div>
		</>
	);
};

export const Select = (props: {
	control: string;
	options: { value: string; label: string }[];
	className?: string;
	labelClassName?: string;
	info?: string;
	children: any;
}) => {
	const { control, options, className, info, labelClassName } = props;

	return (
		<div className={`flex flex-col w-full`}>
			<label
				htmlFor={control}
				className={cn("font-primary font-medium", labelClassName)}
			>
				{props.children}
			</label>
			<Field
				as="select"
				id={control}
				name={control}
				className={cn(
					"flex h-12 w-full font-primary font-medium items-center justify-between whitespace-nowrap rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
					className
				)}
			>
				{options.map((option: any) => (
					<option
						key={option.value}
						value={option.value}
						className={`font-medium text-xl font-primary`}
					>
						{option.label}
					</option>
				))}
			</Field>
			{info ? info : ""}
			<ErrorMessage name={props.control}>
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
						<p className="text-red-500 font-medium ml-1 text-sm">{message}</p>
					</div>
				)}
			</ErrorMessage>
		</div>
	);
};

export const DateRangePicker = (props: {
	control: string;
	children: any;
	className?: string;
	onSelect?: any;
	buttonClassName?: string;
	labelClassName?: string;
	defaultStartDate?: {
		from: Date;
		to: Date;
	};
}) => {
	const {
		control,
		children,
		className,
		onSelect,
		buttonClassName,
		labelClassName,
		defaultStartDate,
	} = props;

	const [date, setDate] = useState<DateRange | undefined>(
		defaultStartDate
			? {
					from: defaultStartDate.from,
					to: defaultStartDate.to,
			  }
			: {
					from: new Date(),
					to: addDays(new Date(), 20),
			  }
	);
	const handleDateChange = (newDate: DateRange | undefined) => {
		setDate(newDate);
		onSelect(newDate);
	};

	return (
		<div className={cn("grid w-full", className)}>
			<label
				htmlFor={control}
				className={cn("font-primary font-medium", labelClassName)}
			>
				{children}
			</label>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={"outline"}
						className={cn(
							"justify-start text-left font-medium font-primary bg-white h-12 focus:ring-primary",
							!date && "text-muted-foreground",
							buttonClassName
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, "dd, LLL, y")} -{" "}
									{format(date.to, "dd, LLL, y")}
								</>
							) : (
								format(date.from, "dd, LLL, y")
							)
						) : (
							<span>Escolha uma data</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						initialFocus
						mode="range"
						defaultMonth={date?.from}
						selected={date}
						onSelect={handleDateChange}
						numberOfMonths={2}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export const DatePicker = (props: {
	className?: string;
	placeHolder: string;
	label?: string;
	control: string;
	onSelect?: (date: Date | undefined) => void;
}) => {
	const { className, placeHolder, label, control, onSelect } = props;
	const [date, setDate] = useState<Date | undefined>();

	const handleDateChange = (selectedDate: Date | undefined) => {
		setDate(selectedDate);
		if (onSelect) {
			onSelect(selectedDate);
		}
	};

	return (
		<div className={cn("grid w-full", className)}>
			<Label htmlFor={control}>{label}</Label>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant={"outline"}
						className={cn(
							"w-full justify-start text-left font-normal truncate",
							!date && "text-muted-foreground"
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{date ? format(date, "dd, LLL, y") : <span>{placeHolder}</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<Calendar
						mode="single"
						selected={date}
						onSelect={handleDateChange}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export const AddressPicker = (props: {
	onAddressSave: (address: IAddress) => void;
	control: string;
}) => {
	const { onAddressSave, control } = props;
	const initialValues = {
		id: "",
		street: "",
		number: "",
		complement: "",
		neighborhood: "",
		city: "",
		state: "",
		zipCode: "",
	};
	const [address, setAddress] = useState<IAddress>();

	const validationSchema = Yup.object({
		street: Yup.string().required("Rua é obrigatória"),
		number: Yup.string().required("Número é obrigatório"),
		complement: Yup.string(),
		neighborhood: Yup.string().required("Bairro é obrigatório"),
		city: Yup.string().required("Cidade é obrigatória"),
		state: Yup.string().required("Estado é obrigatório"),
		zipCode: Yup.string()
			.required("CEP é obrigatório")
			.matches(/^\d{2}\.\d{3}\-\d{3}$/, "CEP deve estar no formato 00.000-000"),
	});

	const cepMask = [/\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/];
	const [defaultDisabled, setDefaultDisabled] = useState(true);
	const [addressValues, setAddressValues] = useState(initialValues);
	const addressService = new AddressService();

	const searchAddress = async (cep: string) => {
		const formatedCep = cep.replace(".", "").replace("-", "");
		if (!/^\d{2}\.\d{3}-\d{3}$/.test(cep)) {
			console.error("CEP inválido");
			return;
		}

		try {
			const address = await addressService.getApiGovAddress(formatedCep);
			if (/^\d{2}\.\d{3}-\d{3}$/.test(cep) && address.erro) {
				console.log("CEP não encontrado");
				setDefaultDisabled(false);
				return;
			}
			setAddressValues({
				id: "",
				street: address.logradouro || "",
				number: "",
				complement: address.complemento || "",
				neighborhood: address.bairro || "",
				city: address.localidade || "",
				state: address.uf || "",
				zipCode: cep,
			});
			setDefaultDisabled(true);
		} catch (error) {
			setDefaultDisabled(false);
		}
	};

	const onSubmit = async (values: any) => {
		const payload = {
			street: values.street,
			number: values.number,
			complement: values.complement,
			neighborhood: values.neighborhood,
			city: values.city,
			state: values.state,
			zipCode: values.zipCode.replace(".", "").replace("-", ""),
		};

		try {
			const result = await addressService.postAddress(payload);
			if (result && result.id) {
				onAddressSave(result);
				setAddress(result);
			}
		} catch (error) {
			console.error("Erro ao salvar o endereço:", error);
		}
	};
	return (
		<div className="flex flex-col w-full items-center sm:items-start">
			{address ? (
				<>
					{" "}
					<Card className="w-full max-w-[450px] bg-transparent">
						<CardHeader>
							<Label className="text-primary">Endereço</Label>
						</CardHeader>
						<CardContent>
							<div className="flex gap-2">
								<p>{address.city}</p>-<p>{address.state}</p>
							</div>
							<div className="flex gap-2">
								<p>{address.neighborhood}</p>-<p>{address.street}</p><p>{address.number}</p>
							</div>
							<div className="flex gap-2">
								<p>{address.complement}</p>
							</div>

							<p>{formatCep(address.zipCode)}</p>
						</CardContent>
						<CardFooter className="flex gap-5 w-full justify-end">
							<Button
								variant={"destructive"}
								onClick={() => {
									setAddress(undefined);
									onAddressSave(initialValues);
								}}
							>
								{" "}
								<TrashIcon />
							</Button>
						</CardFooter>
					</Card>
				</>
			) : (
				<>
					<Label className="mb-2 text-start w-full">Endereço</Label>
					<Dialog>
						<DialogTrigger
							onClick={() => {
								setDefaultDisabled(true);
								setAddressValues(initialValues);
							}}
							className="h-56 w-64 bg-muted p-8 hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
						>
							<PlusIcon className="w-full h-full" strokeWidth={1} />
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Endereço</DialogTitle>
								<DialogDescription>
									Preencha os campos abaixo com os dados do endereço.
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-2">
								<Formik
									initialValues={addressValues}
									validationSchema={validationSchema}
									onSubmit={onSubmit}
									enableReinitialize
								>
									<Form className="flex flex-col gap-3">
										<div>
											<Input
												control="zipCode"
												label="CEP"
												placeholder="CEP"
												type="text"
												mask={cepMask}
												onBlur={(value: any) => searchAddress(value)}
											/>
										</div>

										<div className="flex flex-col md:flex-row gap-3 md:gap-5 ">
											<div className="flex flex-col text-start">
												<Input
													control="street"
													label="Rua"
													placeholder="Rua"
													type="text"
													disabled={defaultDisabled}
												/>
											</div>
											<div className="flex flex-col text-start">
												<Input
													control="number"
													label="Número"
													placeholder="Número"
													type="text"
												/>
											</div>
											<div className="flex flex-col text-start ">
												<Input
													control="complement"
													label="Complemento"
													placeholder="Complemento"
													type="text"
												/>
											</div>
										</div>
										<div>
											<Input
												type="text"
												placeholder="Bairro"
												control="neighborhood"
												label="Bairro"
												disabled={defaultDisabled}
											/>
										</div>

										<div>
											<Input
												type="text"
												placeholder="Cidade"
												control="city"
												label="Cidade"
												disabled={defaultDisabled}
											/>
										</div>
										<div>
											<Input
												type="text"
												placeholder="Estado"
												control="state"
												label="Estado"
												disabled={defaultDisabled}
											/>
										</div>

										<div className="flex justify-end space-x-2 mt-4">
											<Button variant="ghost">Cancelar</Button>
											<Button variant="default" type="submit">
												Salvar
											</Button>
										</div>
									</Form>
								</Formik>
							</div>
						</DialogContent>
					</Dialog>
					<div className="flex items-center">
						<ErrorMessage name={control}>
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
				</>
			)}
		</div>
	);
};
