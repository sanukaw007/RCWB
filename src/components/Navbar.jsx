import './Navbar.css'
import { useState, useEffect } from 'react';
import bandlogo from '../assets/bandlogo.png';
import schoollogo from '../assets/royal.png';
import westernlogo from '../assets/wmslogo.png';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from "react-router-dom";

function Navbar(props) {
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
            .then(() => navigate("/"))
            .catch((error) => console.log("Error Signing Out!", error));
    };

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (!user) navigate("/");
        });
        return () => unsubscribe();
      }, [navigate]);
    
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
                  navigate("/dashboard");
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
                    <img src={bandlogo} onClick={() => {redirect("/dashboard")}} alt="Band Logo" className={`navbar-band-logo`} />
                    <div className={`rcwb-static`} onClick={() => {redirect("/dashboard")}}>RCWB</div>
                    </>
                }
            </div>
            <div className="navbar-center">
                {/* <button onClick={handleSignOut}>Sign Out</button> */}
                <button onClick={() => redirect("members")}>Members</button>
                <button onClick={() => redirect("scores")}>Scores</button>
                <button onClick={() => redirect("register")}>Register</button>
            </div>
            <div className="navbar-right">
                <button className='logout' onClick={handleSignOut}>
                    <span className="material-icons" style={{ color: 'red' }}>
                        logout
                    </span>
                </button>
                <a href="https://royalcollege.lk" target="_blank" rel="noopener noreferrer">
                    <img src={schoollogo} alt="School Logo" className="schoollogo" />
                </a>
            </div>
        </nav>
    )
}

export default Navbar;
