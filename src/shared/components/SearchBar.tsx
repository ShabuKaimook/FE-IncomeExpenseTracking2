import { Search } from "lucide-react";
import type { ChangeEventHandler, FormEventHandler } from "react";
import { useId } from "react";
import { cn } from "@/shared/utils/Utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  label?: string;
  className?: string;
  inputClassName?: string;
  buttonLabel?: string;
}

export const SearchBar = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search",
  label = "Search",
  className,
  inputClassName,
  buttonLabel,
}: SearchBarProps) => {
  const inputId = useId();
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange(event.target.value);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex h-11 min-w-0 items-center gap-2 rounded-lg border border-(--line) bg-(--surface-strong) px-3 text-sm transition focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15",
        className,
      )}
    >
      <label className="sr-only" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          "w-full min-w-0 bg-transparent outline-none placeholder:text-muted-foreground",
          inputClassName,
        )}
      />
      {buttonLabel ? (
        <button
          type="submit"
          className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {buttonLabel}
        </button>
      ) : (
        <button
          type="submit"
          className="h-full pl-2.5 flex items-center justify-center border-l border-(--line) cursor-pointer"
        >
          <Search size={17} className="shrink-0 text-muted-foreground" />
        </button>
      )}
    </form>
  );
};
