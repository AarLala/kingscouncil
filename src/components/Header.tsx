import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
const Header = () => {
  const {
    currentUser,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  return <header className="bg-black shadow-sm py-3 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-chess-primary flex items-center justify-center">
            <span className="text-white font-bold text-xl">♟</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-chess-primary to-chess-secondary bg-clip-text text-transparent">
            KingsCouncil
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link to="/about">
            <Button variant="ghost">About</Button>
          </Link>
{currentUser && (
  <Link to="/dashboard">
    <Button variant="ghost">Dashboard</Button>
  </Link>
)}

          {currentUser ? (
            <Button variant="ghost" onClick={handleLogout}>Logout</Button>
          ) : (
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>;
};
export default Header;