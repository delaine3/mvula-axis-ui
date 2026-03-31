import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { DashboardPage } from "../modules/dashboard/pages/DashboardPage";
import { OrdersPage } from "../modules/orders/pages/OrdersPage";
import { OrderDetailsPage } from "../modules/orders/pages/OrderDetailsPage";
import { CreateOrderPage } from "../modules/orders/pages/CreateOrderPage";
import { UpdateOrderPage } from "../modules/orders/pages/UpdateOrderPage";
import { DisbursementsPage } from "../modules/disbursements/pages/DisbursementsPage";
import { CreateDisbursementPage } from "../modules/disbursements/pages/CreateDisbursementPage";
import { UpdateDisbursementPage } from "../modules/disbursements/pages/UpdateDisbursementPage";
import { DisbursementDetailsPage } from "../modules/disbursements/pages/DisbursementDetailsPage";
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
      { path: "orders/new", element: <CreateOrderPage /> },
      { path: "orders/:orderId", element: <OrderDetailsPage /> },
      { path: "orders/:orderId/update", element: <UpdateOrderPage /> },

      { path: "disbursements", element: <DisbursementsPage /> },
      { path: "disbursements/new", element: <CreateDisbursementPage /> },
      {
        path: "disbursements/:disbursementId/update",
        element: <UpdateDisbursementPage />,
      },
      {
        path: "disbursements/:disbursementId",
        element: <DisbursementDetailsPage />,
      },

      { path: "users", element: <PlaceholderPage title="Users" /> },
      { path: "contracts", element: <PlaceholderPage title="Contracts" /> },
      { path: "billing", element: <PlaceholderPage title="Billing" /> },
      { path: "documents", element: <PlaceholderPage title="Documents" /> },
      { path: "payroll", element: <PlaceholderPage title="Payroll" /> },
    ],
  },
]);
