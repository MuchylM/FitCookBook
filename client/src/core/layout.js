import "../App.css"
import { Outlet, Link } from "react-router-dom";
import Icon from '@mdi/react'
import Nav from 'react-bootstrap/Nav'
import { mdiFoodAppleOutline, mdiNoteTextOutline } from '@mdi/js'
const Layout = () => {
    return (
        <div className="page">
            <nav>
                <div className="layout">
                    <Link to="/" className="myLogo">
                        FitCookBook
                    </Link>
                    <Link to="/" className="myRouteButton">
                        <Icon
                            path={mdiNoteTextOutline}
                            size={1}
                        />
                        Recipes
                    </Link>
                    <Link to="/ingredients" className="myRouteButton">
                        <Icon
                            path={mdiFoodAppleOutline}
                            size={1}
                        />
                        Ingredients
                    </Link>
                </div>
            </nav>
            <div className="content">
                <Outlet />
            </div>
        </div>
    )
};

export default Layout;