import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeft,
	Camera,
	Loader2,
	PiggyBank,
	ReceiptText,
	RefreshCcw,
} from "lucide-react";
import { Form } from "radix-ui";
import type { ChangeEventHandler, FormEventHandler } from "react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import type { CreateTransactionRequest } from "@/features/transactions/api/TransactionRequest";
import { TransactionService } from "@/features/transactions/api/TransactionService";
import { useCreateTransaction } from "@/features/transactions/hooks/useCreateTransaction";
import { useUserTransactionCategories } from "@/features/userTransactionCategories/hooks/useUserTransactionCategories";
import { CustomSegmentedControl } from "@/shared/components/CustomSegmentedControl";
import { DateRangeWithShowDisabledNavigation } from "@/shared/components/DatePicker";
import { DropDown } from "@/shared/components/DropDown";
import { TRANSACTION_TYPE } from "@/shared/constants/TransactionTypeEnum";
import { dateToString, stringToDate } from "@/shared/utils/date";
import { cn } from "@/shared/utils/Utils";
import { TransactionCreateHeader } from "./components/TransactionCreateHeader";
import { TransactionCreateImagePreview } from "./components/TransactionCreateImagePreview";

type FormState = {
	amount: string;
	currencyCode: "THB" | "USD";
	description: string;
	date: string;
	userTransactionCategoryId: string;
};

const emptyForm = (): FormState => ({
	amount: "",
	currencyCode: "THB",
	description: "",
	date: dateToString(new Date()),
	userTransactionCategoryId: "",
});

const getInitialMode = () =>
	typeof window === "undefined"
		? "manual"
		: (new URLSearchParams(window.location.search).get("mode") ?? "manual");

const fieldClassName =
	"h-11 w-full rounded-lg border border-(--line) bg-(--surface) px-3 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground/40 focus:border-primary/50 focus:ring-2 focus:ring-primary/15";

const labelClassName = "text-xs font-bold uppercase text-muted-foreground";
const fieldHeaderClassName = "flex items-baseline justify-between gap-3";
const messageClassName = "text-right text-xs font-semibold text-destructive";

export default function TransactionCreatePage() {
	const navigate = useNavigate();
	const [mode, setMode] = useState(getInitialMode);
	const [form, setForm] = useState<FormState>(emptyForm);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
	const { categories, isLoading: isCategoryLoading } =
		useUserTransactionCategories();
	const createTransaction = useCreateTransaction();
	const draftFromImage = useMutation({
		mutationFn: (file: File) =>
			TransactionService.createTransactionDraftFromImage(file),
		onSuccess: (response) => {
			setForm({
				amount: String(response.draft.amount),
				currencyCode: response.draft.currency_code === "USD" ? "USD" : "THB",
				description: response.draft.description,
				date: response.draft.date,
				userTransactionCategoryId: response.draft.user_transaction_category_id,
			});
			toast.success("Image scanned. Review the draft before saving.");
		},
		onError: () => {
			toast.error("Unable to create transaction draft from image.");
		},
	});

	const categoryOptions = useMemo(
		() =>
			categories.map((category) => ({
				id: category.user_transaction_category_id,
				name: category.user_transaction_category_name,
				typeId: category.transaction_type_id,
			})),
		[categories],
	);

	useEffect(() => {
		return () => {
			if (imagePreviewUrl) {
				URL.revokeObjectURL(imagePreviewUrl);
			}
		};
	}, [imagePreviewUrl]);

	const updateForm = <TKey extends keyof FormState>(
		key: TKey,
		value: FormState[TKey],
	) => {
		setForm((current) => ({
			...current,
			[key]: value,
		}));
	};

	const handleImageChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const file = event.target.files?.[0] ?? null;
		setSelectedImage(file);

		if (imagePreviewUrl) {
			URL.revokeObjectURL(imagePreviewUrl);
		}

		setImagePreviewUrl(file ? URL.createObjectURL(file) : null);
	};

	const handleClearImage = () => {
		setSelectedImage(null);

		if (imagePreviewUrl) {
			URL.revokeObjectURL(imagePreviewUrl);
		}

		setImagePreviewUrl(null);
	};

	const handleScanImage = () => {
		if (!selectedImage) {
			toast.error("Choose an image first.");
			return;
		}

		draftFromImage.mutate(selectedImage);
	};

	const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();

		const amount = Number(form.amount);
		if (!Number.isFinite(amount) || amount <= 0) {
			toast.error("Amount must be more than 0.");
			return;
		}

		if (!form.userTransactionCategoryId) {
			toast.error("Choose a transaction category.");
			return;
		}

		const payload: CreateTransactionRequest = {
			amount,
			currency_code: form.currencyCode,
			description: form.description.trim(),
			date: form.date,
			user_transaction_category_id: form.userTransactionCategoryId,
		};

		createTransaction.mutate(payload, {
			onSuccess: () => {
				toast.success("Transaction created.");
				navigate({ to: "/transaction" });
			},
			onError: () => {
				toast.error("Unable to create transaction.");
			},
		});
	};

	const isImageMode = mode === "image";

	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
			{/* NAV SECTION (BACK BUTTON, MANUAL/IMAGE BUTTON) */}
			<div className="flex items-center justify-between gap-3">
				<Link
					to="/transaction"
					className="inline-flex h-10 items-center gap-2 rounded-lg border border-(--line) bg-(--surface) px-3 text-sm font-semibold text-foreground transition hover:bg-(--surface-strong)"
				>
					<ArrowLeft size={16} />
					Back
				</Link>

				<CustomSegmentedControl
					ariaLabel="Create Transaction Mode"
					value={isImageMode ? "image" : "manual"}
					options={[
						{ label: "Manual", value: "manual" },
						{ label: "Image", value: "image" },
					]}
					onValueChange={(value) => setMode(value as "image" | "manual")}
				/>
			</div>

			<section className="rounded-xl border border-(--line) bg-(--surface) p-5 shadow-sm">
				<TransactionCreateHeader
					icon={isImageMode ? <Camera size={20} /> : <ReceiptText size={20} />}
					title={isImageMode ? "Add by image" : "Manual add"}
					description={
						isImageMode
							? "Scan a receipt image, review the draft, then save."
							: "Fill the transaction details and save."
					}
				/>

				<div
					className={cn(
						"grid gap-5",
						isImageMode && "lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]",
					)}
				>
					{isImageMode && (
						<TransactionCreateImagePreview
							imagePreviewUrl={imagePreviewUrl}
							isScanning={draftFromImage.isPending}
							onClearImage={handleClearImage}
							onImageChange={handleImageChange}
							onScanImage={handleScanImage}
							selectedImage={selectedImage}
						/>
					)}

					<Form.Root onSubmit={handleSubmit} className="grid gap-4">
						<div className="grid gap-4 sm:grid-cols-2">
							{/* AMOUNT FIELD */}
							<Form.Field name="amount" className="grid gap-1.5">
								<div className={fieldHeaderClassName}>
									<Form.Label className={labelClassName}>
										Amount<span className="text-destructive">*</span>
									</Form.Label>
									<Form.Message
										className={messageClassName}
										match="valueMissing"
									>
										Please enter amount
									</Form.Message>
									<Form.Message
										className={messageClassName}
										match="rangeUnderflow"
									>
										Amount must be more than 0
									</Form.Message>
								</div>
								<Form.Control asChild>
									<input
										type="number"
										inputMode="decimal"
										min="0.01"
										step="0.01"
										value={form.amount}
										onChange={(event) =>
											updateForm("amount", event.target.value)
										}
										placeholder="00.00"
										className={fieldClassName}
										required
									/>
								</Form.Control>
							</Form.Field>

							{/* CURRENCY FIELD */}
							<Form.Field name="currency_code" className="grid gap-1.5">
								<div className={fieldHeaderClassName}>
									<Form.Label className={labelClassName}>
										Currency<span className="text-destructive">*</span>
									</Form.Label>
									<Form.Message
										className={messageClassName}
										match="valueMissing"
									>
										Please choose currency
									</Form.Message>
								</div>
								<Form.Control asChild>
									<select
										value={form.currencyCode}
										onChange={(event) =>
											updateForm(
												"currencyCode",
												event.target.value === "USD" ? "USD" : "THB",
											)
										}
										className={fieldClassName}
										required
									>
										<option value="THB">THB</option>
										<option value="USD">USD</option>
									</select>
								</Form.Control>
							</Form.Field>
						</div>

						{/* DESCRIPTION FIELD */}
						<Form.Field name="description" className="grid gap-1.5">
							<div className={fieldHeaderClassName}>
								<Form.Label className={labelClassName}>
									Description<span className="text-destructive">*</span>
								</Form.Label>
								<Form.Message className={messageClassName} match="valueMissing">
									Please enter description
								</Form.Message>
							</div>
							<Form.Control asChild>
								<input
									type="text"
									value={form.description}
									onChange={(event) =>
										updateForm("description", event.target.value)
									}
									placeholder="Write a description..."
									className={fieldClassName}
									required
								/>
							</Form.Control>
						</Form.Field>

						<div className="grid gap-4 sm:grid-cols-2">
							{/* DATE PICKER FIELD */}
							<Form.Field name="date" className="grid gap-1.5">
								<div className={fieldHeaderClassName}>
									<Form.Label className={labelClassName}>
										Date<span className="text-destructive">*</span>
									</Form.Label>
									<Form.Message
										className={messageClassName}
										match="valueMissing"
									>
										Please choose date
									</Form.Message>
								</div>
								<DateRangeWithShowDisabledNavigation
									mode="single"
									value={form.date ? stringToDate(form.date) : new Date()}
									onChange={(date) => {
										if (date) {
											updateForm("date", dateToString(date));
										}
									}}
									className="h-11 w-full sm:w-full"
								/>
							</Form.Field>

							{/* CATEGORY FIELD */}
							<Form.Field
								name="user_transaction_category_id"
								className="grid gap-1.5"
							>
								<div className={fieldHeaderClassName}>
									<Form.Label className={labelClassName}>
										Category<span className="text-destructive">*</span>
									</Form.Label>
									<Form.Message
										className={messageClassName}
										match="valueMissing"
									>
										Please choose category
									</Form.Message>
								</div>
								<DropDown
									isShowTriggerLabel={false}
									triggerAriaLabel="Choose category"
									placeholder={
										isCategoryLoading ? "Loading categories" : "Choose category"
									}
									sections={[
										{
											sectionType: "static",
											sectionName: "Income",
											className: "max-h-49.5 overflow-y-auto pr-1",
											items: categoryOptions
												.filter(
													(category) =>
														category.typeId === TRANSACTION_TYPE.INCOME.id,
												)
												.map((category) => ({
													value: category.id,
													title: category.name,
												})),
										},
										{
											sectionType: "static",
											sectionName: "Expense",
											className: "max-h-49.5 overflow-y-auto pr-1",
											items: categoryOptions
												.filter(
													(category) =>
														category.typeId === TRANSACTION_TYPE.EXPENSE.id,
												)
												.map((category) => ({
													value: category.id,
													title: category.name,
												})),
										},
									]}
									selectedValues={[form.userTransactionCategoryId]}
									onItemSelect={({ item }) => {
										updateForm("userTransactionCategoryId", item.value);
									}}
								/>
							</Form.Field>
						</div>

						<div className="flex gap-3 pt-2 flex-row-reverse sm:flex-row justify-end">
							<button
								type="button"
								onClick={() => {
									setForm(emptyForm());
								}}
								className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-(--line) px-4 text-sm font-semibold text-foreground transition hover:bg-(--surface-strong) w-full sm:w-auto"
							>
								<RefreshCcw size={15} />
								Reset
							</button>
							<Form.Submit asChild>
								<button
									type="submit"
									disabled={createTransaction.isPending}
									className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 w-full sm:w-auto"
								>
									{createTransaction.isPending ? (
										<Loader2 size={17} className="animate-spin" />
									) : (
										<PiggyBank size={17} />
									)}
									Save
								</button>
							</Form.Submit>
						</div>
					</Form.Root>
				</div>
			</section>
		</div>
	);
}
