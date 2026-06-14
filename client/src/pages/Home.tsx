import { useState } from 'react';
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
  
  return {
    species,
    confidence: Math.round(confidence),
    description: descriptions[species] || 'Unknown species',
  };
}

export default function Home() {
  const [formData, setFormData] = useState<IrisData>({
    sepalLength: 5.8,
    sepalWidth: 3.0,
    petalLength: 4.3,
    petalWidth: 1.3,
  });
  
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof IrisData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, [field]: numValue }));
  };

  const handleClassify = () => {
    setLoading(true);
    // Simulate processing delay
    setTimeout(() => {
      const prediction = predictIris(formData);
      setResult(prediction);
      setLoading(false);
    }, 500);
  };

  const handleReset = () => {
    setFormData({
      sepalLength: 5.8,
      sepalWidth: 3.0,
      petalLength: 4.3,
      petalWidth: 1.3,
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-cream">
      {/* Header */}
      <header className="border-b border-border bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663483058610/GGeZGZRS8aFF5PZwK4cNvv/iris-logo-GKJbLJg8M6StwnTm3ik8h6.webp"
              alt="Iris Logo"
              className="w-10 h-10"
            />
            <h1 className="text-2xl font-bold text-iris-purple">Iris Classifier</h1>
          </div>
          <p className="text-sm text-muted-foreground">Powered by DecodeLabs</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663483058610/GGeZGZRS8aFF5PZwK4cNvv/hero-botanical-bg-XKDMnpgtfuNbGJPeXfopJw.webp"
            alt="Botanical background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-bold mb-4 text-iris-purple">
              Discover Your Iris Species
            </h2>
            <p className="text-lg text-deep-slate mb-2">
              Enter the measurements of an iris flower and let our AI model classify it using supervised learning.
            </p>
            <p className="text-base text-muted-foreground">
              Trained on the classic Iris dataset, our K-Nearest Neighbors classifier identifies three species: Setosa, Versicolor, and Virginica.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6 flex flex-col">
            <Card className="p-8 border-border shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <Leaf className="w-5 h-5 text-sage-green" />
                <h3 className="text-2xl font-semibold text-deep-slate">Flower Measurements</h3>
              </div>
              
              <div className="space-y-5">
                {/* Sepal Length */}
                <div className="space-y-2">
                  <Label htmlFor="sepalLength" className="text-base font-medium text-deep-slate">
                    Sepal Length (cm)
                  </Label>
                  <Input
                    id="sepalLength"
                    type="number"
                    step="0.1"
                    min="4"
                    max="8"
                    value={formData.sepalLength}
                    onChange={(e) => handleInputChange('sepalLength', e.target.value)}
                    className="border-border focus:ring-iris-purple focus:border-iris-purple"
                    placeholder="e.g., 5.8"
                  />
                  <p className="text-xs text-muted-foreground">Range: 4.0 - 8.0 cm</p>
                </div>

                {/* Sepal Width */}
                <div className="space-y-2">
                  <Label htmlFor="sepalWidth" className="text-base font-medium text-deep-slate">
                    Sepal Width (cm)
                  </Label>
                  <Input
                    id="sepalWidth"
                    type="number"
                    step="0.1"
                    min="2"
                    max="4.5"
                    value={formData.sepalWidth}
                    onChange={(e) => handleInputChange('sepalWidth', e.target.value)}
                    className="border-border focus:ring-iris-purple focus:border-iris-purple"
                    placeholder="e.g., 3.0"
                  />
                  <p className="text-xs text-muted-foreground">Range: 2.0 - 4.5 cm</p>
                </div>

                {/* Petal Length */}
                <div className="space-y-2">
                  <Label htmlFor="petalLength" className="text-base font-medium text-deep-slate">
                    Petal Length (cm)
                  </Label>
                  <Input
                    id="petalLength"
                    type="number"
                    step="0.1"
                    min="1"
                    max="7"
                    value={formData.petalLength}
                    onChange={(e) => handleInputChange('petalLength', e.target.value)}
                    className="border-border focus:ring-iris-purple focus:border-iris-purple"
                    placeholder="e.g., 4.3"
                  />
                  <p className="text-xs text-muted-foreground">Range: 1.0 - 7.0 cm</p>
                </div>

                {/* Petal Width */}
                <div className="space-y-2">
                  <Label htmlFor="petalWidth" className="text-base font-medium text-deep-slate">
                    Petal Width (cm)
                  </Label>
                  <Input
                    id="petalWidth"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="2.5"
                    value={formData.petalWidth}
                    onChange={(e) => handleInputChange('petalWidth', e.target.value)}
                    className="border-border focus:ring-iris-purple focus:border-iris-purple"
                    placeholder="e.g., 1.3"
                  />
                  <p className="text-xs text-muted-foreground">Range: 0.1 - 2.5 cm</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-auto pt-8 border-t border-border">
                <Button
                  onClick={handleClassify}
                  disabled={loading}
                  className="flex-1 bg-iris-purple hover:bg-iris-purple/90 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-98"
                >
                  {loading ? 'Classifying...' : 'Classify Iris'}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 border-border text-deep-slate hover:bg-muted py-3"
                >
                  Reset
                </Button>
              </div>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <Card className="p-8 border-border shadow-lg bg-gradient-to-br from-white to-cream/50 animate-in fade-in duration-500">
                <div className="flex items-start gap-4 mb-6">
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
                <div className="mb-6">
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-iris-purple to-sage-green transition-all duration-500"
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                </div>

                {/* Description */}
                <p className="text-base text-deep-slate leading-relaxed mb-6">
                  {result.description}
                </p>

                {/* Species Info */}
                <div className="bg-white/60 rounded-lg p-4 border border-border">
                  <h4 className="font-semibold text-deep-slate mb-3">Measured Features:</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Sepal Length</p>
                      <p className="font-semibold text-deep-slate">{formData.sepalLength} cm</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sepal Width</p>
                      <p className="font-semibold text-deep-slate">{formData.sepalWidth} cm</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Petal Length</p>
                      <p className="font-semibold text-deep-slate">{formData.petalLength} cm</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Petal Width</p>
                      <p className="font-semibold text-deep-slate">{formData.petalWidth} cm</p>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-8 border-border shadow-lg bg-gradient-to-br from-white to-cream/50 flex flex-col items-center justify-center min-h-96">
                <Flower className="w-16 h-16 text-sage-green/30 mb-4" />
                <p className="text-center text-muted-foreground">
                  Enter flower measurements and click "Classify Iris" to see the prediction.
                </p>
              </Card>
            )}

            {/* Info Card */}
            <Card className="p-6 border-border shadow-md bg-white/80">
              <h4 className="font-semibold text-deep-slate mb-3">How It Works</h4>
              <ul className="space-y-2 text-sm text-deep-slate">
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
      <footer className="border-t border-border bg-white/50 backdrop-blur-sm mt-16">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>Project 2: Data Classification Using AI | Powered by DecodeLabs</p>
          <p className="mt-2">Built with React, Tailwind CSS, and Machine Learning</p>
        </div>
      </footer>
    </div>
  );
}
