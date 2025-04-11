import { useEffect } from "react";
import './Dashboard.css';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (!user) navigate("/");
        });
        return () => unsubscribe();
      }, [navigate]);

    const handleSignOut = () => {
        signOut(auth)
          .then(() => {
            navigate("/");
            console.log("Signed out successfully");
          })
          .catch((error) => {
            console.log("Error Signing Out!", error);
          });
    };

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

    return (
        <>
            <h1>Dashboard</h1>
            <button onClick={handleSignOut}>Sign Out</button>
            <button onClick={() => redirect("members")}>Members</button>
            <button onClick={() => redirect("scores")}>Scores</button>
            <button onClick={() => redirect("register")}>Register</button>
        </>
    );
}

export default Dashboard;