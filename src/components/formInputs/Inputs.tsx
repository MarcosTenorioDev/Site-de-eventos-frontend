import { Label } from "@radix-ui/react-label";
import { Field, ErrorMessage } from "formik";
import MaskedInput from "react-text-mask";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

//Input de texto default que pode receber uma máscara
export const Input = (props: {
	control: string;
	disabled?: boolean;
	label?: string;
	mask?: (string | RegExp)[];
	placeholder?: string;
}) => {
	return (
		<>
			<Label htmlFor={props.control}>{props.label}</Label>
			{props.mask ? (
				<Field name={props.control}>
					{({ field }: any) => (
						<MaskedInput
							{...field}
							disabled={props.disabled}
							type="text"
							mask={props.mask}
							placeholder={props.placeholder}
							className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-primary focus-visible:ring-1 focus-visible:to-primary disabled:cursor-not-allowed disabled:opacity-50"
						/>
					)}
				</Field>
			) : (
				<Field
					disabled={props.disabled}
					name={props.control}
					type="text"
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
	info?: string;
	children: any;
}) => {
	const { control, options, className, info } = props;

	return (
		<div className={`flex flex-col w-full`}>
			<label htmlFor={control} className={`font-primary font-medium`}>
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
	className: string;
	onSelect: any;
}) => {
	const { control, children, className, onSelect } = props;

	const [date, setDate] = useState<DateRange | undefined>({
		from: new Date(2022, 0, 20),
		to: addDays(new Date(2022, 0, 20), 20),
	});

	const handleDateChange = (newDate: DateRange | undefined) => {
		setDate(newDate);
		onSelect(newDate);
	};

	return (
		<div className={cn("grid w-full", className)}>
			<label htmlFor={control} className={`font-primary font-medium`}>
				{children}
			</label>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={"outline"}
						className={cn(
							"justify-start text-left font-medium font-primary bg-white h-12 focus:ring-primary",
							!date && "text-muted-foreground"
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
