import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { InputHTMLAttributes } from "react";

export interface SearchInputProps
	extends InputHTMLAttributes<HTMLInputElement> {
	placeholder?: string;
}

const SearchInput = ({
	title,
	placeholder,
	className,
	...props
}: SearchInputProps) => {
	return (
		<>
			<div className="relative flex w-full items-center">
				<MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500/40 ml-2" />
				<Input
					className={cn(
						"w-full py-2 pl-12 bg-[#F5F6FA] rounded-md shadow-sm ring-offset-transparent !outline-none focus-visible:ring-0 focus-visible:ring-transparent ",
						className
					)}
					placeholder={placeholder}
					{...props}
				/>
			</div>
		</>
	);
};

export default SearchInput;
