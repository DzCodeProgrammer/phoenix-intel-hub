import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Globe, Hash } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface ScanResult {
  engine: string;
  status: "clean" | "malicious" | "suspicious" | "undetected";
  signature?: string;
}

const Analysis = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const artifact = searchParams.get("artifact") || "";
  const type = searchParams.get("type") || "file";
  
  const [progress, setProgress] = useState(0);
  const [scanning, setScanning] = useState(true);
  const [results, setResults] = useState<ScanResult[]>([]);

  useEffect(() => {
    // Simulate scanning process
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Generate mock results
    setTimeout(() => {
      const engines = [
        "ClamAV", "BitDefender", "Kaspersky", "McAfee", "Norton",
        "Avast", "AVG", "Sophos", "TrendMicro", "F-Secure",
        "ESET", "Malwarebytes", "Windows Defender", "Panda", "Comodo"
      ];
      
      const mockResults: ScanResult[] = engines.map((engine) => {
        const rand = Math.random();
        if (artifact.includes("malware") || artifact.includes("virus")) {
          return {
            engine,
            status: rand > 0.3 ? "malicious" : "suspicious",
            signature: rand > 0.3 ? "Trojan.Generic.KD.12345" : undefined
          };
        }
        return {
          engine,
          status: rand > 0.9 ? "suspicious" : "clean"
        };
      });
      
      setResults(mockResults);
    }, 3000);

    return () => clearInterval(interval);
  }, [artifact]);

  const maliciousCount = results.filter(r => r.status === "malicious").length;
  const suspiciousCount = results.filter(r => r.status === "suspicious").length;
  const cleanCount = results.filter(r => r.status === "clean").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "malicious":
        return <Badge className="bg-destructive">{status}</Badge>;
      case "suspicious":
        return <Badge className="bg-warning text-warning-foreground">{status}</Badge>;
      case "clean":
        return <Badge className="bg-success">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Phoenix</span>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              New Scan
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8 p-6 shadow-card">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              {type === "url" ? (
                <Globe className="h-6 w-6 text-primary" />
              ) : (
                <FileText className="h-6 w-6 text-primary" />
              )}
              <h1 className="text-2xl font-bold">{type === "url" ? "URL Analysis" : "File Analysis"}</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Hash className="h-4 w-4" />
              <span className="font-mono">{artifact}</span>
            </div>
          </div>

          {scanning ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary animate-spin" />
                <span className="text-lg">Scanning with {results.length || 15} engines...</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-destructive/10 border-destructive/20">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                  <div>
                    <div className="text-3xl font-bold">{maliciousCount}</div>
                    <div className="text-sm text-muted-foreground">Malicious</div>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-warning/10 border-warning/20">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-warning" />
                  <div>
                    <div className="text-3xl font-bold">{suspiciousCount}</div>
                    <div className="text-sm text-muted-foreground">Suspicious</div>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-success/10 border-success/20">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-success" />
                  <div>
                    <div className="text-3xl font-bold">{cleanCount}</div>
                    <div className="text-sm text-muted-foreground">Clean</div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </Card>

        {!scanning && (
          <Tabs defaultValue="detections" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="detections">Detections</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="behavior">Behavior</TabsTrigger>
            </TabsList>

            <TabsContent value="detections" className="space-y-4">
              <Card className="p-6 shadow-card">
                <h2 className="text-xl font-semibold mb-4">Security Vendor Analysis</h2>
                <div className="space-y-3">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border hover:bg-secondary/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-primary" />
                        <span className="font-medium">{result.engine}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {result.signature && (
                          <span className="text-sm text-muted-foreground font-mono">{result.signature}</span>
                        )}
                        {getStatusBadge(result.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="details">
              <Card className="p-6 shadow-card">
                <h2 className="text-xl font-semibold mb-4">Artifact Details</h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">SHA-256</div>
                      <div className="font-mono text-sm break-all">{artifact}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">File Type</div>
                      <div className="font-mono text-sm">PE32 Executable</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Size</div>
                      <div className="font-mono text-sm">2.4 MB</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">First Seen</div>
                      <div className="font-mono text-sm">{new Date().toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="behavior">
              <Card className="p-6 shadow-card">
                <h2 className="text-xl font-semibold mb-4">Behavioral Analysis</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <h3 className="font-semibold mb-2">Network Activity</h3>
                    <p className="text-sm text-muted-foreground">No suspicious network connections detected</p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <h3 className="font-semibold mb-2">File System</h3>
                    <p className="text-sm text-muted-foreground">Standard file operations observed</p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <h3 className="font-semibold mb-2">Registry</h3>
                    <p className="text-sm text-muted-foreground">No registry modifications detected</p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Analysis;
