import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Upload, Link as LinkIcon, Search, FileText, Globe, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [hashInput, setHashInput] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileInput(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  const handleAnalyze = (type: "file" | "url" | "hash") => {
    let artifact = "";
    
    if (type === "file" && fileInput) {
      artifact = `file_${fileInput.name}_${Date.now()}`;
    } else if (type === "url" && urlInput) {
      artifact = btoa(urlInput);
    } else if (type === "hash" && hashInput) {
      artifact = hashInput;
    } else {
      toast.error("Please provide input to analyze");
      return;
    }

    navigate(`/analysis?artifact=${artifact}&type=${type}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="h-16 w-16 text-primary drop-shadow-glow" />
              <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Phoenix
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8">
              Advanced Threat Intelligence & Malware Analysis Platform
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>15+ Engines</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Real-time Analysis</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>Threat Intelligence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Submission Section */}
      <section className="container mx-auto px-4 py-12">
        <Card className="max-w-3xl mx-auto p-8 shadow-card border-2">
          <Tabs defaultValue="file" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="file" className="gap-2">
                <Upload className="h-4 w-4" />
                File
              </TabsTrigger>
              <TabsTrigger value="url" className="gap-2">
                <LinkIcon className="h-4 w-4" />
                URL
              </TabsTrigger>
              <TabsTrigger value="search" className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer bg-secondary/20">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">
                    {fileInput ? fileInput.name : "Choose file or drag it here"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Maximum file size: 650 MB
                  </p>
                </label>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => handleAnalyze("file")}
                disabled={!fileInput}
              >
                Analyze File
              </Button>
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="url-input" className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Enter URL to scan
                </label>
                <Input
                  id="url-input"
                  type="url"
                  placeholder="https://example.com"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="h-12"
                />
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => handleAnalyze("url")}
                disabled={!urlInput}
              >
                Analyze URL
              </Button>
            </TabsContent>

            <TabsContent value="search" className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="hash-input" className="text-sm font-medium flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search by hash (SHA-256, SHA-1, MD5)
                </label>
                <Input
                  id="hash-input"
                  type="text"
                  placeholder="Enter file hash..."
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  className="h-12 font-mono"
                />
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => handleAnalyze("hash")}
                disabled={!hashInput}
              >
                Search
              </Button>
            </TabsContent>
          </Tabs>
        </Card>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="p-6 bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Multi-Engine Scanning</h3>
            <p className="text-sm text-muted-foreground">
              Leverage 15+ antivirus engines and threat intelligence feeds for comprehensive analysis
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Threat Intelligence</h3>
            <p className="text-sm text-muted-foreground">
              Access historical data and correlation with known indicators of compromise
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-colors">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Advanced Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Static and dynamic analysis with detailed behavioral reports
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">Phoenix</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Advanced Threat Intelligence Platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
