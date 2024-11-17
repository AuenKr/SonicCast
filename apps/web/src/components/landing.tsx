import { projectDetails } from "./config";

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-[70vh] justify-center items-center gap-4">
      <div className="text-4xl font-bold">{projectDetails.name}</div>
      <div className="text-2xl font-semibold text-wrap text-center text-gray-800 dark:text-slate-200">
        {projectDetails.subheader}
      </div>
      <div className="text-lg text-gray-600 dark:text-slate-300 text-wrap text-center">
        {projectDetails.description}
      </div>
    </main>
  );
}
