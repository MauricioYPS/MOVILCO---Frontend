import Footer from '../Props/Footer'
import NavBar from '../Props/NavBar'
import { Outlet } from 'react-router-dom'

export default function StandardLayout() {
    return (<>

        <header>
            <NavBar></NavBar>
        </header>
        <main className='mt-16'>
            <Outlet></Outlet>
        </main>
        <footer>
            <Footer></Footer>
        </footer>

    </>)
}