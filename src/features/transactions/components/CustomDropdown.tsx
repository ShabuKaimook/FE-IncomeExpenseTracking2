import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type DropdownOption = {
	label: string;
	value: string;
};

export type DropdownSection = {
	title?: string;
	options: DropdownOption[];
};

interface CustomDropdownProps {
	label: string;
	sections: DropdownSection[];
	value: string;
	onChange: (value: string) => void;
	className?: string;
}

export function CustomDropdown({
	label,
	sections,
	value,
	onChange,
	className = "",
}: CustomDropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);
	const selectedOption = sections
		.flatMap((section) => section.options)
		.find((option) => option.value === value);

	useEffect(() => {
		const handlePointerDown = (event: PointerEvent) => {
			if (!rootRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("pointerdown", handlePointerDown);

		return () => document.removeEventListener("pointerdown", handlePointerDown);
	}, []);

	return (
		<div ref={rootRef} className={`relative min-w-0 ${className}`}>
			<button
				type="button"
				onClick={() => setIsOpen((current) => !current)}
				className="flex h-11 w-full items-center justify-between gap-3 rounded-lg border border-(--line) bg-(--surface) px-3 text-left text-sm shadow-sm transition hover:bg-(--surface-strong)"
				aria-haspopup="listbox"
				aria-expanded={isOpen}
			>
				<span className="min-w-0">
					<span className="block text-[11px] font-semibold uppercase text-muted-foreground">
						{label}
					</span>
					<span className="block truncate font-medium text-foreground">
						{selectedOption?.label ?? "Select"}
					</span>
				</span>
				<ChevronDown
					size={17}
					className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
				/>
			</button>

			{isOpen && (
				<div
					role="listbox"
					className="absolute right-0 z-30 mt-2 w-full min-w-56 overflow-hidden rounded-lg border border-(--line) bg-(--surface-strong) p-2 shadow-xl backdrop-blur"
				>
					{sections.map((section, sectionIndex) => (
						<div
							key={section.title ?? `section-${sectionIndex}`}
							className={sectionIndex > 0 ? "border-t border-(--line) pt-2" : ""}
						>
							{section.title && (
								<div className="px-2 pb-1 text-[11px] font-semibold uppercase text-muted-foreground">
									{section.title}
								</div>
							)}
							<div className="space-y-1 pb-2">
								{section.options.map((option) => {
									const isSelected = option.value === value;

									return (
										<button
											key={option.value}
											type="button"
											role="option"
											aria-selected={isSelected}
											onClick={() => {
												onChange(option.value);
												setIsOpen(false);
											}}
											className="flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-sm transition hover:bg-primary/10"
										>
											<span className="truncate">{option.label}</span>
											{isSelected && <Check size={16} className="text-primary" />}
										</button>
									);
								})}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
