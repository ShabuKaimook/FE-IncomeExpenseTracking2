import { Dialog, TextField, Text } from "@radix-ui/themes";
import { Plus } from "lucide-react";

export interface NewCategoryDialogProps {
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
  editingCategory: any;
  setEditingCategory: (category: any) => void;
  categoryName: string;
  setCategoryName: (name: string) => void;
  transactionType: string;
  handleCreate: (event: React.FormEvent<HTMLFormElement>) => void;
  createCategory: { isPending: boolean };
  updateCategory: { isPending: boolean };
}

export const NewCategoryDialog = ({
  isCreateOpen,
  setIsCreateOpen,
  editingCategory,
  setEditingCategory,
  categoryName,
  setCategoryName,
  transactionType,
  handleCreate,
  createCategory,
  updateCategory,
}: NewCategoryDialogProps) => {
  return (
    <Dialog.Root open={isCreateOpen} onOpenChange={setIsCreateOpen}>
      <Dialog.Trigger
        onClick={() => {
          setEditingCategory(null);
          setCategoryName("");
        }}
      >
        <div
          className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition hover:opacity-90 sm:relative sm:bottom-auto sm:right-auto sm:h-10 sm:w-49 sm:gap-2 sm:rounded-lg sm:px-4"
          aria-label="Create category"
        >
          <Plus size={18} />
          <span className="hidden text-sm font-semibold sm:inline">
            New category
          </span>
        </div>
      </Dialog.Trigger>
      <Dialog.Content className="max-w-sm rounded-lg border border-(--line) bg-popover p-5 shadow-xl">
        <Dialog.Title className="text-base font-semibold text-foreground">
          {editingCategory ? "Edit" : "New"}{" "}
          {transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}{" "}
          Category
        </Dialog.Title>
        <form className="mt-4 flex flex-col gap-4" onSubmit={handleCreate}>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground ">
            <Text>
              Category name <span className="text-destructive">*</span>
            </Text>
            <TextField.Root
              placeholder="e.g. Travel"
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              className="h-10 rounded-lg border border-(--line) bg-background px-3 text-sm placeholder:text-muted-foreground/45 focus-within:outline-primary/40! focus-within:ring-0!"
            />
          </label>
          <div className="flex justify-end gap-2">
            <Dialog.Close>
              <button className="h-9 rounded-lg bg-popover px-3 text-sm font-semibold text-foreground/90 transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-50 border border-(--foreground/90) cursor-pointer">
                Cancel
              </button>
            </Dialog.Close>
            <Dialog.Close>
              <button
                type="submit"
                disabled={
                  createCategory.isPending ||
                  updateCategory.isPending ||
                  !categoryName.trim()
                }
                className="h-9 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
              >
                {editingCategory ? "Save" : "Create"}
              </button>
            </Dialog.Close>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
