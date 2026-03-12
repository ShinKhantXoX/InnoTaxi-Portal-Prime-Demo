import { createBrowserRouter } from "react-router";
import { LoginPage } from "./components/LoginPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { LicenseTypeDetail } from "./components/LicenseTypeDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      {
        path: "license-types/:id",
        Component: LicenseTypeDetail,
      },
    ],
  },
]);
