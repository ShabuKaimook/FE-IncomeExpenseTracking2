import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import ClerkProvider from "../integrations/clerk/provider";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";
import Navbar from "#/components/Navbar";
import { useState } from "react";
import { Sidebar } from "#/components/Sidebar";

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
  shellComponent: RootDocument,
});

const NAVBAR_HEIGHT = 72;

function RootDocument({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ClerkProvider>
          <div id="root-layout" className="p-4">
            <header>
              <div className="frame relative">
                <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} navbarHeight={NAVBAR_HEIGHT} />
                <Sidebar
                  isOpen={isMenuOpen}
                  navbarHeight={NAVBAR_HEIGHT}
                />
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

          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  );
}
