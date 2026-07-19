import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { GlobalToast } from "@/shared/components/GlobalToast";
import Navbar from "@/shared/components/Navbar";
import { NotFoundPage } from "@/shared/components/NotFoundPage";
import { queryClient } from "../integrations/tanstack-query/root-provider";
import appCss from "../styles.css?url";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Tang Hai",
      },
      {
        name: "description",
        content:
          "Tracking you money and your time, so you can focus on what matters.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/png",
        href: "/logo-no-text.png",
      },
    ],
  }),
  notFoundComponent: NotFoundPage,
  shellComponent: RootDocument,
});

const NAVBAR_HEIGHT = 72;

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Theme>
          <GlobalToast />
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <div id="root-layout" className="p-4">
                <header>
                  <div className="frame relative mb-4">
                    <Navbar navbarHeight={NAVBAR_HEIGHT} />
                  </div>
                </header>

                <main>
                  <div className="frame">{children}</div>
                </main>

                {/* background */}
                <div
                  aria-hidden
                  className="pointer-events-none fixed inset-0 -z-2 overflow-hidden"
                >
                  <div className="absolute -left-32 -top-32 size-120 rounded-full bg-emerald-400/20 blur-3xl" />
                  <div className="absolute -right-24 top-24 size-90 rounded-full bg-sky-400/20 blur-3xl" />
                  <div className="absolute bottom-0 left-1/2 size-105 -translate-x-1/2 rounded-full bg-violet-400/15 blur-3xl" />
                </div>
              </div>
            </QueryClientProvider>
          </AuthProvider>
        </Theme>
        <Scripts />
      </body>
    </html>
  );
}
