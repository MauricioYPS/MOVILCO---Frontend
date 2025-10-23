import Footer from '../Props/Footer'
import Header from '../Props/Header'
import { Outlet } from 'react-router-dom'

export default function StandardLayout() {
    return (<>

        <header>
            <Header></Header>
        </header>
        <main>
            <Outlet></Outlet>
        </main>
        <footer>
            <Footer></Footer>
        </footer>

    </>)
}