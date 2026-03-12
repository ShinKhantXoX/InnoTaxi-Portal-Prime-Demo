import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { PrimeReactProvider } from "primereact/api";
import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  return (
    <PrimeReactProvider>
      <RouterProvider router={router} />
    </PrimeReactProvider>
  );
}
