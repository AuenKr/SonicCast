import ControlBtn from "@/components/controlBtns";
import LandingPage from "@/components/landing";

export default async function Home() {
  return (
    <div className="mx-4 m-2 flex flex-col justify-between items-center">
      <div className="max-w-4xl">
        <LandingPage />
        <ControlBtn />
      </div>
    </div>
  );
}
