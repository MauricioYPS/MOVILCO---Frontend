import './App.css'
import { RouterProvider, createBrowserRouter } from
  'react-router-dom'
import Home from './Pages/Home'
import NotFound from './Pages/NotFound'
import StandardLayout from './Layouts/StandardLayout'

const router = createBrowserRouter([
  {
    element: <StandardLayout></StandardLayout>,
    children: [
      { path: "/", element: <Home></Home> },
      { path: "/home", element: <Home></Home> }
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
