export default function TestRoute() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Test Route Working!
        </h1>
        <p className="text-lg text-gray-700">
          If you can see this, routing is working correctly.
        </p>
        <div className="mt-8 space-y-2">
          <a
            href="/"
            className="block text-blue-500 hover:text-blue-700 underline"
          >
            → Go to Dashboard
          </a>
          <a
            href="/ai-bot"
            className="block text-blue-500 hover:text-blue-700 underline"
          >
            → Go to AI Bot
          </a>
          <a
            href="/alerts"
            className="block text-blue-500 hover:text-blue-700 underline"
          >
            → Go to Alerts
          </a>
        </div>
      </div>
    </div>
  );
}
