import { ChartBarStacked } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import {
  type DatePickerRange,
  DateRangeWithShowDisabledNavigation,
} from "@/shared/components/DatePicker";
import CustomSegmentedControl from "@/shared/components/CustomSegmentedControl";
import { TRANSACTION_TYPE } from "@/shared/constants/TransactionTypeEnum";
import { dateToString, getMonthDateRange } from "@/shared/utils/date";
import type { GetUserTransactionCategoryAmountsRequest } from "./api/UserTransactionCategoryRequest";
import type { UserTransactionCategoryAmountResponse } from "./api/UserTransactionCategoryResponse";
import { useCreateUserTransactionCategory } from "./hooks/useCreateUserTransactionCategory";
import { useDeleteUserTransactionCategory } from "./hooks/useDeleteUserTransactionCategory";
import { useUpdateUserTransactionCategory } from "./hooks/useUpdateUserTransactionCategory";
import { useUserTransactionCategoryAmounts } from "./hooks/useUserTransactionCategoryAmounts";
import { NewCategoryDialog } from "./components/NewCategoryDialog";
import { CategoryCard } from "./components/CategoryCard";
import {
  CategorySortByDropdown,
  type CategorySortBy,
  type CategorySortDirection,
} from "./components/CategorySortByDropdown";

type CategoryTransactionType = "income" | "expense";

const transactionTypeOptions = [
  { label: "Income", value: "income" },
  { label: "Expense", value: "expense" },
] as const;

const sortOptions = [
  { title: "Amount", value: "amount" },
  { title: "Name", value: "name" },
] as const;

const getTransactionTypeId = (type: CategoryTransactionType) =>
  type === "income" ? TRANSACTION_TYPE.INCOME.id : TRANSACTION_TYPE.EXPENSE.id;

const getSortRequest = (
  sortBy: CategorySortBy,
  direction: CategorySortDirection,
) => {
  if (!sortBy) return undefined;

  return {
    field: sortBy,
    direction,
  } as const;
};

export default function CategoryPage() {
  const initialRange = getMonthDateRange(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState<DatePickerRange>({
    mode: "month",
    startDate: initialRange.startDate,
    endDate: initialRange.endDate,
  });
  const [transactionType, setTransactionType] =
    useState<CategoryTransactionType>("expense");
  const [sortBy, setSortBy] = useState<CategorySortBy>(null);
  const [sortDirection, setSortDirection] =
    useState<CategorySortDirection>("desc");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] =
    useState<UserTransactionCategoryAmountResponse | null>(null);
  const createCategory = useCreateUserTransactionCategory();
  const updateCategory = useUpdateUserTransactionCategory();
  const deleteCategory = useDeleteUserTransactionCategory();

  const request = useMemo<GetUserTransactionCategoryAmountsRequest>(() => {
    const orderBy = getSortRequest(sortBy, sortDirection);

    return {
      transaction_type_id: getTransactionTypeId(transactionType),
      ...(dateRange.startDate
        ? { start_date: dateToString(dateRange.startDate) }
        : {}),
      ...(dateRange.endDate
        ? { end_date: dateToString(dateRange.endDate) }
        : {}),
      ...(orderBy ? { order_by: orderBy } : {}),
    };
  }, [
    dateRange.endDate,
    dateRange.startDate,
    sortBy,
    sortDirection,
    transactionType,
  ]);
  const { categories, isLoading } = useUserTransactionCategoryAmounts(request);
  const selectedSortTitle =
    sortOptions.find((option) => option.value === sortBy)?.title ?? "None";

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = categoryName.trim();
    if (!name) return;

    if (editingCategory) {
      updateCategory.mutate(
        {
          userTransactionCategoryId:
            editingCategory.user_transaction_category_id,
          body: { transaction_category_name: name },
        },
        {
          onSuccess: () => {
            setCategoryName("");
            setEditingCategory(null);
            setIsCreateOpen(false);
            toast.success("Category updated.");
          },
          onError: () => toast.error("Unable to update category."),
        },
      );
      return;
    }

    createCategory.mutate(
      {
        transaction_category_name: name,
        transaction_type_id: getTransactionTypeId(transactionType),
      },
      {
        onSuccess: () => {
          setCategoryName("");
          setIsCreateOpen(false);
          toast.success("Category created.");
        },
        onError: () => toast.error("Unable to create category."),
      },
    );
  };

  return (
    <div className="relative flex flex-col gap-4">
      <section className="z-30 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <DateRangeWithShowDisabledNavigation
          value={selectedDate}
          onChange={(date) => date && setSelectedDate(date)}
          onRangeChange={setDateRange}
          className="lg:w-72"
        />

        <NewCategoryDialog
          isCreateOpen={isCreateOpen}
          setIsCreateOpen={setIsCreateOpen}
          editingCategory={editingCategory}
          setEditingCategory={setEditingCategory}
          categoryName={categoryName}
          setCategoryName={setCategoryName}
          transactionType={transactionType}
          handleCreate={handleCreate}
          createCategory={createCategory}
          updateCategory={updateCategory}
        />
      </section>

      <section className="rounded-xl border border-(--line) bg-popover p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CustomSegmentedControl
            ariaLabel="Transaction type"
            className="w-full sm:w-auto"
            value={transactionType}
            options={transactionTypeOptions}
            onValueChange={setTransactionType}
          />

          <CategorySortByDropdown
            sortBy={sortBy}
            setSortBy={setSortBy}
            direction={sortDirection}
            setDirection={setSortDirection}
            selectedSortTitle={selectedSortTitle}
          />
        </div>

        <div className="mt-5 flex items-center gap-2 border-b border-(--line) pb-3">
          <ChartBarStacked size={17} className="text-primary" />
          <h1 className="text-lg font-semibold text-foreground">
            {transactionType === "income" ? "Income" : "Expense"} categories
          </h1>
          <span className="ml-auto text-sm text-muted-foreground">
            {categories.length} items
          </span>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
              Loading categories...
            </p>
          ) : categories.length === 0 ? (
            <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
              No {transactionType} categories yet.
            </p>
          ) : (
            categories.map((category) => (
              <CategoryCard
                key={category.user_transaction_category_id}
                category={category}
                isDeletePending={deleteCategory.isPending}
                onEdit={(selectedCategory) => {
                  setEditingCategory(selectedCategory);
                  setCategoryName(
                    selectedCategory.user_transaction_category_name,
                  );
                  setIsCreateOpen(true);
                }}
                onDelete={(selectedCategory) => {
                  deleteCategory.mutate(
                    {
                      user_transaction_category_id:
                        selectedCategory.user_transaction_category_id,
                    },
                    {
                      onSuccess: () => toast.success("Category deleted."),
                      onError: () => toast.error("Unable to delete category."),
                    },
                  );
                }}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
