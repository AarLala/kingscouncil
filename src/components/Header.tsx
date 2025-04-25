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
  return <header className="bg-white shadow-sm py-3 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-chess-primary flex items-center justify-center">
            <span className="text-white font-bold text-xl">♟</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-chess-primary to-chess-secondary bg-clip-text text-transparent">
            MindChessLab
          </h1>
          {/* Added image next to logo */}
          
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <Link to="/" className="text-gray-600 hover:text-chess-primary">Home</Link>
          <Link to="/challenges" className="text-gray-600 hover:text-chess-primary">Challenges</Link>
          <Link to="/about" className="text-gray-600 hover:text-chess-primary">About</Link>
          
          {currentUser ? <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center space-x-1 text-chess-primary">
                <span>{currentUser.username}</span>
                <span className="bg-chess-primary/10 text-chess-primary px-2 py-0.5 rounded-full text-xs">
                  {currentUser.points} pts
                </span>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-chess-primary text-chess-primary hover:bg-chess-primary hover:text-white">
                Log Out
              </Button>
            </div> : <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-chess-primary hover:bg-chess-secondary text-white" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>}
        </nav>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </Button>
        </div>
      </div>
    </header>;
};
export default Header;