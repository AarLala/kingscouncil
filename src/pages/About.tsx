
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "../components/Header";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h1 className="text-3xl font-bold mb-6">About Mind Chess Lab</h1>
            
            <div className="prose max-w-none">
              <p>
                Mind Chess Lab combines the strategic elements of chess with cognitive science
                to create engaging brain training exercises for young minds, especially neurodivergent
                learners ages 7-15.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">Our Approach</h2>
              <p>
                Our challenges are specifically designed to target different cognitive functions:
              </p>
              
              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-chess-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-chess-primary text-sm">♟</span>
                  </div>
                  <div>
                    <strong>Working Memory</strong> - The ability to hold information in mind and manipulate it
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-chess-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-chess-primary text-sm">♟</span>
                  </div>
                  <div>
                    <strong>Visual Processing</strong> - Interpreting and organizing visual information
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-chess-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-chess-primary text-sm">♟</span>
                  </div>
                  <div>
                    <strong>Cognitive Flexibility</strong> - Adapting to changing rules and scenarios
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-chess-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-chess-primary text-sm">♟</span>
                  </div>
                  <div>
                    <strong>Strategic Thinking</strong> - Planning ahead and predicting outcomes
                  </div>
                </li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">Neurodivergent Learning</h2>
              <p>
                Our platform is particularly beneficial for neurodivergent learners, including those with:
              </p>
              
              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-chess-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-chess-primary text-sm">•</span>
                  </div>
                  <div>ADHD</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-chess-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-chess-primary text-sm">•</span>
                  </div>
                  <div>Dyslexia</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-chess-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-chess-primary text-sm">•</span>
                  </div>
                  <div>Autism Spectrum</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-chess-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-chess-primary text-sm">•</span>
                  </div>
                  <div>Processing Disorders</div>
                </li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">Book Connection</h2>
              <p>
                This platform complements the Amazon-published book "Chess for Brain Development"
                by providing interactive exercises that reinforce the concepts covered in the book.
              </p>
              
              <div className="mt-8 p-6 bg-chess-primary/5 rounded-lg border border-chess-primary/20">
                <p className="font-medium mb-2">
                  Ready to explore our chess-based cognitive challenges?
                </p>
                
                <Link to="/challenges">
                  <Button className="bg-chess-primary hover:bg-chess-secondary mt-2">
                    View Challenges
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
