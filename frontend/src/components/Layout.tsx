import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-gray-900 md:flex-row">
      <Sidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
