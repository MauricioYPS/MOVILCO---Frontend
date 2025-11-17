import './App.css'
import { RouterProvider, createBrowserRouter } from
  'react-router-dom'
import Home from './Pages/Home'
import NotFound from './Pages/NotFound'
import StandardLayout from './Layouts/StandardLayout'
import Advisors from './Pages/Advisor'
import MessageHistory from './Pages/MessageHistory'
import AdvisorDeails from './Pages/AdvisorDetails'
import Coordinators from './Pages/Coordinators'

const router = createBrowserRouter([
  {
    element: <StandardLayout></StandardLayout>,
    children: [
      { path: "/", element: <Home></Home> },
      { path: "/home", element: <Home></Home> },
      { path: "/Advisors", element: <Advisors></Advisors> },
      { path: "/MessageHistory", element: <MessageHistory></MessageHistory>},
      { path: "/AdvisorDetails", element: <AdvisorDeails></AdvisorDeails>},
      { path: "/Coordinators", element: <Coordinators></Coordinators>}
    ],
  },
  { path: "/*", element: <NotFound></NotFound> }
])
function App() {

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
