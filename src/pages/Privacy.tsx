import Header from "../components/Header";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">What Information We Collect</h2>
          <p>
            When you use KinsCouncil, we collect your email address, username, and your progress in chess-based challenges. This information is used to create your account, track your achievements, and personalize your experience.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">How We Use Your Data</h2>
          <ul className="list-disc pl-6">
            <li>To manage your account and login securely</li>
            <li>To track your challenge progress and points</li>
            <li>To improve your experience and provide personalized feedback</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Third-Party Services</h2>
          <p>
            We use Supabase to securely store your data and manage authentication. Your information is never sold or shared with advertisers.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Your Rights</h2>
          <ul className="list-disc pl-6">
            <li>You can request deletion of your account and data at any time</li>
            <li>You can update your email or username from your profile</li>
            <li>Contact us at <a href="mailto:support@kinscouncil.com" className="text-chess-primary underline">support@kinscouncil.com</a> for any privacy concerns</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Contact</h2>
          <p>
            If you have any questions about this privacy policy, please contact us at <a href="mailto:support@kinscouncil.com" className="text-chess-primary underline">support@kinscouncil.com</a>.
          </p>
        </section>
      </main>
    </div>
  );
} 