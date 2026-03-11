import { RouterProvider } from "react-router";
import { router } from "./route.ts"

function App() {

  return (
    <>
     <RouterProvider router={router} />
    </>
  )

}

export default App;