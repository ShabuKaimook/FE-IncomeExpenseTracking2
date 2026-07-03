// Sidebar.tsx
import { Link } from "@tanstack/react-router";
import {
  Home,
  Receipt,
  Tags,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { label: "Home", to: "/", icon: Home },
  { label: "Transaction", to: "/transaction", icon: Receipt },
  { label: "Category", to: "/category", icon: Tags },
  { label: "Analytic", to: "/analytic", icon: BarChart3 },
  { label: "Setting", to: "/setting", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  navbarHeight?: number;
}

export const Sidebar = ({ isOpen, navbarHeight }: SidebarProps) => {
  return (
    <>
      {/* Panel */}
      <aside
        className={`z-20 w-50 flex flex-col gap-1 border-r p-4 overflow-hidden transition-all duration-300 ease-in-out bg-background rounded-2xl border
          border-border absolute top-[${navbarHeight ?? 0}px] right-0 ${
            isOpen ? "" : "-translate-y-50 opacity-0 pointer-events-none"
          }`}
      >
        {navItems.map(({ label, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group relative flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground select-none"
            activeProps={{
              className: "text-foreground",
            }}
            activeOptions={{ exact: to === "/" }}
          >
            <Icon className="h-4 w-4" />
            {label}
            <span className="absolute bottom-1 left-3 right-3 h-px origin-left scale-x-0 bg-foreground transition-transform duration-300 ease-in-out group-hover:scale-x-100" />
          </Link>
        ))}
      </aside>
    </>
  );
};
