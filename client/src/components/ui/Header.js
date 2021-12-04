import { useState } from "react";
import { useLocation } from "react-router";

const Header = () => {
    const [menuActive, setMenuActive] = useState(false);
    const location = useLocation();

    return (
        <div className="container">
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <div className="navbar-item">
                        Events System
                    </div>

                    <button className={`navbar-burger${menuActive ? ' is-active' : ''}`} 
                        aria-label="menu" aria-expanded="false" data-target="navbarBasicExample"
                        onClick={() => setMenuActive(!menuActive)}>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </button>
                </div>

                <div id="navbarBasicExample" className={`navbar-menu${menuActive ? ' is-active' : ''}`}>
                    <div className="navbar-start">
                        <a className={`navbar-item${location.pathname === "/dashboard" ? ' is-active' : ''}`} href="/dashboard">
                            Events
                        </a>

                        <a className={`navbar-item${location.pathname === "/tasks" ? ' is-active' : ''}`} href="/tasks">
                            My Tasks
                        </a>
                    </div>

                    <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            <button className="button is-secondary">
                                Log out
                            </button>
                        </div>
                    </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Header;