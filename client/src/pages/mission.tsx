import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users, Target } from "lucide-react";
import { Link } from "wouter";

export function Mission() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-primary/5 py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Building a Path to <span className="text-primary">Lasting Recovery</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our mission is to remove the barriers to safe, supportive housing for everyone in recovery. 
            We believe that a stable home is the foundation of a new life.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every decision we make is guided by these principles to ensure we serve our community with integrity and care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="w-10 h-10 text-primary" />,
                title: "Safety First",
                description: "We prioritize the physical and emotional safety of every resident above all else."
              },
              {
                icon: <Heart className="w-10 h-10 text-primary" />,
                title: "Empathy",
                description: "We understand the journey because we listen to those walking it. Compassion drives our innovation."
              },
              {
                icon: <Users className="w-10 h-10 text-primary" />,
                title: "Community",
                description: "Recovery doesn't happen in isolation. We build bridges between residents, providers, and support networks."
              },
              {
                icon: <Target className="w-10 h-10 text-primary" />,
                title: "Integrity",
                description: "We verify every home and maintain high standards to ensure trust in our platform."
              }
            ].map((value, i) => (
              <Card key={i} className="border-none shadow-lg bg-card/50 hover:bg-card transition-colors">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4 inline-flex p-3 rounded-full bg-primary/10">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-12 bg-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Us in Making a Difference</h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-6">
            Whether you're looking for a home or providing one, you are part of the solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse">
              <Button size="lg" variant="secondary" className="font-bold text-primary">
                Find a Home
              </Button>
            </Link>
            <Link href="/for-providers">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                Become a Partner
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
