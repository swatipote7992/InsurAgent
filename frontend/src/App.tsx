import { Route, Routes } from "react-router";
import Layout from "./components/Layout";
import { NAV_ITEMS } from "./nav";
import NotFound from "./pages/NotFound";

/** Routes only; the caller supplies the router (BrowserRouter in main.tsx, MemoryRouter in tests). */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {NAV_ITEMS.map(({ path, Page }) => (
          <Route key={path} path={path} element={<Page />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
