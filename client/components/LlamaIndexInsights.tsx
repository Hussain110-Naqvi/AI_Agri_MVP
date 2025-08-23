import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Loader2, TrendingUp, Leaf, Cloud, Zap } from 'lucide-react';

interface AgriculturalInsight {
  success: boolean;
  query: string;
  results?: any;
  error?: string;
  timestamp: string;
}

interface ComprehensiveReport {
  timestamp: string;
  summary: any;
  marketAnalysis: Record<string, any>;
  plantingIntentions: any;
  weatherImpact: any;
  fertilizerAnalysis: any;
  recommendations: any[];
}

const LlamaIndexInsights: React.FC = () => {
  const [query, setQuery] = useState('');
  const [insights, setInsights] = useState<AgriculturalInsight | null>(null);
  const [report, setReport] = useState<ComprehensiveReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>('custom');
  const [commodity, setCommodity] = useState('corn');
  const [timeframe, setTimeframe] = useState('30');

  const handleCustomQuery = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/llamaindex/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, options: {} })
      });
      
      const data = await response.json();
      setInsights(data);
      setReport(null);
    } catch (error) {
      console.error('Error fetching insights:', error);
      setInsights({
        success: false,
        query,
        error: 'Failed to fetch insights',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAnalysis = async (type: string) => {
    setLoading(true);
    try {
      let response;
      
      switch (type) {
        case 'market-trends':
          response = await fetch(`/api/llamaindex/market-trends/${commodity}?days=${timeframe}`);
          break;
        case 'planting-intentions':
          response = await fetch(`/api/llamaindex/planting-intentions?grainType=${commodity}&location=Canada`);
          break;
        case 'fertilizer-analysis':
          response = await fetch('/api/llamaindex/fertilizer-analysis?fertilizerType=phosphate_potash');
          break;
        case 'weather-impact':
          response = await fetch(`/api/llamaindex/weather-impact?region=North America&days=${timeframe}`);
          break;
        case 'comprehensive':
          response = await fetch('/api/llamaindex/comprehensive-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              commodities: [commodity],
              timeframe: parseInt(timeframe),
              includeWeather: true,
              includeFertilizer: true
            })
          });
          break;
        default:
          return;
      }
      
      const data = await response.json();
      
      if (type === 'comprehensive') {
        setReport(data.report);
        setInsights(null);
      } else {
        setInsights(data);
        setReport(null);
      }
    } catch (error) {
      console.error('Error fetching analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderInsights = () => {
    if (!insights) return null;

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            Agricultural Insights
          </CardTitle>
          <CardDescription>
            Query: "{insights.query}"
          </CardDescription>
        </CardHeader>
        <CardContent>
          {insights.success ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-green-800">✅ Analysis completed successfully</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="font-semibold mb-2">Results:</h4>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(insights.results, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-red-800">❌ Error: {insights.error}</p>
            </div>
          )}
          <div className="text-xs text-gray-500 mt-4">
            Generated at: {new Date(insights.timestamp).toLocaleString()}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderReport = () => {
    if (!report) return null;

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Comprehensive Agricultural Report
          </CardTitle>
          <CardDescription>
            Generated at {new Date(report.timestamp).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Market Analysis */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Market Analysis
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(report.marketAnalysis).map(([commodity, data]) => (
                <div key={commodity} className="rounded-lg bg-blue-50 p-3">
                  <h5 className="font-medium text-blue-900">{commodity}</h5>
                  <p className="text-sm text-blue-700">
                    {data.success ? 'Analysis available' : 'Analysis failed'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Planting Intentions */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              Planting Intentions
            </h4>
            <div className="rounded-lg bg-green-50 p-3">
              <p className="text-sm text-green-700">
                {report.plantingIntentions?.success ? 'Analysis available' : 'Analysis failed'}
              </p>
            </div>
          </div>

          {/* Weather Impact */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Weather Impact
            </h4>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-sm text-gray-700">
                {report.weatherImpact?.success ? 'Analysis available' : 'Analysis failed'}
              </p>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="font-semibold mb-2">Recommendations</h4>
            <div className="space-y-2">
              {report.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50">
                  <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                    {rec.priority}
                  </Badge>
                  <p className="text-sm text-yellow-800">{rec.message}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🌾 LlamaIndex Agricultural Insights</CardTitle>
          <CardDescription>
            Get intelligent insights about agricultural markets, planting intentions, weather impact, and more using natural language queries.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Analysis Options */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Commodity</label>
                <Select value={commodity} onValueChange={setCommodity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corn">Corn</SelectItem>
                    <SelectItem value="soybeans">Soybeans</SelectItem>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="barley">Barley</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Timeframe (days)</label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleQuickAnalysis('market-trends')}
                disabled={loading}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Market Trends
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleQuickAnalysis('planting-intentions')}
                disabled={loading}
              >
                <Leaf className="h-4 w-4 mr-2" />
                Planting Intentions
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleQuickAnalysis('fertilizer-analysis')}
                disabled={loading}
              >
                <Zap className="h-4 w-4 mr-2" />
                Fertilizer
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleQuickAnalysis('weather-impact')}
                disabled={loading}
              >
                <Cloud className="h-4 w-4 mr-2" />
                Weather
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleQuickAnalysis('comprehensive')}
                disabled={loading}
              >
                📊 Comprehensive
              </Button>
            </div>
          </div>

          {/* Custom Query */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Custom Query</h3>
            <div className="space-y-4">
              <Textarea
                placeholder="Ask anything about agricultural data... (e.g., 'What are the current corn futures trends?' or 'How has weather affected planting this season?')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleCustomQuery} 
                disabled={loading || !query.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Get Insights'
                )}
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Analyzing agricultural data...</p>
            </div>
          )}

          {/* Results */}
          {renderInsights()}
          {renderReport()}
        </CardContent>
      </Card>
    </div>
  );
};

export default LlamaIndexInsights;
