import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

const Index = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col brain-bg">
      <Header />
      
      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="lg:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Train Your Brain with 
                  <span className="bg-gradient-to-r from-chess-primary to-chess-secondary bg-clip-text text-transparent"> Chess</span>
                </h1>
                
                <p className="text-lg text-gray-600">
                  Engaging chess-based memory and cognitive challenges designed especially for young minds & neurodivergent learners.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  {currentUser ? (
                    <Link to="/dashboard">
                      <Button className="bg-chess-primary hover:bg-chess-secondary text-white px-8 py-6 text-lg h-auto">
                        Start Challenges
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/signup">
                      <Button className="bg-chess-primary hover:bg-chess-secondary text-white px-8 py-6 text-lg h-auto">
                        Sign Up Free
                      </Button>
                    </Link>
                  )}
                  
                  <Link to="/about">
                    <Button variant="outline" className="border-chess-primary text-chess-primary hover:bg-chess-primary/5 px-8 py-6 text-lg h-auto">
                      Learn More
                    </Button>
                  </Link>
                </div>
                
                <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-chess-primary/10 flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-chess-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                      </svg>
                    </div>
                    <h3 className="font-semibold">Memory</h3>
                    <p className="text-sm text-gray-600">Improve recall and pattern recognition</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-chess-primary/10 flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-chess-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold">Focus</h3>
                    <p className="text-sm text-gray-600">Enhance concentration skills</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-chess-primary/10 flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-chess-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                      </svg>
                    </div>
                    <h3 className="font-semibold">Cognitive</h3>
                    <p className="text-sm text-gray-600">Build flexible thinking skills</p>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 relative">
                <div className="relative w-full aspect-square max-w-md mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 bg-chess-primary/20 rounded-full animate-pulse-light"></div>
                  <img 
                    src="/lovable-uploads/b115db57-524d-4226-a8ce-d23e36b8ec9d.png"
                    alt="Young boy holding chess piece"
                    className="relative z-10 rounded-2xl shadow-xl object-cover w-full h-full"
                    style={{ objectPosition: "center" }}
                  />
                  <div className="absolute -bottom-6 -right-6 bg-white p-3 rounded-xl shadow-lg z-20 max-w-[200px]">
                    <div className="flex items-start gap-3">
                      <div className="text-chess-primary text-4xl font-bold">5</div>
                      <p className="text-sm">Unique cognitive challenges based on chess</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It <span className="bg-gradient-to-r from-chess-primary to-chess-secondary bg-clip-text text-transparent">Works</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="w-14 h-14 bg-chess-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-chess-primary text-xl font-bold">1</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Complete Challenges</h3>
                <p className="text-sm text-gray-600">
                  Engage in chess-based memory and cognitive exercises
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="w-14 h-14 bg-chess-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-chess-primary text-xl font-bold">2</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Earn Points</h3>
                <p className="text-sm text-gray-600">
                  Collect points as you improve and track your progress
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="w-14 h-14 bg-chess-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-chess-primary text-xl font-bold">3</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Learn</h3>
                <p className="text-sm text-gray-600">
                  Discover how your brain works with neuroscience explanations
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Train?</h2>
            <p className="text-lg text-gray-600 mb-10">
              Join thousands of young learners improving memory and cognitive skills through chess-based challenges.
            </p>
            
            <div className="flex justify-center">
              {currentUser ? (
                <Link to="/dashboard">
                  <Button className="bg-chess-primary hover:bg-chess-secondary text-white px-8 py-3 text-lg">
                    Start Now
                  </Button>
                </Link>
              ) : (
                <Link to="/signup">
                  <Button className="bg-chess-primary hover:bg-chess-secondary text-white px-8 py-3 text-lg">
                    Sign Up Free
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-50 py-8 px-4 border-t border-gray-200">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-chess-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">♟</span>
              </div>
              <span className="font-bold text-gray-800">KinsCouncil</span>
            </div>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-chess-primary">Home</Link>
              <Link to="/about" className="hover:text-chess-primary">About</Link>
              <Link to="/challenges" className="hover:text-chess-primary">Challenges</Link>
              <a href="#" className="hover:text-chess-primary">Book</a>
              <Link to="/privacy" className="hover:text-chess-primary">Privacy</Link>
              <Link to="/terms" className="hover:text-chess-primary">Terms</Link>
            </div>
            
            <div>
              <p className="text-xs text-gray-500">© 2025 KinsCouncil. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

