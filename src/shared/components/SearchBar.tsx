import { Search } from "lucide-react";
import type { ChangeEventHandler } from "react";
import { cn } from "@/shared/utils/Utils";

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	label?: string;
	className?: string;
	inputClassName?: string;
}

export const SearchBar = ({
	value,
	onChange,
	placeholder = "Search",
	label = "Search",
	className,
	inputClassName,
}: SearchBarProps) => {
	const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		onChange(event.target.value);
	};

	return (
		<label
			className={cn(
				"flex h-11 min-w-0 items-center gap-3 rounded-lg border border-(--line) bg-(--surface-strong) px-3 text-sm transition focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15",
				className,
			)}
		>
			<Search size={17} className="shrink-0 text-muted-foreground" />
			<span className="sr-only">{label}</span>
			<input
				type="search"
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				className={cn(
					"w-full min-w-0 bg-transparent outline-none placeholder:text-muted-foreground",
					inputClassName,
				)}
			/>
		</label>
	);
};
