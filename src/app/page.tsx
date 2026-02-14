"use client";

import { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  BarChart2,
  Lock,
  Zap,
  ChevronRight,
  Terminal,
  Upload,
  Image as ImageIcon,
  X,
  ScanEye,
  Fingerprint,
  Globe,
  Siren,
  Server,
  CloudLightning,
  Database,
  Cpu
} from "lucide-react";
import styles from "./page.module.css";
import Image from "next/image";

// --- Types ---
type Tab = 'web' | 'image' | 'enterprise';

interface AnalysisResult {
  type: 'text' | 'image' | 'web';
  score: number;
  verdict: string;
  classification?: string;

  reliability?: number;
  objectivity?: number;
  bias?: number;

  aiProbability?: number;
  realProbability?: number;
  confidenceScore?: number;

  explanation: string;
  reasoning?: string[];
  riskSignals?: string[];
  insights: string[];
}

const FORENSIC_EXPLANATIONS = {
  web_promotional: "The analysis detects High Promotional Intent. The content density is low, prioritizing Call-to-Action (CTA) elements over informational depth. The presence of affiliate markers and urgency semantics ('Buy now', 'Limited time') indicates a sales funnel rather than a credible source.",
  web_academic: "Domain authority matches verified academic institutions. Content contains high-density informational patterns, citations, and lack of commercial tracking scripts. Trust signals are strong.",
  ai_generated: "The image exhibits classic artifacts of diffusion-based synthesis. We detected statistically improbable shadow gradients and subtle warping in peripheral details (hands/fingers). Frequency domain analysis shows unnatural smoothness.",
  real_verified: "Forensic analysis of the noise distribution (PRNU) matches the signature of a standard optical sensor. Lighting directionality is consistent across all objects. No warping or generative artifacts detected."
};

const WEB_SCENARIOS = {
  promotional: {
    score: 35,
    verdict: "Low Credibility",
    classification: "Promotional / Commercial",
    explanation: FORENSIC_EXPLANATIONS.web_promotional,
    riskSignals: ["High CTA Density", "Affiliate Tracking Codes", "Urgency Tactics"],
    reasoning: ["Primary intent is conversion/sales.", "Lacks author attribution.", "Contains 'dark pattern' UI elements."]
  },
  academic: {
    score: 92,
    verdict: "High Credibility",
    classification: "Academic / Research Source",
    explanation: FORENSIC_EXPLANATIONS.web_academic,
    riskSignals: ["None Detected"],
    reasoning: ["Domain belongs to research network.", "Citations verified.", "Neutral language patterns."]
  },
  clickbait: {
    score: 45,
    verdict: "Exercise Caution",
    classification: "Clickbait / Ad-Farm",
    explanation: "Site structure is designed for ad-impression maximization. Content is shallow and sensationalized to drive clicks.",
    riskSignals: ["Sensationalist Headlines", "Ad-Heavy Layout"],
    reasoning: ["Headline-to-content mismatch.", "Excessive emotional triggers.", "Disposable Domain."]
  }
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('web');
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Tab Switching Logic
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setResult(null);
    setLogs([]);
    setContent("");
    setSelectedImage(null);
  };

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `> ${message}`]);
  };

  const handleAnalyze = async () => {
    if (activeTab === 'enterprise') return; // Enterprise is info-only
    if (!content.trim() && !selectedImage) return;

    setIsAnalyzing(true);
    setResult(null);
    setLogs([]);

    const mode = activeTab === 'image' ? 'image' : 'web';

    // Simulation Sequence
    addLog(`Initializing ${mode === 'web' ? 'Web Forensic' : 'Image Forensic'} Engine v4.0...`);
    await wait(400);

    if (mode === 'web') {
      addLog("Resolving domain reputation & WHOIS data...");
      await wait(600);
      addLog("Scanning for affiliate markers & commercial intent...");
      await wait(800);
      addLog("Analyzing content depth vs. ad density...");
      await wait(800);
    } else {
      addLog("Analyzing local image features (skin texture, lighting)...");
      await wait(800);
      addLog("Checking for diffusion artifacts & warped geometry...");
      await wait(800);
      addLog("Verifying metadata & PRNU noise signature...");
      await wait(600);
    }

    addLog("Synthesizing final probability matrix...");
    await wait(600);

    // Generate Result Logic
    let finalResult: AnalysisResult;

    if (mode === 'web') {
      const lower = content.toLowerCase();
      let scenario = WEB_SCENARIOS.clickbait;

      if (lower.includes('research') || lower.includes('edu') || lower.includes('science')) {
        scenario = WEB_SCENARIOS.academic;
      } else if (lower.includes('buy') || lower.includes('offer') || lower.includes('promo')) {
        scenario = WEB_SCENARIOS.promotional;
      }

      finalResult = {
        type: 'web',
        score: scenario.score,
        verdict: scenario.verdict,
        classification: scenario.classification,
        explanation: scenario.explanation,
        riskSignals: scenario.riskSignals,
        reasoning: scenario.reasoning,
        insights: scenario.reasoning,
        reliability: scenario.score,
        objectivity: Math.floor(scenario.score * 0.9),
        bias: 100 - scenario.score
      };
    } else {
      const randomSeed = Math.random();
      let aiProb = Math.floor(randomSeed * 30);
      let realProb = 100 - aiProb;
      let confidence = Math.floor(Math.random() * 15 + 85);
      let verdict = "Likely Authentic";
      let explanation = FORENSIC_EXPLANATIONS.real_verified;
      let score = realProb;
      let insights = ["Consistent noise patterns.", "Natural lighting physics.", "Metadata verified."];

      if (randomSeed > 0.6) {
        aiProb = Math.floor(Math.random() * 20 + 80);
        realProb = 100 - aiProb;
        score = realProb;
        verdict = "AI-Generated Media";
        explanation = FORENSIC_EXPLANATIONS.ai_generated;
        insights = ["Unnatural skin smoothing.", "Inconsistent shadows.", "Warping detected."];
      }

      finalResult = {
        type: 'image',
        score,
        verdict,
        aiProbability: aiProb,
        realProbability: realProb,
        confidenceScore: confidence,
        explanation,
        insights,
        reasoning: insights
      };
    }

    setResult(finalResult);
    setIsAnalyzing(false);
  };

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getColor = (score: number) => {
    if (score >= 80) return "#10b981";
    if (score >= 50) return "#f59e0b";
    return "#ef4444";
  };

  const CircleProgress = ({ score }: { score: number }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = getColor(score);

    return (
      <div className={styles.progressRing}>
        <svg className={styles.progressSvg}>
          <circle cx="90" cy="90" r={radius} className={styles.progressBg} />
          <circle
            cx="90" cy="90" r={radius}
            className={styles.progressFg}
            style={{
              stroke: color,
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              '--offset': offset
            } as React.CSSProperties}
          />
        </svg>
        <div className={styles.scoreValue}>
          <div className={styles.scoreNumber} style={{ color }}>{score}</div>
          <div className={styles.scoreLabel}>Trust Score</div>
        </div>
      </div>
    );
  };

  // Upload Handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setResult(null);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={styles.main}>
      <div className={styles.bgDecoration} />

      {/* Dynamic Header */}
      <header className={styles.header}>
        <div className={styles.logoContainer} onClick={() => window.location.reload()}>
          <div className={styles.logoIcon}>
            <ShieldCheck size={28} />
          </div>
          <span className={styles.logoText}>Authentix AI</span>
        </div>

        {/* Interactive Navigation Tabs */}
        <nav className={styles.navLinks}>
          <button
            onClick={() => handleTabChange('web')}
            className={`${styles.navTab} ${activeTab === 'web' ? styles.navTabActive : ''}`}
          >
            Web Forensics
          </button>
          <button
            onClick={() => handleTabChange('image')}
            className={`${styles.navTab} ${activeTab === 'image' ? styles.navTabActive : ''}`}
          >
            Image Scan
          </button>
          <button
            onClick={() => handleTabChange('enterprise')}
            className={`${styles.navTab} ${activeTab === 'enterprise' ? styles.navTabActive : ''}`}
          >
            Enterprise
          </button>
        </nav>

        <button className={styles.loginButton}>Console Login</button>
      </header>

      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroTag}>
          {activeTab === 'web' && <Globe size={16} />}
          {activeTab === 'image' && <ScanEye size={16} />}
          {activeTab === 'enterprise' && <Server size={16} />}
          <span>
            {activeTab === 'web' && "v4.0: Deep Web Verification Engine"}
            {activeTab === 'image' && "v4.0: Deepfake Detection Matrix"}
            {activeTab === 'enterprise' && "Enterprise Security Solutions"}
          </span>
        </div>
        <h1 className={styles.heroTitle}>
          {activeTab === 'web' && <>Verify The Truth <span className={styles.highlight}>Instantly</span></>}
          {activeTab === 'image' && <>Detect AI Art <span className={styles.highlight}>Forensically</span></>}
          {activeTab === 'enterprise' && <>Scale Trust <span className={styles.highlight}>Globally</span></>}
        </h1>
        <p className={styles.heroSubtitle}>
          {activeTab === 'web' && "Analyze domain intent, promotional bias, and hidden risks with our military-grade NLP engine."}
          {activeTab === 'image' && "Pixel-level analysis to expose deepfakes, diffusion artifacts, and metadata manipulation."}
          {activeTab === 'enterprise' && "API access, dedicated nodes, and custom models for high-volume content verification."}
        </p>
      </div>

      {/* Main Content Area */}
      <div className={styles.dashboard}>
        {activeTab === 'enterprise' ? (
          <div className={styles.enterpriseMode}>
            <div className={styles.enterpriseGrid}>
              {[
                { title: "Dedicated API Nodes", icon: <Server size={24} />, desc: "99.99% Uptime SLA with dedicated throughput for high-volume analysis." },
                { title: "Custom Model Training", icon: <BrainCircuitIcon />, desc: "Fine-tune our models on your specific industry data and edge cases." },
                { title: "Real-time Batch Processing", icon: <Database size={24} />, desc: "Process millions of URLs or images daily with asynchronous batch pipelines." },
                { title: "On-Premise Deployment", icon: <Lock size={24} />, desc: "Deploy Authentix within your own VPC for maximum data privacy and compliance." }
              ].map((item, i) => (
                <div key={i} className={styles.entCard}>
                  <div className={styles.entIcon}>{item.icon}</div>
                  <h3 className={styles.entTitle}>{item.title}</h3>
                  <p className={styles.entDesc}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Input Card */}
            <div className={`${styles.inputCard} ${isAnalyzing ? styles.scanning : ''}`}>
              <div className={styles.scanOverlay} />

              <div className={styles.inputHeader}>
                <h3 className={styles.inputTitle}>
                  {activeTab === 'web' ? <Search size={22} className="text-cyan-400" /> : <ScanEye size={22} className="text-purple-400" />}
                  {activeTab === 'web' ? "URL / Text Input" : "Media Upload"}
                </h3>
                <span className={styles.inputStatus}>
                  {isAnalyzing ? 'Scanning...' : 'Ready'}
                </span>
              </div>

              {/* Input Logic Based on Tab */}
              {activeTab === 'image' && !selectedImage && (
                <div
                  className={styles.uploadZone}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={32} style={{ marginBottom: '1rem', color: '#a78bfa' }} />
                  <p style={{ fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>Drop Image to Scan</p>
                  <p style={{ fontSize: '0.9rem' }}>Supports JPG, PNG, WEBP</p>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
              )}

              {activeTab === 'image' && selectedImage && (
                <div className={styles.previewContainer}>
                  <Image src={selectedImage} alt="Preview" fill className={styles.previewImage} />
                  <button onClick={clearImage} className={styles.removeImage}><X size={16} /></button>
                  <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', color: '#22d3ee', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                    Target Locked
                  </div>
                </div>
              )}

              {activeTab === 'web' && (
                <div className={styles.textareaWrapper}>
                  <textarea
                    className={styles.textarea}
                    placeholder="Paste URL (https://...) or article text to analyze..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isAnalyzing}
                  />
                </div>
              )}

              {/* Output Logs */}
              {isAnalyzing && (
                <div className={styles.processLog}>
                  {logs.map((log, i) => (
                    <div key={i} className={styles.logEntry}>
                      <div className={styles.spinner} />
                      <span>{log}</span>
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleAnalyze}
                className={styles.analyzeBtn}
                disabled={(activeTab === 'web' && !content.trim()) || (activeTab === 'image' && !selectedImage) || isAnalyzing}
              >
                {isAnalyzing ? "SYSTEM PROCESSING..." : (
                  <>INITIATE SCAN <Fingerprint size={20} /></>
                )}
              </button>
            </div>

            {/* Results Result */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {!result && !isAnalyzing && (
                <div className={styles.emptyState}>
                  <Cpu size={48} style={{ opacity: 0.5, marginBottom: '1.5rem' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#94a3b8' }}>Awaiting Input Data</h3>
                  <p style={{ maxWidth: '300px', margin: '1rem auto 0', fontSize: '0.9rem' }}>
                    Select target media or text to begin forensic probability analysis.
                  </p>
                </div>
              )}

              {result && (
                <div className={styles.resultCard}>
                  <div className={styles.scoreContainer}>
                    <CircleProgress score={result.score} />

                    <div className={styles.verdictBadge} style={{
                      color: getColor(result.score)
                    }}>
                      {result.score >= 60 ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                      {result.verdict}
                    </div>

                    {result.classification && (
                      <div className={styles.classificationBadge}>
                        {result.classification}
                      </div>
                    )}
                  </div>

                  {/* Findings */}
                  <div className={styles.findingsSection}>
                    {/* Generative Probability Viz */}
                    {result.type === 'image' && (
                      <div className={styles.probBox}>
                        <div className={styles.probHeader}>
                          <ScanEye size={14} /> Gen-AI Probability
                        </div>

                        <div className={styles.probRow}>
                          <div className={styles.probLabel}>
                            <span>Artificial / Deepfake</span>
                            <span style={{ color: '#f87171', fontFamily: 'monospace' }}>{result.aiProbability}%</span>
                          </div>
                          <div className={styles.probBarBg}>
                            <div className={styles.probBarFill} style={{ backgroundColor: '#ef4444', width: `${result.aiProbability}%` }} />
                          </div>
                        </div>

                        <div className={styles.probRow}>
                          <div className={styles.probLabel}>
                            <span>Authentic / Organic</span>
                            <span style={{ color: '#34d399', fontFamily: 'monospace' }}>{result.realProbability}%</span>
                          </div>
                          <div className={styles.probBarBg}>
                            <div className={styles.probBarFill} style={{ backgroundColor: '#10b981', width: `${result.realProbability}%` }} />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Explanation Box */}
                    <div className={styles.explanationBox}>
                      <div className={styles.explanationTitle}>
                        <Terminal size={14} /> Forensic Summary
                      </div>
                      <p className={styles.explanationText}>
                        {result.explanation}
                      </p>

                      {result.reasoning && (
                        <ul className={styles.reasoningList}>
                          {result.reasoning.map((r, i) => (
                            <li key={i} className={styles.reasoningItem}>
                              <div className={styles.bullet} />
                              {r}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function BrainCircuitIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
    </svg>
  )
}
