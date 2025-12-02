import { Layout } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, LifeBuoy, ShieldAlert, MessageCircle, FileText, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export function Resources() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Recovery Resources</h1>
          <p className="text-xl text-muted-foreground">
            Tools, guides, and support to help you navigate your recovery journey and finding the right home.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Blog */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/blog">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <CardTitle>Recovery Blog</CardTitle>
                <CardDescription>
                  Articles on addiction, recovery tips, and sober living guides.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium text-primary flex items-center gap-2">
                  Read Articles <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Link>
          </Card>

          {/* Help Center */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/help-center">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <LifeBuoy className="w-6 h-6" />
                </div>
                <CardTitle>Help Center</CardTitle>
                <CardDescription>
                  FAQs and guides on how to use the Sober Stay platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium text-primary flex items-center gap-2">
                  Get Help <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Link>
          </Card>

          {/* Crisis Resources */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/crisis-resources">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <CardTitle>Crisis Support</CardTitle>
                <CardDescription>
                  Immediate help for medical emergencies and mental health crises.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium text-primary flex items-center gap-2">
                  Find Support <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Link>
          </Card>

          {/* Safety Reporting */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/safety-reporting">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <CardTitle>Safety Reporting</CardTitle>
                <CardDescription>
                  Report concerns about a listing or experience safely and anonymously.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium text-primary flex items-center gap-2">
                  File a Report <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Link>
          </Card>

          {/* Legal Documents */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group md:col-span-2 lg:col-span-2">
            <Link href="/terms-of-use">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <CardTitle>Legal & Policies</CardTitle>
                <CardDescription>
                  Review our Terms of Use, Privacy Policy, and Community Guidelines.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium text-primary flex items-center gap-2">
                  View Documents <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
