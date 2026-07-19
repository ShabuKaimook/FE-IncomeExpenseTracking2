import { useState } from "react";
import { DropdownMenu } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import { Plus, ReceiptText, Image } from "lucide-react";

const NewTransactionButton = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  return (
    <DropdownMenu.Root open={isAddOpen} onOpenChange={setIsAddOpen}>
      <DropdownMenu.Trigger>
        <button
          type="button"
          aria-label="New transaction"
          className="group fixed bottom-5 right-5 sm:right-0 z-40 flex h-13 w-13 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-2 text-sm font-semibold text-primary-foreground shadow-sm transition duration-200 ease-out before:absolute before:inset-0 before:rounded-[inherit] before:bg-white/25 before:opacity-0 before:transition before:duration-300 hover:opacity-90 active:translate-y-0 active:before:opacity-100 sm:relative sm:top-0 sm:h-10 sm:w-52 sm:rounded-lg"
        >
          <Plus
            size={17}
            className={`relative z-10 transition duration-200 ${
              isAddOpen ? "rotate-225" : "group-hover:rotate-90"
            }`}
          />
          <p className="absolute hidden sm:inline sm:relative">
            New Transaction
          </p>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="py-1 z-10 w-42 bg-popover rounded-lg border border-(--line) shadow-md">
        <DropdownMenu.Item>
          <Link
            to="/transaction/create"
            className="flex items-center gap-2 rounded-md text-sm font-medium text-foreground transition hover:bg-primary/10 mb-1"
          >
            <ReceiptText size={16} />
            Manual add
          </Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <a
            href="/transaction/create?mode=image"
            className="flex items-center gap-2 rounded-md text-sm font-medium text-foreground transition hover:bg-primary/10"
          >
            <Image size={16} />
            Add by image
          </a>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default NewTransactionButton;