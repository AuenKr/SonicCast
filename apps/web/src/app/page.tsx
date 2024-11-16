import SignInBtn from "@/components/SignInBtn";
import { auth } from "@/lib/auth";

const wssUrl = process.env.NEXT_PUBLIC_WS_Server || "ws://localhost:8080";

export default async function Home() {
  const session = await auth();
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div>
        Hello from <span> Home</span>
      </div>
      <div>{wssUrl}</div>
      <div>
        <SignInBtn />
      </div>
      {session?.user && <div>Hello, {session?.user?.name}</div>}
      <div>{JSON.stringify(session)}</div>
    </div>
  );
}
