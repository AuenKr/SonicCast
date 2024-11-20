import { userAtom } from "@/state/atom/userAtom";
import { useAtom } from "jotai";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function useUser() {
  const [user, setUser] = useAtom(userAtom);
  const pathName = usePathname();

  useEffect(() => {
    if (!user) {
      const pathData = pathName.split('/');
      if (pathData.length === 3) {
        setUser({
          roomId: pathData[1],
          userType: pathData[2] === "admin" ? "admin" : "user",
        })
      }
    }
  }, []);
  return user;
}