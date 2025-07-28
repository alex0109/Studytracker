import Dashboard from "./components/dashboard.component";
import Intro from "./components/intro.component";
import MaterialList from "./components/material-list/material-list.component";
import MaterialPage from "./components/material-page/material-page.component";

export default function Home() {
  return (
    <main className="flex flex-col items-center pt-10">
      {/* <MaterialPage /> */}
      <Intro />
      <MaterialList />
      <Dashboard />
    </main>
  );
}
