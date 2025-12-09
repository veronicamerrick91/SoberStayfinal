import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ArrowLeft, TrendingUp, Users, Eye, Download, Filter } from "lucide-react";
import { getAuth } from "@/lib/auth";
import { useEffect } from "react";

const viewsData = [
  { date: "Mon", views: 124, clicks: 32, applications: 8 },
  { date: "Tue", views: 234, clicks: 87, applications: 12 },
  { date: "Wed", views: 189, clicks: 54, applications: 9 },
  { date: "Thu", views: 412, clicks: 156, applications: 24 },
  { date: "Fri", views: 532, clicks: 201, applications: 35 },
  { date: "Sat", views: 289, clicks: 98, applications: 14 },
  { date: "Sun", views: 156, clicks: 42, applications: 6 }
];

const conversionData = [
  { name: "Applied", value: 156, fill: "#10b981" },
  { name: "Browsing", value: 782, fill: "#3b82f6" },
  { name: "Bounced", value: 412, fill: "#ef4444" }
];

const tenantDemoData = [
  { label: "Men", value: 45, fill: "#3b82f6" },
  { label: "Women", value: 35, fill: "#ec4899" },
  { label: "Non-binary", value: 20, fill: "#10b981" }
];

const topListings = [
  { name: "Serenity House Boston", views: 1247, clicks: 342, applications: 48, conversion: "3.8%" },
  { name: "Coastal Recovery Residence", views: 892, clicks: 201, applications: 35, conversion: "3.9%" },
  { name: "Worcester Wellness Home", views: 654, clicks: 156, applications: 18, conversion: "2.8%" },
  { name: "Hope Haven for Women", views: 512, clicks: 98, applications: 12, conversion: "2.3%" },
  { name: "New Beginnings Co-ed", views: 342, clicks: 87, applications: 8, conversion: "2.3%" }
];

export function Analytics() {
  const [location, setLocation] = useLocation();
  const user = getAuth();

  useEffect(() => {
    if (!user || user.role !== "provider") {
      setLocation("/for-providers");
    }
    window.scrollTo(0, 0);
  }, [user, setLocation]);

  const handleExportReport = () => {
    const today = new Date().toLocaleDateString();
    
    let csvContent = "Sober Stay Analytics Report\n";
    csvContent += `Generated: ${today}\n\n`;
    
    csvContent += "SUMMARY METRICS\n";
    csvContent += "Metric,Value,Change\n";
    csvContent += "Total Views,2847,+23%\n";
    csvContent += "Total Clicks,670,+18%\n";
    csvContent += "Applications,108,+31%\n";
    csvContent += "Conversion Rate,16.1%,+2.4%\n\n";
    
    csvContent += "WEEKLY PERFORMANCE\n";
    csvContent += "Day,Views,Clicks,Applications\n";
    viewsData.forEach(row => {
      csvContent += `${row.date},${row.views},${row.clicks},${row.applications}\n`;
    });
    csvContent += "\n";
    
    csvContent += "VISITOR FUNNEL\n";
    csvContent += "Status,Count\n";
    conversionData.forEach(row => {
      csvContent += `${row.name},${row.value}\n`;
    });
    csvContent += "\n";
    
    csvContent += "TOP PERFORMING LISTINGS\n";
    csvContent += "Listing Name,Views,Clicks,Applications,Conversion Rate\n";
    topListings.forEach(listing => {
      csvContent += `"${listing.name}",${listing.views},${listing.clicks},${listing.applications},${listing.conversion}\n`;
    });
    csvContent += "\n";
    
    csvContent += "TENANT DEMOGRAPHICS - GENDER\n";
    csvContent += "Gender,Percentage\n";
    tenantDemoData.forEach(row => {
      csvContent += `${row.label},${row.value}%\n`;
    });
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sober-stay-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/provider-dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics & Performance</h1>
            <p className="text-muted-foreground">Track your listings' performance and tenant engagement</p>
          </div>
          <div className="ml-auto">
            <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={handleExportReport} data-testid="button-export-report">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Total Views</p>
                  <h3 className="text-4xl font-bold text-white">2,847</h3>
                  <p className="text-xs text-emerald-400 mt-1">↑ 23% this week</p>
                </div>
                <Eye className="w-5 h-5 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Total Clicks</p>
                  <h3 className="text-4xl font-bold text-white">670</h3>
                  <p className="text-xs text-emerald-400 mt-1">↑ 18% this week</p>
                </div>
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Applications</p>
                  <h3 className="text-4xl font-bold text-white">108</h3>
                  <p className="text-xs text-emerald-400 mt-1">↑ 31% this week</p>
                </div>
                <Users className="w-5 h-5 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Conversion Rate</p>
                <h3 className="text-4xl font-bold text-white">16.1%</h3>
                <p className="text-xs text-amber-400 mt-1">↑ 2.4% this week</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Weekly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} />
                  <Line type="monotone" dataKey="views" stroke="#10b981" strokeWidth={2} name="Views" />
                  <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} name="Clicks" />
                  <Line type="monotone" dataKey="applications" stroke="#f59e0b" strokeWidth={2} name="Applications" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-white">Visitor Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={conversionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {conversionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {conversionData.map((item) => (
                  <div key={item.name} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="text-white font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Listings */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle className="text-white">Top Performing Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topListings.map((listing, i) => (
                <div key={i} className="p-4 bg-white/5 border border-border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-white">{listing.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">Conversion Rate: <span className="text-emerald-400 font-bold">{listing.conversion}</span></p>
                    </div>
                    {i === 0 && <span className="text-2xl">🥇</span>}
                    {i === 1 && <span className="text-2xl">🥈</span>}
                    {i === 2 && <span className="text-2xl">🥉</span>}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Views</p>
                      <p className="text-lg font-bold text-primary">{listing.views}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Clicks</p>
                      <p className="text-lg font-bold text-blue-400">{listing.clicks}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Applications</p>
                      <p className="text-lg font-bold text-green-400">{listing.applications}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tenant Demographics */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-white">Tenant Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-white mb-4">Gender</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={tenantDemoData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="label" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white">Age Groups</h3>
                {[
                  { label: "18-24", percentage: 22 },
                  { label: "25-34", percentage: 38 },
                  { label: "35-44", percentage: 24 },
                  { label: "45+", percentage: 16 }
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="text-white font-semibold">{item.percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white">Recovery Stage</h3>
                {[
                  { label: "Early (0-6 mo)", percentage: 45 },
                  { label: "Established (6mo-2yr)", percentage: 35 },
                  { label: "Long-term (2yr+)", percentage: 20 }
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground text-xs">{item.label}</span>
                      <span className="text-white font-semibold">{item.percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
