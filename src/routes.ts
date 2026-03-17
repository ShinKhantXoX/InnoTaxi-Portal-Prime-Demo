import { createBrowserRouter } from "react-router";
import { LoginPage } from "./components/LoginPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { LicenseTypeDetail } from "./components/LicenseTypeDetail";
import { LicenseTypeAdd } from "./components/LicenseTypeAdd";
import { LicensePolicyAdd } from "./components/LicensePolicyAdd";
import { LicensePolicyDetail } from "./components/LicensePolicyDetail";
import { BloodTypeDetail } from "./components/BloodTypeDetail";
import { DriverDetail } from "./components/DriverDetail";
import { DriverAdd } from "./components/DriverAdd";
import { DriverProfileDetail } from "./components/DriverProfileDetail";
import { DriverProfileAdd } from "./components/DriverProfileAdd";
import { DriverLicenseProfileDetail } from "./components/DriverLicenseProfileDetail";
import { VehicleProfileDetail } from "./components/VehicleProfileDetail";
import { FuelTypeDetail } from "./components/FuelTypeDetail";
import { FuelStationDetail } from "./components/FuelStationDetail";
import { FuelStationEdit } from "./components/FuelStationEdit";
import { FuelStationAdd } from "./components/FuelStationAdd";

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
        path: "license-types/add",
        Component: LicenseTypeAdd,
      },
      {
        path: "license-types/:id",
        Component: LicenseTypeDetail,
      },
      {
        path: "license-policies/add",
        Component: LicensePolicyAdd,
      },
      {
        path: "license-policies/:id",
        Component: LicensePolicyDetail,
      },
      {
        path: "blood-types/:id",
        Component: BloodTypeDetail,
      },
      {
        path: "drivers/add",
        Component: DriverAdd,
      },
      {
        path: "drivers/:id",
        Component: DriverDetail,
      },
      {
        path: "driver-profiles/add",
        Component: DriverProfileAdd,
      },
      {
        path: "driver-profiles/:id",
        Component: DriverProfileDetail,
      },
      {
        path: "license-profiles/:id",
        Component: DriverLicenseProfileDetail,
      },
      {
        path: "vehicle-profiles/:id",
        Component: VehicleProfileDetail,
      },
      {
        path: "fuel-types/:id",
        Component: FuelTypeDetail,
      },
      {
        path: "fuel-stations/add",
        Component: FuelStationAdd,
      },
      {
        path: "fuel-stations/:id",
        Component: FuelStationDetail,
      },
      {
        path: "fuel-stations/:id/edit",
        Component: FuelStationEdit,
      },
    ],
  },
]);