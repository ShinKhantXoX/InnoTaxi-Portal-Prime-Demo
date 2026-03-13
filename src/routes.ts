import { createBrowserRouter } from "react-router";
import { LoginPage } from "./components/LoginPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { LicenseTypeDetail } from "./components/LicenseTypeDetail";
import { LicensePolicyAdd } from "./components/LicensePolicyAdd";
import { LicensePolicyDetail } from "./components/LicensePolicyDetail";

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
      {
        path: "license-policy/add",
        Component: LicensePolicyAdd,
      },
      {
        path: "license-policy/:id",
        Component: LicensePolicyDetail,
      },
    ],
  },
]);