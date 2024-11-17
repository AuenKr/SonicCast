"use client";
import { useEffect, useState } from "react";
import { days, months } from "./config";

export default function TimeBox() {
  const [time, setTime] = useState<Date>();

  useEffect(() => {
    const x = setInterval(() => {
      const time = new Date();
      setTime(time);
    }, 1000);
    return () => clearInterval(x);
  }, []);

  if (!time) return;

  return (
    <div className="flex justify-center items-center gap-2 text-slate-800 dark:text-slate-200 font-normal text-center">
      <span>{`${time.getHours() < 10 ? "0" + time.getHours() : time.getHours()}:${time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()},`}</span>
      <span>{`${days[time.getDay()]} ${time.getDate()} ${months[time.getMonth()]}`}</span>
    </div>
  );
}
