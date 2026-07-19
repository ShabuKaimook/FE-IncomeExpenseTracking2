import { Link } from "@tanstack/react-router";
import { ArrowLeft, Home } from "lucide-react";

export function NotFoundPage() {
  return (
    <section className="flex min-h-[55vh] items-center justify-center">
      <div className="island-shell flex w-full max-w-xl flex-col items-center rounded-xl p-6 text-center sm:p-8">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Home size={22} />
        </div>
        <p className="island-kicker mb-2">404</p>
        <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          This page is not part of Tang Hai, or the link may have moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground no-underline shadow-sm transition hover:opacity-90"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </section>
  );
}
