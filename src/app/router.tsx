import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { DashboardPage } from "../modules/dashboard/pages/DashboardPage";
import { OrdersPage } from "../modules/orders/pages/OrdersPage";
import { OrderDetailsPage } from "../modules/orders/pages/OrderDetailsPage";
import { CreateOrderPage } from "../modules/orders/pages/CreateOrderPage";
import { EditOrderPage } from "../modules/orders/pages/EditOrderPage";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <section>
      <h2>{title}</h2>
    </section>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "orders/:orderId", element: <OrderDetailsPage /> },
      { path: "users", element: <PlaceholderPage title="Users" /> },
      { path: "contracts", element: <PlaceholderPage title="Contracts" /> },
      { path: "billing", element: <PlaceholderPage title="Billing" /> },
      { path: "payroll", element: <PlaceholderPage title="Payroll" /> },
      { path: "documents", element: <PlaceholderPage title="Documents" /> },
      { path: "orders/new", element: <CreateOrderPage /> },
      { path: "orders/:orderId/edit", element: <EditOrderPage /> },
    ],
  },
]);
