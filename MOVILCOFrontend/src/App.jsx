import './App.css'
import { RouterProvider, createBrowserRouter } from
  'react-router-dom'
import Home from './Pages/Home'
import NotFound from './Pages/NotFound'
import StandardLayout from './Layouts/StandardLayout'
import Advisors from './Pages/Advisor'
import MessageHistory from './Pages/MessageHistory'
import NewAdvisor from './Pages/Advisors'

const router = createBrowserRouter([
  {
    element: <StandardLayout></StandardLayout>,
    children: [
      { path: "/", element: <Home></Home> },
      { path: "/home", element: <Home></Home> },
      { path: "/Advisors", element: <Advisors></Advisors> },
      { path: "/MessageHistory", element: <MessageHistory></MessageHistory>},
      { path: "/newAdvisor", element: <NewAdvisor></NewAdvisor> }
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
