import Dashboard from "./components/dashboard.component";
import Intro from "./components/intro.component";

export default function Home() {
  return (
    <main className="flex flex-col items-center pt-10">
      <Intro />
      <Dashboard />
    </main>
  );
}
