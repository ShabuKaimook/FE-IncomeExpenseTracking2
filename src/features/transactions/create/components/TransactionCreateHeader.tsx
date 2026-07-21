export interface TransactionCreateHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const TransactionCreateHeader = ({ icon, title, description }: TransactionCreateHeaderProps) => {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
        {icon}
      </div>
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};
