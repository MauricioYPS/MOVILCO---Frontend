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
import CoordinatorDetails from './Pages/CoordinatorDetails'
import RegionalManagerDashboard from './Pages/RegionalManager'
import MessagingHub from './Pages/MessagingHub'
import DataWorkflow from './Pages/DataWorkflow'
import AuthPage from './Pages/SignIn'
import ProtectedLayout from './Layouts/ProtectedLayout'
import AdvisorDashboard from './Pages/AdvisorDashboard'
import EmailSenderPage from './Pages/SendMails'
import WeeklyCoordinatorPage from './Pages/WeeklyCoordinatorPage'
import NoveltiesDashboard from './Pages/NoveltiesDashboard'
import UserManager from './Pages/UserManager'



  
const router = createBrowserRouter([
  {
    element: <ProtectedLayout></ProtectedLayout>,
    children: [
      { path: "/Home", element: <Home></Home> },
      { path: "/Advisors", element: <Advisors></Advisors> },
      { path: "/MessageHistory", element: <MessageHistory></MessageHistory>},
      { path: "/AdvisorDetails/:id", element: <AdvisorDeails></AdvisorDeails>},
      { path: "/Coordinators", element: <Coordinators></Coordinators>},
      { path: "/CoordinatorDetails/:id", element: <CoordinatorDetails></CoordinatorDetails>},
      { path: "/RegionalManager", element: <RegionalManagerDashboard></RegionalManagerDashboard>},
      { path: "/MessagingHub", element: <MessagingHub></MessagingHub>},
      { path: "/DataWorkflow", element: <DataWorkflow></DataWorkflow>},
      { path: "/AdvisorDashboard", element: <AdvisorDashboard></AdvisorDashboard>},
      { path: "/SendMails", element: <EmailSenderPage></EmailSenderPage> },
      { path : "/WeeklyCoordinatorPage", element: <WeeklyCoordinatorPage></WeeklyCoordinatorPage>},
      { path : "/novedades-rh", element: <NoveltiesDashboard></NoveltiesDashboard>},
      { path : "/usuarios-rh", element: <UserManager></UserManager>}
    ],
  },
  { path: "/SignIn", element: <AuthPage></AuthPage> },
  { path: "/*", element: <Home></Home> },
])
function App() {

  return (
    <>  
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
