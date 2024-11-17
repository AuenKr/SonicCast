import { ThemeModeToggle } from "./themeToggleBtn";
import TimeBox from "./timeBox";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center">
      <div className="flex text-lg justify-center">
        <span className="px-2 animate-spin font-extrabold">{"((o))"}</span>
      </div>
      <div className="text-lg font-bold">
        <TimeBox />
      </div>
      <div>
        <ThemeModeToggle />
      </div>
    </nav>
  );
}
