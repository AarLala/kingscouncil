import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "../components/Header";

const MyStory = () => {
  return (
    <div className="min-h-screen flex flex-col brain-bg">
      <Header />

      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="lg:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-black">
                  My Story
                </h1>

                <p className="text-lg text-gray-600">
                  I’ve been playing chess since 3rd grade, and over the years, it’s grown into much more than just a game. From grinding through tournaments to studying classics like the King and pawn checkmate, chess has taught me patience, resilience, and how to learn through failure. One of my proudest moments was becoming Alabama State Co-Champion at the Alabama Dual Rated State Tournament, but honestly, the real growth came from the challenges—and the incredible people I met along the way.
                </p>
                <p className="text-lg text-gray-600">
                  Over the years, my accomplishments have reflected the things I’m passionate about:
                </p>
                <ul className="list-disc pl-6 text-lg text-gray-600">
                  <li>4× AIME Qualifier</li>
                  <li>USACO Gold Division</li>
                  <li>National Chess Competitor</li>
                </ul>
                <p className="text-lg text-gray-600">
                  One big lesson I’ve learned is that improvement looks different for everyone. Some students, especially those on the autism spectrum, can get overlooked in traditional competitive spaces. That realization inspired me to build a chess-based learning application for neurodiverse students—designed to support different learning styles, build confidence, and create a sense of belonging. Chess has always been my tool for connection, and I wanted to share that with others who might not always feel included.
                </p>
                <p className="text-lg text-gray-600">
                  For me, this isn’t just about winning. It’s about making chess more accessible and welcoming. It’s about helping others find their love for the game, at their own pace.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-6">Thanks for Reading!</h2>
            <p className="text-lg text-gray-600 mb-10">
              {/* A final closing thought or call to action */}
              I hope my story inspires you to start your own chess journey. If you have any questions or would like to share your own story, feel free to reach out!
            </p>

            <div className="flex justify-center">
              <Link to="/contact">
                <Button className="bg-chess-primary hover:bg-chess-secondary text-white px-8 py-3 text-lg">
                  Get in Touch
                </Button>
              </Link>
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
              <p className="text-xs text-gray-500">© 2025 KingsCouncil. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MyStory;
