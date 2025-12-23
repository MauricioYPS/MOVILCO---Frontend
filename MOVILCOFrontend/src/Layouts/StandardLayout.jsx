import Footer from '../Props/Footer'
import NavBar from '../Props/NavBar'
import { Outlet } from 'react-router-dom'
import SideBar from '../Props/Sidebar/SideBar'

export default function StandardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 ">
      <SideBar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30">
          <NavBar />
        </header>
        <main className="flex min-w-0 w-full">
          <Outlet />
        </main>
        <footer><Footer /></footer>
      </div>
    </div>
  );
}
