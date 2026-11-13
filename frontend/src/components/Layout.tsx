import { Outlet } from "react-router";
import AssistantWidget from "./assistant/AssistantWidget";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-gray-900 md:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1 p-8">
        <Outlet />
      </main>
      <AssistantWidget />
    </div>
  );
}
