// RCWB – The website for the Royal College Western Band
// Copyright (C) 2025  Sanuka Weerabaddana 

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import PropTypes from 'prop-types';
import './Navbar.css'
import { useState, useEffect } from 'react';
import bandlogo from '../assets/bandlogo.png';
import schoollogo from '../assets/royal.png';
import westernlogo from '../assets/wmslogo.png';
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from "react-router-dom"

function Navbar(props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(props.scrolled);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {window.location.href = "/RCWB/"})
            .catch((error) => console.log("Error Signing Out!", error));
    };
    const tologin = () => {
        navigate("/login")
    };

    const navigate = useNavigate();
    
        const redirect = (sub) => {
          switch (sub) {
              case "members":
                  navigate("/members");
                  break;
              case "scores":
                  navigate("/scores-admin");
                  break;
              case "register":
                  navigate("/register");
                  break;
              default:
                  navigate("/RCWB/");
                //   CHANGE
                  break;
          }
      };

    return(
        <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-left">
                <a href="https://royalcollege.lk/clubs-and-societies/western-music-society/" target="_blank" rel="noopener noreferrer">
                    <img src={westernlogo} alt="Western Music Society Logo" className="wms" />
                </a>
                {scrolled &&
                    <>
                        <div className={`navbar-space`}></div>
                        <img src={bandlogo} onClick={() => {redirect("/")}} alt="Band Logo" className={`navbar-band-logo`} />
                        <div className={`rcwb-static`} onClick={() => {redirect("/")}}>RCWB</div>
                    </>
                }
            </div>
            {props.isAdmin &&
                <div className="navbar-center">
                    <button onClick={() => redirect("members")}>Members</button>
                    <button onClick={() => redirect("scores")}>Scores</button>
                    <button onClick={() => redirect("register")}>Register</button>
                </div>
            }

            <div className="navbar-right">
                <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    <span className="material-icons">menu</span>
                </div>

                {props.isAdmin && 
                    <button style={{color: "red"}} className="logoutnonresp" onClick={handleSignOut}>
                        <span className="material-icons" style={{ color: 'red' }}>logout</span> Log out
                    </button>
                }
                {!props.isAdmin && 
                    <button className="logoutnonresp" onClick={tologin}>
                        <span className="material-icons" style={{ color: 'white' }}>login</span> Login
                    </button>
                }

                <a href="https://royalcollege.lk" target="_blank" rel="noopener noreferrer">
                    <img src={schoollogo} alt="School Logo" className="schoollogo" />
                </a>
            </div>

            <div className={`navbar-panel ${menuOpen ? 'open' : ''}`}>
                {props.isAdmin && 
                    <> 
                        <div id='rcwb-static' className={`rcwb-static`} onClick={() => {redirect("/")}}>RCWB</div>
                        <button onClick={() => redirect("members")}>Members</button>
                        <button onClick={() => redirect("scores")}>Scores</button>
                        <button onClick={() => redirect("register")}>Register</button>
                        <button style={{color: "red"}} className="logout" onClick={handleSignOut}>
                            <span className="material-icons" style={{ color: 'red' }}>logout</span> Log out
                        </button>
                    </>
                }
                {!props.isAdmin && 
                    <button className="logout" onClick={tologin}>
                        <span className="material-icons" style={{ color: 'white' }}>login</span> Login
                    </button>
                }
            </div>
        </nav>
    )
}


Navbar.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  scrolled: PropTypes.bool.isRequired,
};

export default Navbar;