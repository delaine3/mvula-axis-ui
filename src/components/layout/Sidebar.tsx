import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/orders", label: "Orders" },
  { to: "/users", label: "Users" },
  { to: "/contracts", label: "Contracts" },
  { to: "/billing", label: "Billing" },
  { to: "/payroll", label: "Payroll" },
  { to: "/documents", label: "Documents" },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">Mvula Axis</div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
