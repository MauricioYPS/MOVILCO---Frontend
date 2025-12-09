import Footer from '../Props/Footer'
import NavBar from '../Props/NavBar'
import { Outlet } from 'react-router-dom'
import SideBar from '../Props/Sidebar/SideBar'

export default function StandardLayout() {
  return (
    <div className=" lg:flex min-h-screen bg-slate-50">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30">
          <NavBar />
        </header>
        <main className="flex-1 ">
          <Outlet />
        </main>
        <footer><Footer /></footer>
      </div>
    </div>
  );
}
