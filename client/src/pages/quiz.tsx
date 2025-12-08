import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, ArrowRight, Home, MapPin, DollarSign, Users, 
  Heart, Shield, Sparkles, CheckCircle, Star
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { MOCK_PROPERTIES } from "@/lib/mock-data";

interface QuizAnswers {
  budget: number;
  gender: string;
  location: string;
  roomType: string;
  matFriendly: boolean | null;
  petFriendly: boolean | null;
  lgbtqFriendly: boolean | null;
  faithBased: boolean | null;
  supervisionLevel: string;
}

const STEPS = [
  { id: "welcome", title: "Find Your Perfect Home" },
  { id: "budget", title: "What's your budget?" },
  { id: "gender", title: "Housing preference?" },
  { id: "location", title: "Where are you looking?" },
  { id: "room", title: "Room preference?" },
  { id: "support", title: "Support needs?" },
  { id: "lifestyle", title: "Lifestyle preferences?" },
  { id: "results", title: "Your Matches" },
];

const LOCATIONS = [
  { value: "boston", label: "Boston, MA" },
  { value: "cambridge", label: "Cambridge, MA" },
  { value: "worcester", label: "Worcester, MA" },
  { value: "anywhere", label: "Anywhere in MA" },
];

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    budget: 1500,
    gender: "",
    location: "",
    roomType: "",
    matFriendly: null,
    petFriendly: null,
    lgbtqFriendly: null,
    faithBased: null,
    supervisionLevel: "",
  });

  const progress = ((currentStep) / (STEPS.length - 1)) * 100;

  const goNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getRecommendedProperties = () => {
    return MOCK_PROPERTIES.map(property => {
      let score = 0;
      let matchReasons: string[] = [];

      if (property.price <= answers.budget) {
        score += 30;
        matchReasons.push("Within budget");
      } else if (property.price <= answers.budget * 1.1) {
        score += 15;
        matchReasons.push("Slightly above budget");
      }

      if (answers.gender === "any" || property.gender.toLowerCase().includes(answers.gender.toLowerCase()) || property.gender === "Co-ed") {
        score += 20;
        matchReasons.push("Gender match");
      }

      if (answers.location === "anywhere" || property.city.toLowerCase().includes(answers.location.toLowerCase())) {
        score += 20;
        matchReasons.push("Location match");
      }

      if (answers.roomType === "any" || property.roomType.toLowerCase().includes(answers.roomType.toLowerCase())) {
        score += 10;
        matchReasons.push("Room type match");
      }

      if (answers.matFriendly === true && property.isMatFriendly) {
        score += 10;
        matchReasons.push("MAT-friendly");
      }

      if (answers.petFriendly === true && property.isPetFriendly) {
        score += 5;
        matchReasons.push("Pet-friendly");
      }

      if (answers.lgbtqFriendly === true && property.isLgbtqFriendly) {
        score += 5;
        matchReasons.push("LGBTQ+-friendly");
      }

      if (answers.faithBased === true && property.isFaithBased) {
        score += 5;
        matchReasons.push("Faith-based");
      } else if (answers.faithBased === false && !property.isFaithBased) {
        score += 5;
        matchReasons.push("Secular program");
      }

      if (answers.supervisionLevel) {
        if (property.supervisionType.toLowerCase().includes(answers.supervisionLevel.toLowerCase())) {
          score += 10;
          matchReasons.push("Supervision level match");
        }
      }

      return { ...property, score, matchReasons };
    })
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score);
  };

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case "welcome":
        return (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">Find Your Perfect Sober Living Home</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Answer a few quick questions and we'll recommend homes that match your needs, budget, and preferences.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <Badge variant="outline" className="text-sm py-1 px-3">
                <DollarSign className="w-3 h-3 mr-1" /> Budget-Friendly
              </Badge>
              <Badge variant="outline" className="text-sm py-1 px-3">
                <MapPin className="w-3 h-3 mr-1" /> Location-Based
              </Badge>
              <Badge variant="outline" className="text-sm py-1 px-3">
                <Heart className="w-3 h-3 mr-1" /> Personalized
              </Badge>
            </div>
            <Button onClick={goNext} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4" data-testid="button-start-quiz">
              Start Quiz <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case "budget":
        return (
          <div className="space-y-8 py-6">
            <div className="text-center space-y-2">
              <DollarSign className="w-12 h-12 mx-auto text-primary" />
              <h2 className="text-2xl font-bold text-white">What's your monthly budget?</h2>
              <p className="text-muted-foreground">We'll find homes within your price range</p>
            </div>
            <div className="space-y-6 max-w-md mx-auto">
              <div className="text-center">
                <span className="text-4xl font-bold text-primary">${answers.budget}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <Slider
                value={[answers.budget]}
                onValueChange={(value) => setAnswers({ ...answers, budget: value[0] })}
                min={500}
                max={3000}
                step={100}
                className="w-full"
                data-testid="slider-budget"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>$500</span>
                <span>$3,000</span>
              </div>
            </div>
          </div>
        );

      case "gender":
        return (
          <div className="space-y-8 py-6">
            <div className="text-center space-y-2">
              <Users className="w-12 h-12 mx-auto text-primary" />
              <h2 className="text-2xl font-bold text-white">What type of housing do you prefer?</h2>
              <p className="text-muted-foreground">Select your housing preference</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { value: "men", label: "Men's Housing", icon: "👨" },
                { value: "women", label: "Women's Housing", icon: "👩" },
                { value: "any", label: "Co-ed / Any", icon: "👥" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAnswers({ ...answers, gender: option.value })}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    answers.gender === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 bg-white/5"
                  }`}
                  data-testid={`button-gender-${option.value}`}
                >
                  <div className="text-4xl mb-2">{option.icon}</div>
                  <p className="font-medium text-white">{option.label}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case "location":
        return (
          <div className="space-y-8 py-6">
            <div className="text-center space-y-2">
              <MapPin className="w-12 h-12 mx-auto text-primary" />
              <h2 className="text-2xl font-bold text-white">Where are you looking to live?</h2>
              <p className="text-muted-foreground">Select your preferred area or search by zip code</p>
            </div>
            
            {/* Zip Code Search */}
            <div className="max-w-xl mx-auto space-y-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search by zip code..." 
                  value={answers.location.match(/^\d+$/) ? answers.location : ""}
                  onChange={(e) => {
                    const zipCode = e.target.value.replace(/\D/g, '');
                    if (zipCode.length <= 5) {
                      setAnswers({ ...answers, location: zipCode });
                    }
                  }}
                  className="pl-10 h-12 bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                  data-testid="input-zipcode"
                  maxLength={5}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {answers.location.match(/^\d+$/) ? `Searching for homes in zip code: ${answers.location}` : "Enter a 5-digit zip code"}
              </p>
            </div>

            {/* Predefined Locations */}
            <div className="space-y-3 max-w-xl mx-auto">
              <p className="text-sm text-muted-foreground text-center">Or select from popular areas</p>
              <div className="grid grid-cols-2 gap-4">
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc.value}
                    onClick={() => setAnswers({ ...answers, location: loc.value })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      answers.location === loc.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 bg-white/5"
                    }`}
                    data-testid={`button-location-${loc.value}`}
                  >
                    <MapPin className={`w-5 h-5 mx-auto mb-2 ${answers.location === loc.value ? "text-primary" : "text-muted-foreground"}`} />
                    <p className="font-medium text-white text-sm">{loc.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "room":
        return (
          <div className="space-y-8 py-6">
            <div className="text-center space-y-2">
              <Home className="w-12 h-12 mx-auto text-primary" />
              <h2 className="text-2xl font-bold text-white">Room preference?</h2>
              <p className="text-muted-foreground">Private rooms cost more but offer more privacy</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { value: "private", label: "Private Room", desc: "Your own space", icon: "🚪" },
                { value: "shared", label: "Shared Room", desc: "More affordable", icon: "👥" },
                { value: "any", label: "No Preference", desc: "Either works", icon: "✨" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAnswers({ ...answers, roomType: option.value })}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    answers.roomType === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 bg-white/5"
                  }`}
                  data-testid={`button-room-${option.value}`}
                >
                  <div className="text-3xl mb-2">{option.icon}</div>
                  <p className="font-medium text-white">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case "support":
        return (
          <div className="space-y-8 py-6">
            <div className="text-center space-y-2">
              <Shield className="w-12 h-12 mx-auto text-primary" />
              <h2 className="text-2xl font-bold text-white">What support do you need?</h2>
              <p className="text-muted-foreground">Select all that apply</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              {[
                { key: "matFriendly", label: "MAT-Friendly", desc: "Medication-assisted treatment supported" },
                { key: "petFriendly", label: "Pet-Friendly", desc: "Bring your companion animal" },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setAnswers({ ...answers, [option.key]: answers[option.key as keyof QuizAnswers] === true ? null : true })}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    answers[option.key as keyof QuizAnswers] === true
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 bg-white/5"
                  }`}
                  data-testid={`button-support-${option.key}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[option.key as keyof QuizAnswers] === true ? "border-primary bg-primary" : "border-muted-foreground"
                    }`}>
                      {answers[option.key as keyof QuizAnswers] === true && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                      <p className="font-medium text-white">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{option.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="max-w-xl mx-auto">
              <p className="text-sm text-muted-foreground text-center mb-3">Supervision level preference?</p>
              <div className="grid grid-cols-3 gap-2">
                {["supervised", "monitored", "peer-run"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setAnswers({ ...answers, supervisionLevel: answers.supervisionLevel === level ? "" : level })}
                    className={`p-3 rounded-lg border transition-all capitalize ${
                      answers.supervisionLevel === level
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50 text-muted-foreground"
                    }`}
                    data-testid={`button-supervision-${level}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "lifestyle":
        return (
          <div className="space-y-8 py-6">
            <div className="text-center space-y-2">
              <Heart className="w-12 h-12 mx-auto text-primary" />
              <h2 className="text-2xl font-bold text-white">Lifestyle preferences?</h2>
              <p className="text-muted-foreground">Help us find your ideal community</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              {[
                { key: "lgbtqFriendly", label: "LGBTQ+-Friendly", desc: "Inclusive environment" },
                { key: "faithBased", label: "Faith-Based Program", desc: "Spiritual focus" },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setAnswers({ ...answers, [option.key]: answers[option.key as keyof QuizAnswers] === true ? null : true })}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    answers[option.key as keyof QuizAnswers] === true
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 bg-white/5"
                  }`}
                  data-testid={`button-lifestyle-${option.key}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[option.key as keyof QuizAnswers] === true ? "border-primary bg-primary" : "border-muted-foreground"
                    }`}>
                      {answers[option.key as keyof QuizAnswers] === true && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                      <p className="font-medium text-white">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{option.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="max-w-xl mx-auto pt-2">
              <button
                onClick={() => setAnswers({ ...answers, lgbtqFriendly: null, faithBased: null })}
                className={`w-full p-4 rounded-xl border-2 transition-all text-center ${
                  answers.lgbtqFriendly === null && answers.faithBased === null
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 bg-white/5"
                }`}
                data-testid="button-lifestyle-no-preference"
              >
                <p className="font-medium text-white">No Preference</p>
              </button>
            </div>
          </div>
        );

      case "results":
        const recommendations = getRecommendedProperties();
        return (
          <div className="space-y-6 py-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white">Your Recommended Homes</h2>
              <p className="text-muted-foreground">
                We found {recommendations.length} homes matching your preferences
              </p>
            </div>

            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20 max-w-2xl mx-auto">
              <p className="text-sm text-white font-medium mb-2">Your Preferences:</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Budget: ${answers.budget}/mo</Badge>
                {answers.gender && <Badge variant="outline">{answers.gender === "any" ? "Any Gender" : answers.gender + "'s"}</Badge>}
                {answers.location && <Badge variant="outline">{LOCATIONS.find(l => l.value === answers.location)?.label || answers.location}</Badge>}
                {answers.roomType && <Badge variant="outline">{answers.roomType} room</Badge>}
                {answers.matFriendly && <Badge variant="outline">MAT-Friendly</Badge>}
                {answers.petFriendly && <Badge variant="outline">Pet-Friendly</Badge>}
                {answers.lgbtqFriendly && <Badge variant="outline">LGBTQ+-Friendly</Badge>}
                {answers.faithBased && <Badge variant="outline">Faith-Based</Badge>}
                {answers.supervisionLevel && <Badge variant="outline">{answers.supervisionLevel}</Badge>}
              </div>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              {recommendations.slice(0, 5).map((property, index) => (
                <Card 
                  key={property.id} 
                  className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => setLocation(`/property/${property.id}`)}
                  data-testid={`result-property-${property.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                        <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              {index === 0 && <Badge className="bg-primary text-primary-foreground">Best Match</Badge>}
                              <h3 className="font-bold text-white">{property.name}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {property.city}, {property.state}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">${property.price}</p>
                            <p className="text-xs text-muted-foreground">/month</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {property.matchReasons.slice(0, 3).map((reason, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" /> {reason}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-3 justify-center pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(0)} data-testid="button-retake-quiz">
                Retake Quiz
              </Button>
              <Button onClick={() => setLocation("/browse")} className="bg-primary text-primary-foreground" data-testid="button-browse-all">
                Browse All Homes
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (STEPS[currentStep].id) {
      case "welcome":
        return true;
      case "budget":
        return answers.budget > 0;
      case "gender":
        return answers.gender !== "";
      case "location":
        return answers.location !== "";
      case "room":
        return answers.roomType !== "";
      case "support":
        return true;
      case "lifestyle":
        return true;
      default:
        return true;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          {currentStep > 0 && currentStep < STEPS.length - 1 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Step {currentStep} of {STEPS.length - 2}</span>
                <span className="text-sm text-primary font-medium">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <Card className="bg-card border-border">
            <CardContent className="p-6 md:p-8">
              {renderStep()}

              {currentStep > 0 && currentStep < STEPS.length - 1 && (
                <div className="flex justify-between pt-6 border-t border-border mt-6">
                  <Button variant="outline" onClick={goBack} data-testid="button-back">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button 
                    onClick={goNext} 
                    disabled={!canProceed()}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-next"
                  >
                    {currentStep === STEPS.length - 2 ? "See Results" : "Next"} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
