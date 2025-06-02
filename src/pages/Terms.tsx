import Header from "../components/Header";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
<main className="flex-1 container mx-auto px-4 py-8 max-w-2xl text-black">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Acceptance of Terms</h2>
          <p>
            By using KingsCouncil, you agree to these Terms of Service. If you do not agree, please do not use this app.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">User Responsibilities</h2>
          <ul className="list-disc pl-6">
            <li>Provide accurate information when creating your account</li>
            <li>Keep your login credentials secure</li>
            <li>Use KingsCouncil for personal, non-commercial purposes only</li>
            <li>Do not attempt to disrupt or misuse the app or its services</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Intellectual Property</h2>
          <p>
            All content, including challenges, graphics, and branding, is the property of KingsCouncil. You may not copy, distribute, or use our content without permission.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Limitation of Liability</h2>
          <p>
            KingsCouncil is provided as a cognitive training tool. We do not guarantee specific results or improvements. 
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Changes to Terms</h2>
          <p>
            We may update these Terms of Service from time to time. Continued use of KingsCouncil means you accept any changes. We will notify users of significant updates.
          </p>
        </section>
      </main>
    </div>
  );
} 