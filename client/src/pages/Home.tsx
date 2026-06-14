import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Flower, Leaf } from 'lucide-react';

/**
 * Iris Classification Model
 * Uses K-Nearest Neighbors algorithm to classify iris flowers
 * Features: sepal length, sepal width, petal length, petal width
 * Classes: Setosa, Versicolor, Virginica
 */

interface IrisData {
  sepalLength: number;
  sepalWidth: number;
  petalLength: number;
  petalWidth: number;
}

interface PredictionResult {
  species: string;
  confidence: number;
  description: string;
  image: string;
}

// Training data (simplified KNN model)
const trainingData = [
  { features: [5.1, 3.5, 1.4, 0.2], label: 'Setosa' },
  { features: [4.9, 3.0, 1.4, 0.2], label: 'Setosa' },
  { features: [4.7, 3.2, 1.3, 0.2], label: 'Setosa' },
  { features: [7.0, 3.2, 4.7, 1.4], label: 'Versicolor' },
  { features: [6.4, 3.2, 4.5, 1.5], label: 'Versicolor' },
  { features: [6.9, 3.1, 4.9, 1.5], label: 'Versicolor' },
  { features: [7.1, 3.0, 5.9, 2.1], label: 'Virginica' },
  { features: [6.3, 3.3, 6.0, 2.5], label: 'Virginica' },
  { features: [6.5, 3.0, 5.8, 2.2], label: 'Virginica' },
];

function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
}

function predictIris(data: IrisData, k: number = 3): PredictionResult {
  const input = [data.sepalLength, data.sepalWidth, data.petalLength, data.petalWidth];
  
  const distances = trainingData.map(item => ({
    distance: euclideanDistance(input, item.features),
    label: item.label,
  }));
  
  distances.sort((a, b) => a.distance - b.distance);
  const neighbors = distances.slice(0, k);
  
  const votes: { [key: string]: number } = {};
  neighbors.forEach(neighbor => {
    votes[neighbor.label] = (votes[neighbor.label] || 0) + 1;
  });
  
  const species = Object.keys(votes).reduce((a, b) => 
    votes[a] > votes[b] ? a : b
  );
  
  const confidence = (votes[species] / k) * 100;
  
  const descriptions: { [key: string]: string } = {
    'Setosa': 'The Iris Setosa is a small, delicate iris with shorter petals and sepals. It\'s native to the Arctic regions and is known for its vibrant blue-purple flowers.',
    'Versicolor': 'The Iris Versicolor, or Blue Flag, is a medium-sized iris with moderate petal and sepal dimensions. It\'s commonly found in wetlands and marshes.',
    'Virginica': 'The Iris Virginica is the largest of the three species, with longer petals and sepals. It\'s native to the southeastern United States and displays deep purple hues.',
  };
  
  const images: { [key: string]: string } = {
    'Setosa': '/images/iris-setosa.png',
    'Versicolor': '/images/iris-versicolor.png',
    'Virginica': '/images/iris-virginica.png',
  };
  
  return {
    species,
    confidence: Math.round(confidence),
    description: descriptions[species] || 'Unknown species',
    image: images[species] || '',
  };
}

export default function Home() {
  // Use strings for input state to avoid decimal point issues in controlled components
  const [formData, setFormData] = useState({
    sepalLength: '5.8',
    sepalWidth: '3.0',
    petalLength: '4.3',
    petalWidth: '1.3',
  });
  
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Helper to get numeric data
  const getNumericData = (): IrisData => ({
    sepalLength: parseFloat(formData.sepalLength) || 0,
    sepalWidth: parseFloat(formData.sepalWidth) || 0,
    petalLength: parseFloat(formData.petalLength) || 0,
    petalWidth: parseFloat(formData.petalWidth) || 0,
  });

  const handleClassify = () => {
    setLoading(true);
    // Simulate processing delay
    setTimeout(() => {
      const prediction = predictIris(getNumericData());
      setResult(prediction);
      setLoading(false);
    }, 300);
  };

  // Perform initial classification on mount
  useEffect(() => {
    handleClassify();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormData({
      sepalLength: '5.8',
      sepalWidth: '3.0',
      petalLength: '4.3',
      petalWidth: '1.3',
    });
    // Re-classify with defaults
    setLoading(true);
    setTimeout(() => {
      const prediction = predictIris({
        sepalLength: 5.8,
        sepalWidth: 3.0,
        petalLength: 4.3,
        petalWidth: 1.3,
      });
      setResult(prediction);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-cream">
      {/* Header */}
      <header className="border-b border-border bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663483058610/GGeZGZRS8aFF5PZwK4cNvv/iris-logo-GKJbLJg8M6StwnTm3ik8h6.webp"
              alt="Iris Logo"
              className="w-8 h-8"
            />
            <h1 className="text-xl font-bold text-iris-purple">Iris Classifier</h1>
          </div>
          <p className="text-xs text-muted-foreground hidden sm:block">Powered by DecodeLabs</p>
        </div>
      </header>

      {/* Hero Section - Reduced padding for better visibility */}
      <section className="relative overflow-hidden py-8 sm:py-12 bg-white/30">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663483058610/GGeZGZRS8aFF5PZwK4cNvv/hero-botanical-bg-XKDMnpgtfuNbGJPeXfopJw.webp"
            alt="Botanical background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10 text-center sm:text-left">
          <div className="max-w-2xl mx-auto sm:mx-0">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-iris-purple">
              Discover Your Iris Species
            </h2>
            <p className="text-base text-deep-slate mb-2">
              Enter measurements and let our AI classify your flower instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Input Form */}
          <div className="space-y-6">
            <Card className="p-6 border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
              <form onSubmit={(e) => { e.preventDefault(); handleClassify(); }} className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-sage-green" />
                  <h3 className="text-xl font-semibold text-deep-slate">Flower Measurements</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Sepal Length */}
                  <div className="space-y-1.5">
                    <Label htmlFor="sepalLength" className="text-sm font-medium text-deep-slate">
                      Sepal Length (cm)
                    </Label>
                    <Input
                      id="sepalLength"
                      type="text"
                      inputMode="decimal"
                      value={formData.sepalLength}
                      onChange={(e) => handleInputChange('sepalLength', e.target.value)}
                      className="border-border focus:ring-iris-purple focus:border-iris-purple"
                      placeholder="e.g., 5.8"
                    />
                    <p className="text-[10px] text-muted-foreground">Range: 4.0 - 8.0 cm</p>
                  </div>

                  {/* Sepal Width */}
                  <div className="space-y-1.5">
                    <Label htmlFor="sepalWidth" className="text-sm font-medium text-deep-slate">
                      Sepal Width (cm)
                    </Label>
                    <Input
                      id="sepalWidth"
                      type="text"
                      inputMode="decimal"
                      value={formData.sepalWidth}
                      onChange={(e) => handleInputChange('sepalWidth', e.target.value)}
                      className="border-border focus:ring-iris-purple focus:border-iris-purple"
                      placeholder="e.g., 3.0"
                    />
                    <p className="text-[10px] text-muted-foreground">Range: 2.0 - 4.5 cm</p>
                  </div>

                  {/* Petal Length */}
                  <div className="space-y-1.5">
                    <Label htmlFor="petalLength" className="text-sm font-medium text-deep-slate">
                      Petal Length (cm)
                    </Label>
                    <Input
                      id="petalLength"
                      type="text"
                      inputMode="decimal"
                      value={formData.petalLength}
                      onChange={(e) => handleInputChange('petalLength', e.target.value)}
                      className="border-border focus:ring-iris-purple focus:border-iris-purple"
                      placeholder="e.g., 4.3"
                    />
                    <p className="text-[10px] text-muted-foreground">Range: 1.0 - 7.0 cm</p>
                  </div>

                  {/* Petal Width */}
                  <div className="space-y-1.5">
                    <Label htmlFor="petalWidth" className="text-sm font-medium text-deep-slate">
                      Petal Width (cm)
                    </Label>
                    <Input
                      id="petalWidth"
                      type="text"
                      inputMode="decimal"
                      value={formData.petalWidth}
                      onChange={(e) => handleInputChange('petalWidth', e.target.value)}
                      className="border-border focus:ring-iris-purple focus:border-iris-purple"
                      placeholder="e.g., 1.3"
                    />
                    <p className="text-[10px] text-muted-foreground">Range: 0.1 - 2.5 cm</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-iris-purple hover:bg-iris-purple/90 text-white font-semibold py-2.5 rounded-lg transition-all duration-200"
                  >
                    {loading ? 'Classifying...' : 'Classify Iris'}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1 border-border text-deep-slate hover:bg-muted py-2.5"
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <>
                {/* Main Result Card with Image */}
                <Card className="p-6 border-border shadow-lg bg-gradient-to-br from-white to-cream/50 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex flex-col gap-6">
                    {/* Species Header */}
                    <div className="flex items-start gap-4">
                      <Flower className="w-8 h-8 text-iris-purple flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-3xl font-bold text-iris-purple mb-1">
                          {result.species}
                        </h3>
                        <p className="text-sm text-sage-green font-semibold">
                          Confidence: {result.confidence}%
                        </p>
                      </div>
                    </div>

                    {/* Confidence Bar */}
                    <div>
                      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-iris-purple to-sage-green transition-all duration-700 ease-out"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Model confidence score</p>
                    </div>

                    {/* Iris Image */}
                    {result.image && (
                      <div className="flex justify-center py-4">
                        <div className="relative w-48 h-48 rounded-full border-4 border-iris-purple/20 bg-white/50 flex items-center justify-center overflow-hidden shadow-lg">
                          <img
                            src={result.image}
                            alt={result.species}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-sm text-deep-slate leading-relaxed">
                      {result.description}
                    </p>

                    {/* Species Info */}
                    <div className="bg-white/60 rounded-lg p-4 border border-border">
                      <h4 className="text-xs font-semibold text-deep-slate mb-3 uppercase tracking-wider">Measured Features:</h4>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                        <div className="flex justify-between border-b border-border/50 pb-1">
                          <span className="text-muted-foreground">Sepal L:</span>
                          <span className="font-semibold text-deep-slate">{formData.sepalLength} cm</span>
                        </div>
                        <div className="flex justify-between border-b border-border/50 pb-1">
                          <span className="text-muted-foreground">Sepal W:</span>
                          <span className="font-semibold text-deep-slate">{formData.sepalWidth} cm</span>
                        </div>
                        <div className="flex justify-between border-b border-border/50 pb-1">
                          <span className="text-muted-foreground">Petal L:</span>
                          <span className="font-semibold text-deep-slate">{formData.petalLength} cm</span>
                        </div>
                        <div className="flex justify-between border-b border-border/50 pb-1">
                          <span className="text-muted-foreground">Petal W:</span>
                          <span className="font-semibold text-deep-slate">{formData.petalWidth} cm</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-8 border-border shadow-lg bg-gradient-to-br from-white to-cream/50 flex flex-col items-center justify-center min-h-64">
                <Flower className="w-12 h-12 text-sage-green/30 mb-4" />
                <p className="text-center text-sm text-muted-foreground">
                  Click "Classify Iris" to see the prediction.
                </p>
              </Card>
            )}

            {/* Info Card */}
            <Card className="p-5 border-border shadow-md bg-white/80">
              <h4 className="font-semibold text-sm text-deep-slate mb-3">How It Works</h4>
              <ul className="space-y-2 text-xs text-deep-slate">
                <li className="flex gap-2">
                  <span className="text-iris-purple font-bold">1.</span>
                  <span>Enter the four measurements of your iris flower</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-iris-purple font-bold">2.</span>
                  <span>Our K-Nearest Neighbors model analyzes the data</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-iris-purple font-bold">3.</span>
                  <span>Get an instant classification with confidence level</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white/50 backdrop-blur-sm mt-8">
        <div className="container py-6 text-center text-[10px] text-muted-foreground">
          <p>Project 2: Data Classification Using AI | Powered by DecodeLabs</p>
          <p className="mt-1">Built with React, Tailwind CSS, and Machine Learning</p>
        </div>
      </footer>
    </div>
  );
}
