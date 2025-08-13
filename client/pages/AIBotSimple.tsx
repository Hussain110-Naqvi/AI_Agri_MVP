export default function AIBotSimple() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          AI Assistant (Simple)
        </h1>
        <div className="bg-white rounded-lg border p-6">
          <p className="text-gray-700 mb-4">
            This is a simplified version of the AI Bot to test routing.
          </p>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                🤖 AI Bot Features:
              </h3>
              <ul className="text-blue-800 space-y-1">
                <li>• Natural language query processing</li>
                <li>• Real-time data analysis</li>
                <li>• Actionable insights and recommendations</li>
                <li>• Integration with BigQuery and Gemini AI</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">✅ Status:</h3>
              <p className="text-green-800">
                Backend integration ready • Waiting for BigQuery credentials •
                Gemini API ready
              </p>
            </div>
          </div>
          <div className="mt-6 space-x-4">
            <a href="/" className="text-blue-500 hover:text-blue-700 underline">
              ← Back to Dashboard
            </a>
            <a
              href="/test"
              className="text-blue-500 hover:text-blue-700 underline"
            >
              Test Route
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
