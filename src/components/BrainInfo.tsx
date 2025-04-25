
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BrainInfoProps {
  title: string;
  description: string;
  area: string;
}

const BrainInfo = ({ title, description, area }: BrainInfoProps) => {
  return (
    <Card className="overflow-hidden border-2 border-chess-primary/20">
      <CardHeader className="bg-gradient-to-r from-chess-primary to-chess-secondary text-white">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-white/80">Area: {area}</CardDescription>
      </CardHeader>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 shrink-0 animate-pulse-light">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M50 5C25.1 5 5 25.1 5 50s20.1 45 45 45 45-20.1 45-45S74.9 5 50 5zm0 80c-19.3 0-35-15.7-35-35s15.7-35 35-35 35 15.7 35 35-15.7 35-35 35z"
                fill="#7d56f3"
              />
              <path
                d="M65 35c-5.5 0-10 4.5-10 10 0 2.1.7 4.1 1.8 5.7L45.5 62c-.9-.6-2-1-3.2-1-3.1 0-5.7 2.5-5.7 5.7s2.5 5.7 5.7 5.7 5.7-2.5 5.7-5.7c0-.9-.2-1.8-.6-2.5l11-11c1.7 1.1 3.6 1.8 5.7 1.8 5.5 0 10-4.5 10-10s-4.5-10-10-10zm0 15c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"
                fill="#4f37a3"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-600">{description}</p>
            <div className="mt-3 p-2 bg-chess-primary/5 border border-chess-primary/10 rounded text-xs text-gray-600">
              <span className="font-medium text-chess-secondary">Did you know?</span> Regular cognitive exercises can create new neural pathways and strengthen existing ones!
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrainInfo;
