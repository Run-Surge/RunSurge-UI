"use client";

import Link from "next/link";
import { 
  Zap, 
  Shield, 
  BarChart3, 
  CreditCard, 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Cpu,
  Globe,
  Sparkles
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Hybrid Computing Platform</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              About RunSurge
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed max-w-3xl mx-auto">
              Bridging the gap between computational resources and opportunities through 
              innovative hybrid computing solutions
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Mission Section */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 md:p-12 mb-16 border border-slate-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Our Mission</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-slate-700 text-lg leading-relaxed mb-6">
                  RunSurge is building the future of hybrid computing. We're on a mission to 
                  democratize access to computational resources while creating opportunities for 
                  anyone with spare computing power to participate in our ecosystem.
                </p>
                <p className="text-slate-700 text-lg leading-relaxed">
                  By connecting Consumers who need computing resources with Contributors who provide them, 
                  we're creating a more efficient, accessible, and fair computing marketplace.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Democratized Access</h3>
                    <p className="text-slate-600">Making high-performance computing accessible to everyone</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Fair Marketplace</h3>
                    <p className="text-slate-600">Transparent pricing and equitable compensation for all</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Global Network</h3>
                    <p className="text-slate-600">Connecting resources worldwide for maximum efficiency</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Overview */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Platform Capabilities</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                RunSurge delivers enterprise-grade performance, security, and scalability through 
                innovative hybrid computing architecture
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group bg-white rounded-2xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-3 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">High Performance</h3>
                <p className="text-slate-600 leading-relaxed">
                  Parallel execution across distributed nodes with gRPC for high throughput and ultra-low latency processing.
                </p>
              </div>
              
              <div className="group bg-white rounded-2xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-3 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Enterprise Security</h3>
                <p className="text-slate-600 leading-relaxed">
                  Comprehensive security with code scanning, sandboxed execution, and continuous monitoring for safe environments.
                </p>
              </div>
              
              <div className="group bg-white rounded-2xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-3 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Smart Management</h3>
                <p className="text-slate-600 leading-relaxed">
                  Intelligent scheduling optimizes resource allocation with live monitoring and efficient workload distribution.
                </p>
              </div>
              
              <div className="group bg-white rounded-2xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-3 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Fair Compensation</h3>
                <p className="text-slate-600 leading-relaxed">
                  Transparent pay-per-resource model ensuring fairness with billing based on actual consumption.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 md:p-12 mb-16 border border-slate-200">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">How RunSurge Works</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our streamlined process makes distributed computing simple and efficient
              </p>
            </div>
            
            <div className="space-y-12 md:space-y-16">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="lg:w-1/4 flex justify-center">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full h-24 w-24 flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <span className="text-3xl font-bold text-white">1</span>
                    </div>
                    <div className="absolute -inset-3 bg-blue-500/20 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="lg:w-3/4 text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">Consumer Submits Jobs</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Users submit Python scripts and data for processing, choosing between single jobs 
                    or grouped jobs with shared logic. Our system estimates resource requirements and 
                    manages the workload distribution intelligently.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row-reverse items-center gap-8">
                <div className="lg:w-1/4 flex justify-center">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full h-24 w-24 flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <span className="text-3xl font-bold text-white">2</span>
                    </div>
                    <div className="absolute -inset-3 bg-purple-500/20 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="lg:w-3/4 text-center lg:text-right">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">Workload Distribution</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Our intelligent system scans code for security, estimates memory requirements, and 
                    allocates jobs to appropriate contributor nodes. Distributed execution enables 
                    parallel processing at unprecedented scale.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="lg:w-1/4 flex justify-center">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full h-24 w-24 flex items-center justify-center shadow-lg shadow-green-500/30">
                      <span className="text-3xl font-bold text-white">3</span>
                    </div>
                    <div className="absolute -inset-3 bg-green-500/20 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="lg:w-3/4 text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">Continuous Monitoring</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Throughout execution, we monitor node health through heartbeats, resource logs, and 
                    task-level monitoring. This ensures reliability and provides valuable data for our 
                    transparent compensation model.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row-reverse items-center gap-8">
                <div className="lg:w-1/4 flex justify-center">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-full h-24 w-24 flex items-center justify-center shadow-lg shadow-orange-500/30">
                      <span className="text-3xl font-bold text-white">4</span>
                    </div>
                    <div className="absolute -inset-3 bg-orange-500/20 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="lg:w-3/4 text-center lg:text-right">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">Fair Compensation</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Consumers are billed based on actual resource usage: RAM, execution time, and 
                    contributor machine factor. Contributors receive fair compensation for resources 
                    provided, with performance-based rewards.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg shadow-slate-200/50 border border-slate-100">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 w-fit mx-auto mb-4">
                <Cpu className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">99.9%</h3>
              <p className="text-slate-600">Uptime Reliability</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg shadow-slate-200/50 border border-slate-100">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 w-fit mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">10K+</h3>
              <p className="text-slate-600">Active Contributors</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg shadow-slate-200/50 border border-slate-100">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 w-fit mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">50M+</h3>
              <p className="text-slate-600">Jobs Processed</p>
            </div>
          </div>
          
          {/* Join Us Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-3xl shadow-2xl shadow-blue-500/25 p-8 md:p-12 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Join Our Ecosystem</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Computing?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                Whether you need computing power for your projects or want to earn by sharing your 
                resources, RunSurge offers opportunities for everyone in our growing ecosystem.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  href="/register" 
                  className="group inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Get Started Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link 
                  href="/docs" 
                  className="inline-flex items-center gap-2 border-2 border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                >
                  Learn More
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}