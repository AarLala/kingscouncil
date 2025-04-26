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
            <h1 className="text-3xl font-bold mb-6">About KinsCouncil</h1>
            
            <div className="prose max-w-none">
              <p>
                KinsCouncil combines the strategic elements of chess with cognitive science
                to create engaging brain training exercises for all ages, with a special focus on neurodivergent
                learners and young minds.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">Our Approach</h2>
              <p>
                Our challenges are specifically designed to target different cognitive functions:
                memory, focus, visual processing, and strategic thinking. By blending chess puzzles with neuroscience,
                KinsCouncil offers a fun and effective way to boost your brainpower.
              </p>
              <h2 className="text-xl font-semibold mt-8 mb-4">Why KinsCouncil?</h2>
              <ul>
                <li>Personalized progress tracking and achievements</li>
                <li>Safe, privacy-focused, and ad-free environment</li>
                <li>Accessible for all skill levels and learning styles</li>
                <li>Built on modern, secure technology (Supabase, React)</li>
              </ul>
              <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
              <p>
                Have questions or feedback? Email us at <a href="mailto:support@kinscouncil.com" className="text-chess-primary underline">support@kinscouncil.com</a>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
