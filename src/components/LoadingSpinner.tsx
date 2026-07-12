import { LoaderCircle } from "lucide-react";

interface LoadingSpinnerProps {
	className?: string;
	label?: string;
	size?: number;
}

export const LoadingSpinner = ({
	className = "",
	label = "Loading",
	size = 20,
}: LoadingSpinnerProps) => (
	<output
		aria-label={label}
		className={`inline-flex items-center justify-center text-current ${className}`}
	>
		<LoaderCircle
			aria-hidden="true"
			className="animate-spin"
			size={size}
			strokeWidth={2.5}
		/>
		<span className="sr-only">{label}</span>
	</output>
);
