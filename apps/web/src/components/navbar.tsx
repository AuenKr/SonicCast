import { ThemeModeToggle } from "./themeToggleBtn";
import TimeBox from "./timeBox";

export default function Navbar() {
  return (
    <div className="w-full max-w-4xl flex justify-between items-center">
      <div className="flex text-lg justify-center">
        <span className="px-2 font-extrabold">{"((o))"}</span>
      </div>
      <div className="text-lg font-bold">
        <TimeBox />
      </div>
      <div>
        <ThemeModeToggle />
      </div>
    </div>
  );
}
