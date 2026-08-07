import { Link } from "@tanstack/react-router";
import { Bell, Download, Save } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { DashboardCard } from "@/shared/components/DashboardCard";
import { formatMoney } from "@/shared/utils/FormatMoney";
import type {
	IncomeByTypeResponse,
	TaxEstimateResponse,
} from "./api/TaxResponse";
import {
	useIncomeByType,
	useSaveTaxDeductions,
	useTaxDeductions,
	useTaxEstimate,
} from "./hooks/useTax";

const deductionFields = [
	{ key: "personal", label: "Personal" },
	{ key: "spouse", label: "Spouse" },
	{ key: "children", label: "Children" },
	{ key: "social_security", label: "Social security" },
	{ key: "life_health_insurance", label: "Life / health insurance" },
	{ key: "retirement_funds", label: "RMF / SSF / Thai ESG" },
	{ key: "home_loan_interest", label: "Home loan interest" },
] as const;

type DeductionValues = Record<(typeof deductionFields)[number]["key"], number>;

const emptyDeductions = {} as DeductionValues;
for (const field of deductionFields) {
	emptyDeductions[field.key] = 0;
}

function IncomeByTypeSummary({
	income,
	isLoading,
}: {
	income: IncomeByTypeResponse[];
	isLoading: boolean;
}) {
	return (
		<DashboardCard
			header={{ title: "Income by Type" }}
			rightSide={
				<Link className="text-sm text-primary" to="/transaction">
					Edit tags
				</Link>
			}
		>
			<div className="w-full divide-y divide-(--line)">
				{isLoading ? (
					<p className="py-6 text-sm text-muted-foreground">Loading...</p>
				) : income.length === 0 ? (
					<p className="py-6 text-sm text-muted-foreground">
						No tagged income found.
					</p>
				) : (
					income.map((item) => (
						<div
							key={item.tax_type}
							className="flex items-center justify-between gap-3 py-2 text-sm"
						>
							<span className="min-w-0 truncate text-foreground">
								{item.tax_type_name}
							</span>
							<span className="shrink-0 font-medium text-foreground">
								{formatMoney(item.total_income, "THB")}
							</span>
						</div>
					))
				)}
			</div>
		</DashboardCard>
	);
}

function DeductionForm({
	isSaving,
	onSave,
	setValues,
	values,
}: {
	isSaving: boolean;
	onSave: () => void;
	setValues: (values: DeductionValues) => void;
	values: DeductionValues;
}) {
	const total = useMemo(
		() => Object.values(values).reduce((sum, value) => sum + value, 0),
		[values],
	);

	const submit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSave();
	};

	return (
		<DashboardCard header={{ title: "Deductions" }}>
			<form className="grid w-full gap-3 sm:grid-cols-2" onSubmit={submit}>
				{deductionFields.map((field) => (
					<label key={field.key} className="flex flex-col gap-1 text-sm">
						<span className="text-muted-foreground">{field.label}</span>
						<input
							className="h-10 rounded-lg border border-(--line) bg-popover px-3 text-foreground focus:outline-primary"
							min={0}
							type="number"
							value={values[field.key]}
							onChange={(event) =>
								setValues({
									...values,
									[field.key]: Number(event.target.value) || 0,
								})
							}
						/>
					</label>
				))}

				<div className="flex items-center justify-between gap-3 sm:col-span-2">
					<span className="text-sm text-muted-foreground">
						Total {formatMoney(total, "THB")}
					</span>
					<button
						className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"
						disabled={isSaving}
						type="submit"
					>
						<Save size={16} />
						{isSaving ? "Saving..." : "Save"}
					</button>
				</div>
			</form>
		</DashboardCard>
	);
}

function TaxBreakdown({ estimate }: { estimate?: TaxEstimateResponse }) {
	const rows = estimate
		? [
				["Gross income", estimate.gross_income],
				["Expense deduction", -estimate.expense_total],
				["Personal deductions", -estimate.deduction_total],
				["Net income", estimate.net_income],
				["Tax due", estimate.tax_due],
			]
		: [];

	return (
		<DashboardCard header={{ title: "Tax Breakdown" }}>
			{rows.length === 0 ? (
				<p className="py-6 text-sm text-muted-foreground">
					Save deductions, then calculate an estimate.
				</p>
			) : (
				<div className="w-full divide-y divide-(--line)">
					{rows.map(([label, value]) => (
						<div
							key={label}
							className="flex items-center justify-between gap-3 py-2 text-sm"
						>
							<span className="text-muted-foreground">{label}</span>
							<span className="font-medium text-foreground">
								{formatMoney(Number(value), "THB")}
							</span>
						</div>
					))}
				</div>
			)}
		</DashboardCard>
	);
}

function TaxBracketTable({ estimate }: { estimate?: TaxEstimateResponse }) {
	return (
		<DashboardCard header={{ title: "Tax Brackets" }}>
			<div className="w-full overflow-x-auto">
				<table className="w-full text-left text-sm">
					<thead className="text-muted-foreground">
						<tr>
							<th className="py-2 pr-4">Range</th>
							<th className="py-2 pr-4">Rate</th>
							<th className="py-2 text-right">Tax</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-(--line)">
						{estimate?.brackets?.length ? (
							estimate.brackets.map((bracket) => (
								<tr key={`${bracket.range_start}-${bracket.range_end}`}>
									<td className="py-2 pr-4 text-foreground">
										{formatMoney(bracket.range_start, "THB")} -{" "}
										{bracket.range_end
											? formatMoney(bracket.range_end, "THB")
											: "Up"}
									</td>
									<td className="py-2 pr-4 text-muted-foreground">
										{bracket.rate}%
									</td>
									<td className="py-2 text-right font-medium text-foreground">
										{formatMoney(bracket.tax, "THB")}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td className="py-6 text-muted-foreground" colSpan={3}>
									No estimate yet.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</DashboardCard>
	);
}

export default function TaxPage() {
	const { incomeByType, isLoading: isIncomeLoading } = useIncomeByType();
	const { deductions } = useTaxDeductions();
	const saveDeductions = useSaveTaxDeductions();
	const estimateTax = useTaxEstimate();
	const [values, setValues] = useState<DeductionValues>(emptyDeductions);

	useEffect(() => {
		setValues({ ...emptyDeductions, ...deductions });
	}, [deductions]);

	const save = () => {
		saveDeductions.mutate(values, {
			onError: () => toast.error("Unable to save deductions."),
			onSuccess: () => toast.success("Deductions saved."),
		});
	};

	const estimate = () => {
		estimateTax.mutate(
			{ deductions: values },
			{ onError: () => toast.error("Unable to calculate tax estimate.") },
		);
	};

	return (
		<div className="flex flex-col gap-4">
			<section className="rounded-xl border border-(--line) bg-popover p-4 shadow-sm">
				<h1 className="text-xl font-semibold text-foreground">Tax</h1>
				<p className="text-sm text-muted-foreground">
					Estimate only. Confirm final filing numbers before submitting.
				</p>
			</section>

			<section className="grid gap-3 lg:grid-cols-2">
				<IncomeByTypeSummary
					income={incomeByType}
					isLoading={isIncomeLoading}
				/>
				<DeductionForm
					isSaving={saveDeductions.isPending}
					onSave={save}
					setValues={setValues}
					values={values}
				/>
			</section>

			<section className="flex flex-col gap-3">
				<div className="flex justify-end gap-2">
					<button
						className="inline-flex h-10 items-center gap-2 rounded-lg border border-(--line) px-4 text-sm text-muted-foreground"
						type="button"
					>
						<Download size={16} />
						Export
					</button>
					<button
						className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"
						disabled={estimateTax.isPending}
						type="button"
						onClick={estimate}
					>
						{estimateTax.isPending ? "Calculating..." : "Calculate"}
					</button>
				</div>
				<div className="grid gap-3 lg:grid-cols-2">
					<TaxBreakdown estimate={estimateTax.data} />
					<TaxBracketTable estimate={estimateTax.data} />
				</div>
			</section>

			<section className="flex items-start gap-3 rounded-xl border border-(--line) bg-popover p-4 text-sm text-muted-foreground shadow-sm">
				<Bell size={18} className="mt-0.5 shrink-0 text-primary" />
				<p>
					Thai personal income tax filing is usually due around March to April.
					This page is an estimate, not tax advice.
				</p>
			</section>
		</div>
	);
}
