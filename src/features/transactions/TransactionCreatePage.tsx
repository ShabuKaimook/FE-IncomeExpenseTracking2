import { Camera, ReceiptText } from "lucide-react";

export default function TransactionCreatePage() {
	const mode =
		typeof window === "undefined"
			? "manual"
			: new URLSearchParams(window.location.search).get("mode") ?? "manual";
	const isImageMode = mode === "image";

	return (
		<div className="rounded-xl border border-(--line) bg-(--surface) p-5 shadow-sm backdrop-blur">
			<div className="flex items-center gap-3">
				<div className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
					{isImageMode ? <Camera size={20} /> : <ReceiptText size={20} />}
				</div>
				<div>
					<h1 className="text-lg font-semibold text-foreground">
						{isImageMode ? "Add by image" : "Manual add"}
					</h1>
					<p className="text-sm text-muted-foreground">
						Transaction creation form will live here.
					</p>
				</div>
			</div>
		</div>
	);
}
