import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import { DropDown } from "@/shared/components/DropDown";
import { formatMoney } from "@/shared/utils/FormatMoney";
import type { UserTransactionCategoryAmountResponse } from "../api/UserTransactionCategoryResponse";

type CategoryCardProps = {
  category: UserTransactionCategoryAmountResponse;
  isDeletePending: boolean;
  onEdit: (category: UserTransactionCategoryAmountResponse) => void;
  onDelete: (category: UserTransactionCategoryAmountResponse) => void;
};

export const CategoryCard = ({
  category,
  isDeletePending,
  onEdit,
  onDelete,
}: CategoryCardProps) => {
  return (
    <article className="flex justify-between rounded-lg border border-(--line) bg-background/80 p-4 shadow-sm transition hover:border-primary">
      <div className="flex flex-col min-w-0 w-40">
        <span className="text-xs font uppercase text-muted-foreground">
          name
        </span>
        <p className="truncate text-sm font-bold text-foreground">
          {category.user_transaction_category_name}
        </p>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col min-w-0">
          <span className="text-xs font uppercase text-muted-foreground">
            amount
          </span>
          <span className="text-sm font-semibold text-foreground">
            {formatMoney(category.amount, "THB")}
          </span>
        </div>
        <DropDown
          triggerAriaLabel={`Open actions for ${category.user_transaction_category_name}`}
          triggerClassName="size-8 min-h-8 justify-center rounded-full border-none bg-transparent p-0 hover:bg-primary/10 focus-visible:ring-0"
          contentClassName="w-40"
          isShowTriggerLabel={false}
          sections={[
            {
              sectionType: "static",
              items: [
                {
                  icon: Pencil,
                  title: "Edit",
                  value: "edit",
                  disabled: !category.is_editable,
                },
                {
                  icon: Trash2,
                  title: "Delete",
                  value: "delete",
                  disabled: !category.is_deletable || isDeletePending,
                },
              ],
            },
          ]}
          onItemSelect={({ item }) => {
            if (item.value === "edit") onEdit(category);
            if (item.value === "delete") onDelete(category);
          }}
        >
          <ChevronDown
            size={17}
            className="shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 cursor-pointer"
          />
        </DropDown>
      </div>
    </article>
  );
};
