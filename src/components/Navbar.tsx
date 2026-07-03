// Navbar.tsx
import { Link } from "@tanstack/react-router";
import { ChevronUp } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
  navbarHeight?: number;
}

const Navbar = ({ isMenuOpen, setIsMenuOpen, navbarHeight }: NavbarProps) => {
  return (
    <nav
      className={`flex items-center justify-between pb-4 ${navbarHeight ? `h-[${navbarHeight}px]` : ""}`}
    >
      <div className="flex items-center gap-2">
        <Link to="/">
          <img
            src="/logo-no-text.png"
            alt="Logo"
            className="h-8 w-8 rounded-full"
          />
        </Link>
        <span className="text-3xl font-bold">Home</span>
      </div>

      <div
        className="cursor-pointer"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <ChevronUp
          className={`transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "-rotate-180" : "rotate-0"
          }`}
        />
      </div>
    </nav>
  );
};

export default Navbar;
