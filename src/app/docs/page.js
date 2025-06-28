"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Book, 
  Shield, 
  Cpu, 
  Code, 
  Monitor, 
  CreditCard, 
  ArrowRight, 
  CheckCircle, 
  Info,
  AlertTriangle,
  Copy,
  ExternalLink,
  Home,
  Zap,
  Clock,
  BarChart3,
  MessageSquare,
  Layers,
  Activity
} from "lucide-react";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("about");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const codeExample = `# user_submission.py

def process(input_data: str) -> dict:
    """
    Process input data and return structured results.
    """
    lines = input_data.splitlines()
    word_count = sum(len(line.split()) for line in lines)
    
    return {
        "lines": len(lines),
        "words": word_count,
    }`;

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'job-types', 'security', 'memory', 'code-sample', 'communication', 'monitoring', 'payment'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const navigationItems = [
    { id: "about", label: "About RunSurge", icon: Book },
    { id: "job-types", label: "Job Types", icon: Layers },
    { id: "security", label: "Security & Isolation", icon: Shield },
    { id: "memory", label: "Memory Estimation", icon: Cpu },
    { id: "code-sample", label: "Sample Code", icon: Code },
    { id: "communication", label: "Communication Layer", icon: MessageSquare },
    { id: "monitoring", label: "Monitoring", icon: Monitor },
    { id: "payment", label: "Payment Model", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <Book className="w-4 h-4" />
              <span className="text-sm font-medium">Documentation</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              RunSurge Documentation
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed max-w-3xl mx-auto">
              A comprehensive guide to the RunSurge parallel distributed platform
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-1/4">
          <div className="sticky top-8">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 border border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Contents
              </h3>
              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`group w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                        activeSection === item.id 
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25" 
                          : "hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${activeSection === item.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'} transition-colors duration-300`} />
                      <span className="font-medium text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 border border-slate-100">
              <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-blue-600" />
                Quick Links
              </h4>
              <div className="space-y-3">
                <Link
                  href="/"
                  className="group inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors duration-300"
                >
                  <Home className="w-4 h-4" />
                  <span className="text-sm">Back to Home</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors duration-300"
                >
                  <Info className="w-4 h-4" />
                  <span className="text-sm">About RunSurge</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <a
                  href="https://runsurge.ai/docs"
                  className="group inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm">Full Documentation</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            {/* About Section */}
            <section id="about" className="p-8 md:p-12 border-b border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-3">
                  <Book className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">About RunSurge</h2>
              </div>
              <p className="text-slate-700 text-lg leading-relaxed mb-6">
                RunSurge is a decentralized computing platform built for performance, security, and scalability. 
                It bridges the gap between users who need compute resources (Consumers) and those who provide them (Contributors), 
                allowing for efficient task execution at scale.
              </p>
              
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Key Features
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Parallel execution of compute-heavy tasks",
                    "Efficient data transfer using gRPC",
                    "Smart scheduling based on resource estimates and live monitoring",
                    "Secure and isolated environments for safe execution of user-submitted code"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Job Types Section */}
            <section id="job-types" className="p-8 md:p-12 border-b border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-3">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Job Types</h2>
              </div>
              <p className="text-slate-700 text-lg leading-relaxed mb-8">
                RunSurge supports two primary job modes to accommodate different processing needs:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-2">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">1. Single Jobs</h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Standalone data submission with a dedicated script. Ideal for one-off processing tasks or 
                    when you need to run a unique algorithm on specific data.
                  </p>
                </div>
                
                <div className="group bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border border-green-100 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-2">
                      <Layers className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">2. Grouped Jobs</h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    Multiple data inputs submitted across jobs with shared logic (the same Python script).
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    Includes built-in aggregation capabilities to summarize or analyze results collectively across the group.
                  </p>
                </div>
              </div>
            </section>

            {/* Security Section */}
            <section id="security" className="p-8 md:p-12 border-b border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-3">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Security & Isolation</h2>
              </div>
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-gradient-to-br from-green-100 to-emerald-50 rounded-2xl p-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-slate-700 text-lg">
                  RunSurge prioritizes security and isolation to protect both consumers and contributors.
                </p>
              </div>
              
              <div className="grid gap-6">
                {[
                  {
                    title: "Code Scanning",
                    description: "All submitted code is scanned using Semgrep before execution to detect potential security issues.",
                    icon: Code,
                    color: "from-blue-500 to-blue-600"
                  },
                  {
                    title: "Sandboxed Execution",
                    description: "Each job runs inside an isolated sandbox environment to ensure safety and prevent side effects.",
                    icon: Shield,
                    color: "from-green-500 to-green-600"
                  },
                  {
                    title: "Contributor Monitoring",
                    description: "Contributor nodes are monitored with heartbeats for liveness and log tracing to detect runtime issues or anomalies.",
                    icon: Activity,
                    color: "from-purple-500 to-purple-600"
                  }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200">
                      <div className="flex items-start gap-4">
                        <div className={`bg-gradient-to-br ${item.color} rounded-xl p-3 flex-shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                          <p className="text-slate-700 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Memory Estimation Section */}
            <section id="memory" className="p-8 md:p-12 border-b border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-3">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Memory Estimation & Scheduling</h2>
              </div>
              
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200 mb-6">
                <p className="text-slate-700 text-lg leading-relaxed mb-4">
                  We provide a memory estimator that predicts an upper bound for peak RAM usage. This estimation is used to 
                  intelligently assign tasks to contributor nodes with sufficient resources.
                </p>
                <p className="text-slate-700 text-lg leading-relaxed">
                  While current estimations are approximate, actual usage is tracked during execution for feedback and improvement.
                </p>
              </div>
              
              <div className="flex items-start gap-4 bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-2 flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Important Note</h4>
                  <p className="text-yellow-700">
                    When submitting jobs, be sure to provide a reasonable RAM estimate to ensure proper scheduling.
                  </p>
                </div>
              </div>
            </section>

            {/* Sample Code Section */}
            <section id="code-sample" className="p-8 md:p-12 border-b border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-3">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Sample Submission Code</h2>
              </div>
              <p className="text-slate-700 text-lg leading-relaxed mb-6">
                Here's a basic example of a user-submitted Python script:
              </p>
              
              <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/25 mb-6">
                <div className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-slate-300 text-sm font-medium">user_submission.py</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(codeExample)}
                    className="group flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-300"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400 group-hover:text-slate-300" />
                    )}
                    <span className="text-slate-300 text-sm">
                      {copied ? 'Copied!' : 'Copy'}
                    </span>
                  </button>
                </div>
                <pre className="p-6 text-slate-300 overflow-x-auto">
                  <code className="text-sm leading-relaxed">{codeExample}</code>
                </pre>
              </div>
              
              <div className="flex items-start gap-4 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-2 flex-shrink-0">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Required Function Signature</h4>
                  <p className="text-blue-700">
                    All scripts must implement a <code className="bg-blue-100 px-2 py-1 rounded text-blue-800 font-mono text-sm">process(input_data: str) -&gt; dict</code> function. 
                    The input is passed as a string, and the output must be a serializable dictionary.
                  </p>
                </div>
              </div>
            </section>

            {/* Communication Layer Section */}
            <section id="communication" className="p-8 md:p-12 border-b border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-3">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Communication Layer</h2>
              </div>
              <p className="text-slate-700 text-lg leading-relaxed mb-8">
                We use gRPC for all node-client communication, which provides several advantages:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Zap,
                    title: "High Throughput",
                    description: "Efficient data streaming for large datasets",
                    color: "from-yellow-500 to-orange-500"
                  },
                  {
                    icon: Clock,
                    title: "Low Latency",
                    description: "Optimized for heterogeneous networks",
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    icon: Shield,
                    title: "Strong Typing",
                    description: "Schema enforcement using Protocol Buffers",
                    color: "from-green-500 to-emerald-500"
                  }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`bg-gradient-to-br ${item.color} rounded-xl p-2 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-slate-800">{item.title}</h3>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Monitoring Section */}
            <section id="monitoring" className="p-8 md:p-12 border-b border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-3">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Monitoring</h2>
              </div>
              <p className="text-slate-700 text-lg leading-relaxed mb-8">
                Contributors are actively monitored through various mechanisms to ensure reliability and performance:
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    icon: Activity,
                    title: "Heartbeat Pings",
                    description: "Regular checks to ensure nodes are alive and responsive",
                    color: "from-green-500 to-emerald-600"
                  },
                  {
                    icon: BarChart3,
                    title: "Resource Logs",
                    description: "Periodic collection of resource usage data to analyze trends and detect failures",
                    color: "from-blue-500 to-cyan-600"
                  },
                  {
                    icon: Monitor,
                    title: "Task-Level Monitoring",
                    description: "Real-time tracking of CPU, memory, and execution duration for each task",
                    color: "from-purple-500 to-indigo-600"
                  }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`bg-gradient-to-br ${item.color} rounded-2xl p-4 flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="pt-1">
                        <h3 className="font-bold text-slate-800 mb-2 text-lg">{item.title}</h3>
                        <p className="text-slate-700 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Payment Model Section */}
            <section id="payment" className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-3">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Payment & Compensation Model</h2>
              </div>
              <p className="text-slate-700 text-lg leading-relaxed mb-8">
                RunSurge operates on a pay-per-resource model to ensure fairness and transparency for both Consumers and Contributors.
              </p>
              
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-violet-600" />
                  Consumer Billing
                </h3>
                <p className="text-slate-700 text-lg leading-relaxed mb-6">
                  Consumers are charged based on the actual resources consumed during job execution. The pricing model is defined by the formula:
                </p>
                
                <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-6 rounded-2xl mb-8 shadow-lg shadow-violet-500/25">
                  <p className="text-center font-bold text-white text-lg">
                    Cost = Average RAM Used (MB) × Execution Time (s) × Contributor Machine Factor
                  </p>
                </div>
                
                <h4 className="font-bold text-slate-800 mb-6 text-lg">Breakdown:</h4>
                <div className="space-y-4">
                  {[
                    {
                      title: "Average RAM Used",
                      description: "Measured throughout the job's execution."
                    },
                    {
                      title: "Execution Time",
                      description: "Total runtime from job start to completion."
                    },
                    {
                      title: "Contributor Machine Factor",
                      description: "A dynamic multiplier reflecting the computational capability of the machine running the job.",
                      details: [
                        "Machines with higher CPU, I/O, or RAM performance have higher factors.",
                        "The factor is referenced to a BASELINE machine to ensure standardization of all contributor resources in the platform.",
                        "This ensures faster, high-performance nodes are fairly rewarded."
                      ]
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-2 flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-800 mb-1">{item.title}:</h5>
                        <p className="text-slate-700 mb-2">{item.description}</p>
                        {item.details && (
                          <ul className="ml-4 space-y-1">
                            {item.details.map((detail, detailIndex) => (
                              <li key={detailIndex} className="text-slate-600 text-sm flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                                {detail}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}