import { NavLink } from "react-router";
import { NAV_ITEMS } from "../nav";

const baseLink =
  "block px-6 py-3 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";
const activeLink = "bg-brand-active text-white";

export default function Sidebar() {
  return (
    <nav aria-label="Main navigation" className="bg-brand py-6 text-gray-300 md:w-[220px] md:shrink-0">
      <div className="px-6 pb-6 text-xl font-bold text-white">InsurAgent</div>
      <ul className="flex flex-wrap md:flex-col">
        {NAV_ITEMS.map(({ label, path }) => (
          <li key={path} className="grow md:grow-0">
            <NavLink
              to={path}
              end={path === "/"}
              className={({ isActive }) => (isActive ? `${baseLink} ${activeLink}` : baseLink)}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
