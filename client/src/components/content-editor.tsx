import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Send, FileText, Eye, Save, RotateCcw, Sparkles, 
  Type, Palette, Settings, Clock, Users, CheckCircle2 
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function ContentEditor() {
  const [contentType, setContentType] = useState("email");
  const [title, setTitle] = useState("Welcome to Sober Stay");
  const [subject, setSubject] = useState("Discover Safe Recovery Housing");
  const [body, setBody] = useState("Start your journey to recovery with supportive sober living communities...");
  const [preview, setPreview] = useState(false);

  const handleSave = () => {
    console.log("Saving content:", { contentType, title, subject, body });
  };

  const handleReset = () => {
    setTitle("");
    setSubject("");
    setBody("");
  };

  return (
    <Card className="bg-card border-border shadow-xl">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Content Editor
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Create engaging marketing content in minutes</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-border/50 rounded-lg p-1">
            <TabsTrigger value="editor" className="gap-2 data-[state=active]:bg-primary/20">
              <Type className="w-4 h-4" />
              <span className="hidden sm:inline">Editor</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2 data-[state=active]:bg-primary/20">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-primary/20">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label className="text-white font-semibold flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" />
                Content Type
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "email", label: "Email" },
                  { value: "sms", label: "SMS" },
                  { value: "blog", label: "Blog" }
                ].map(type => (
                  <button
                    key={type.value}
                    onClick={() => setContentType(type.value)}
                    className={`py-2 px-3 rounded-lg border transition-all text-sm font-medium ${
                      contentType === type.value
                        ? "bg-primary/20 border-primary/50 text-primary"
                        : "bg-white/5 border-border/50 text-muted-foreground hover:border-primary/30"
                    }`}
                    data-testid={`button-content-type-${type.value}`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-white font-semibold">Title</Label>
              <Input
                id="title"
                placeholder="Enter content title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white/5 border-border/50 text-white placeholder:text-muted-foreground/50"
                data-testid="input-content-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-white font-semibold">Subject Line</Label>
              <Input
                id="subject"
                placeholder="Enter email subject or headline..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-white/5 border-border/50 text-white placeholder:text-muted-foreground/50"
                data-testid="input-content-subject"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body" className="text-white font-semibold">Content Body</Label>
              <Textarea
                id="body"
                placeholder="Write your content here... You can use plain text or HTML."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="bg-white/5 border-border/50 text-white placeholder:text-muted-foreground/50 min-h-48 resize-none"
                data-testid="textarea-content-body"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
                data-testid="button-save-content"
              >
                <Save className="w-4 h-4" />
                Save Content
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 border-border/50 hover:bg-white/5 gap-2"
                data-testid="button-reset-content"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <div className="bg-gradient-to-br from-white/5 to-primary/5 rounded-lg p-6 border border-border/50 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{title || "Title here"}</h3>
                <p className="text-sm text-primary font-semibold mb-4">{subject || "Subject here"}</p>
              </div>
              <div className="prose prose-invert max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {body || "Content preview will appear here..."}
              </div>
              <div className="pt-4 border-t border-border/50 flex gap-2">
                <Button className="flex-1 bg-primary hover:bg-primary/90 gap-2" data-testid="button-send-preview">
                  <Send className="w-4 h-4" />
                  Send Now
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6 space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Schedule
              </h3>
              <div className="p-4 bg-white/5 border border-border/50 rounded-lg space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground">Send time</Label>
                  <Input type="datetime-local" className="bg-white/5 border-border/50 text-white mt-1" />
                </div>
                <Button variant="outline" className="w-full border-border/50 hover:bg-white/5">
                  Schedule for later
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" />
                Audience
              </h3>
              <div className="p-4 bg-white/5 border border-border/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-muted-foreground">2,847 interested prospects</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-muted-foreground">Previous applicants</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
