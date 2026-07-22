import { ImageUp, Loader2, Upload, X } from "lucide-react";
import type { ChangeEventHandler } from "react";

interface TransactionCreateImagePreviewProps {
	imagePreviewUrl: string | null;
	isScanning: boolean;
	onImageChange: ChangeEventHandler<HTMLInputElement>;
	onScanImage: () => void;
	selectedImage: File | null;
}

export const TransactionCreateImagePreview = ({
	imagePreviewUrl,
	isScanning,
	onImageChange,
	onScanImage,
	selectedImage,
}: TransactionCreateImagePreviewProps) => {
	return (
		<div className="flex flex-col gap-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4">
			<label
				htmlFor="transaction-image"
				className="relative flex min-h-52 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-(--line) bg-(--surface) p-4 text-center transition hover:border-primary/40 hover:bg-primary/5"
			>
				{imagePreviewUrl ? (
					<>
						<img
							src={imagePreviewUrl}
							alt="Selected transaction receipt"
							className="max-h-60 rounded-lg object-contain"
						/>
						<button
							type="button"
							className="absolute top-2 right-2 rounded-full bg-primary/10 p-1 text-primary transition hover:bg-primary/20"
							onClick={(e) => {
								e.stopPropagation();
								onImageChange({ target: { files: null } } as any);
							}}
						>
							<X size={17} />
						</button>
					</>
				) : (
					<>
						<div className="grid size-12 place-items-center rounded-full bg-primary/15 text-primary">
							<ImageUp size={22} />
						</div>
						<div>
							<p className="text-sm font-semibold text-foreground">
								Choose receipt image
							</p>
							<p className="text-xs text-muted-foreground">
								PNG, JPG, or image from camera roll
							</p>
						</div>
					</>
				)}
			</label>
			<input
				id="transaction-image"
				type="file"
				accept="image/*"
				className="sr-only"
				onChange={onImageChange}
			/>

			<button
				type="button"
				onClick={onScanImage}
				disabled={!selectedImage || isScanning}
				className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
			>
				{isScanning ? (
					<Loader2 size={17} className="animate-spin" />
				) : (
					<Upload size={17} />
				)}
				{isScanning ? "Scanning" : "Scan image"}
			</button>
		</div>
	);
};

export default TransactionCreateImagePreview;
