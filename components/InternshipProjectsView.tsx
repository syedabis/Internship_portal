'use client';

import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Clock,
  Users,
  ChevronRight,
  ChevronDown,
  Code2,
  Database,
  Brain,
  Palette,
  BarChart3,
  Shield,
  Globe,
  Smartphone,
  CheckCircle2,
  Target,
  Layers,
  Zap,
  ArrowRight,
  Copy,
  Check,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Calendar,
  Star,
  Filter,
} from 'lucide-react';

// ── Domain definitions ─────────────────────────────────────────────────────
interface Domain {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
}

const DOMAINS: Domain[] = [
  { id: 'all', label: 'All Domains', icon: Layers, color: 'text-slate-700', bgColor: 'bg-slate-100', borderColor: 'border-slate-200' },
  { id: 'fullstack', label: 'Full Stack Web', icon: Code2, color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { id: 'ml', label: 'Machine Learning', icon: Brain, color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  { id: 'data', label: 'Data Science', icon: BarChart3, color: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  { id: 'backend', label: 'Backend Engineering', icon: Database, color: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  { id: 'uiux', label: 'UI/UX Design', icon: Palette, color: 'text-pink-700', bgColor: 'bg-pink-50', borderColor: 'border-pink-200' },
  { id: 'mobile', label: 'Mobile Development', icon: Smartphone, color: 'text-cyan-700', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200' },
  { id: 'cybersecurity', label: 'Cybersecurity', icon: Shield, color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  { id: 'devops', label: 'DevOps & Cloud', icon: Globe, color: 'text-teal-700', bgColor: 'bg-teal-50', borderColor: 'border-teal-200' },
];

// ── Project definitions ────────────────────────────────────────────────────
interface Project {
  id: string;
  title: string;
  description: string;
  domain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  teamSize: string;
  techStack: string[];
  learningOutcomes: string[];
  points: number;
  popularity: number; // out of 100
}

const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'AI-Powered Resume Analyzer',
    description: 'Build an intelligent web application that parses resumes, extracts key information using NLP, and provides ATS compatibility scores with actionable improvement suggestions.',
    domain: 'fullstack',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    teamSize: '1–2',
    techStack: ['Next.js', 'TypeScript', 'OpenAI API', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
    learningOutcomes: ['Full-stack app development', 'API integration with LLMs', 'PDF parsing & NLP', 'Database design'],
    points: 350,
    popularity: 92,
  },
  {
    id: 'p2',
    title: 'Real-Time Sentiment Dashboard',
    description: 'Create a live dashboard that monitors social media feeds, performs sentiment analysis using custom ML models, and visualizes trends with interactive charts.',
    domain: 'ml',
    difficulty: 'Advanced',
    duration: '6 weeks',
    teamSize: '2–3',
    techStack: ['Python', 'PyTorch', 'FastAPI', 'React', 'D3.js', 'Redis', 'WebSocket'],
    learningOutcomes: ['Transformer-based NLP models', 'Real-time data pipelines', 'Interactive data visualization', 'Model deployment'],
    points: 500,
    popularity: 88,
  },
  {
    id: 'p3',
    title: 'E-Commerce Analytics Engine',
    description: 'Design and implement a data pipeline that ingests e-commerce transaction data, performs cohort analysis, churn prediction, and generates automated weekly business intelligence reports.',
    domain: 'data',
    difficulty: 'Intermediate',
    duration: '5 weeks',
    teamSize: '1–2',
    techStack: ['Python', 'Pandas', 'SQL', 'Apache Airflow', 'Metabase', 'dbt'],
    learningOutcomes: ['ETL pipeline design', 'Statistical analysis', 'Business intelligence', 'Data warehouse modeling'],
    points: 400,
    popularity: 81,
  },
  {
    id: 'p4',
    title: 'Microservices Authentication System',
    description: 'Architect a production-grade authentication and authorization system with JWT, OAuth2.0, RBAC, rate limiting, and audit logging across a microservices architecture.',
    domain: 'backend',
    difficulty: 'Advanced',
    duration: '5 weeks',
    teamSize: '1–3',
    techStack: ['Node.js', 'Go', 'gRPC', 'Redis', 'PostgreSQL', 'Docker', 'Kong API Gateway'],
    learningOutcomes: ['Auth architecture patterns', 'API gateway design', 'Rate limiting algorithms', 'Security best practices'],
    points: 480,
    popularity: 85,
  },
  {
    id: 'p5',
    title: 'Design System & Component Library',
    description: 'Create a comprehensive, accessible design system with 30+ reusable UI components, interactive documentation, theme support, and Figma-to-code integration.',
    domain: 'uiux',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    teamSize: '1–2',
    techStack: ['Figma', 'React', 'Storybook', 'CSS Variables', 'Radix UI', 'TypeScript'],
    learningOutcomes: ['Design token systems', 'Accessibility (WCAG 2.1)', 'Component architecture', 'Design documentation'],
    points: 320,
    popularity: 76,
  },
  {
    id: 'p6',
    title: 'Cross-Platform Fitness Tracker',
    description: 'Build a mobile app for iOS and Android that tracks workouts, integrates with health APIs, provides AI-generated workout plans, and syncs data across devices in real-time.',
    domain: 'mobile',
    difficulty: 'Intermediate',
    duration: '5 weeks',
    teamSize: '1–2',
    techStack: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'HealthKit', 'Google Fit API'],
    learningOutcomes: ['Cross-platform mobile dev', 'Native API integration', 'Offline-first architecture', 'Push notifications'],
    points: 380,
    popularity: 79,
  },
  {
    id: 'p7',
    title: 'Vulnerability Scanner CLI Tool',
    description: 'Develop an automated security scanning tool that detects OWASP Top 10 vulnerabilities in web applications, generates detailed remediation reports, and integrates with CI/CD pipelines.',
    domain: 'cybersecurity',
    difficulty: 'Advanced',
    duration: '6 weeks',
    teamSize: '1–2',
    techStack: ['Python', 'Go', 'Docker', 'GitHub Actions', 'NIST CVE Database', 'Playwright'],
    learningOutcomes: ['OWASP security principles', 'Automated pen-testing', 'CI/CD integration', 'Security reporting standards'],
    points: 520,
    popularity: 72,
  },
  {
    id: 'p8',
    title: 'Kubernetes Auto-Scaling Platform',
    description: 'Build an intelligent auto-scaling orchestration platform that monitors application metrics, predicts load patterns with ML, and automatically scales Kubernetes deployments.',
    domain: 'devops',
    difficulty: 'Advanced',
    duration: '6 weeks',
    teamSize: '2–3',
    techStack: ['Kubernetes', 'Helm', 'Prometheus', 'Grafana', 'Terraform', 'Python', 'ArgoCD'],
    learningOutcomes: ['Container orchestration', 'Infrastructure as Code', 'Monitoring & observability', 'Predictive scaling'],
    points: 550,
    popularity: 83,
  },
  {
    id: 'p9',
    title: 'AI Chatbot with RAG Pipeline',
    description: 'Create a context-aware AI chatbot that uses Retrieval-Augmented Generation to answer questions from a custom knowledge base with citation tracking and conversation memory.',
    domain: 'ml',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    teamSize: '1–2',
    techStack: ['Python', 'LangChain', 'Pinecone', 'OpenAI', 'FastAPI', 'React'],
    learningOutcomes: ['RAG architecture', 'Vector databases', 'Embedding models', 'Prompt engineering'],
    points: 420,
    popularity: 95,
  },
  {
    id: 'p10',
    title: 'Personal Finance Dashboard',
    description: 'Build a full-stack personal finance management app with bank transaction categorization, budget tracking, spending analytics, and AI-powered financial advice.',
    domain: 'fullstack',
    difficulty: 'Beginner',
    duration: '3 weeks',
    teamSize: '1',
    techStack: ['Next.js', 'TypeScript', 'Chart.js', 'Tailwind CSS', 'SQLite', 'Clerk Auth'],
    learningOutcomes: ['CRUD application patterns', 'Data visualization', 'Authentication flows', 'Responsive design'],
    points: 250,
    popularity: 89,
  },
  {
    id: 'p11',
    title: 'Automated Data Quality Monitor',
    description: 'Design a data quality monitoring system that automatically detects anomalies, schema drift, data freshness issues and sends alerts via Slack/email with root cause analysis.',
    domain: 'data',
    difficulty: 'Beginner',
    duration: '3 weeks',
    teamSize: '1',
    techStack: ['Python', 'Great Expectations', 'SQL', 'Slack API', 'Cron', 'Streamlit'],
    learningOutcomes: ['Data quality frameworks', 'Anomaly detection', 'Alerting systems', 'Dashboard creation'],
    points: 280,
    popularity: 68,
  },
  {
    id: 'p12',
    title: 'Real-Time Collaborative Whiteboard',
    description: 'Build a multiplayer whiteboard app supporting freehand drawing, sticky notes, shapes, and real-time cursor tracking using WebSocket and CRDT-based conflict resolution.',
    domain: 'fullstack',
    difficulty: 'Advanced',
    duration: '5 weeks',
    teamSize: '2–3',
    techStack: ['Next.js', 'TypeScript', 'WebSocket', 'Yjs (CRDT)', 'Canvas API', 'Redis Pub/Sub'],
    learningOutcomes: ['Real-time collaboration', 'CRDT algorithms', 'Canvas rendering', 'WebSocket protocols'],
    points: 480,
    popularity: 86,
  },
];

// ── Generated Plan type ────────────────────────────────────────────────────
interface WeekPlan {
  week: number;
  title: string;
  objectives: string[];
  deliverables: string[];
  keyMetrics: string;
}

interface GeneratedPlan {
  overview: string;
  weeklyPlan: WeekPlan[];
  techStackBreakdown: { name: string; role: string }[];
  finalDeliverable: string;
  evaluationCriteria: string[];
}

function generatePlan(project: Project): GeneratedPlan {
  const weekCount = parseInt(project.duration);

  const weeklyPlans: WeekPlan[] = [];

  // Week 1: Always setup & research
  weeklyPlans.push({
    week: 1,
    title: 'Foundation & Project Setup',
    objectives: [
      `Set up development environment with ${project.techStack.slice(0, 3).join(', ')}`,
      'Research existing solutions and define project requirements document',
      'Create project repository with CI/CD pipeline, linting, and README',
      'Design system architecture diagram and data flow',
    ],
    deliverables: ['Project repo with boilerplate', 'Architecture diagram', 'Requirements doc'],
    keyMetrics: '100% environment setup, architecture design approved',
  });

  // Week 2: Core implementation
  weeklyPlans.push({
    week: 2,
    title: 'Core Feature Development',
    objectives: [
      `Implement the primary data models and ${project.techStack.includes('PostgreSQL') || project.techStack.includes('SQL') ? 'database schema' : 'data layer'}`,
      'Build the core business logic and primary API endpoints',
      'Create the foundational UI components and page layouts',
      'Write unit tests for core functionality (≥ 60% coverage)',
    ],
    deliverables: ['Working API endpoints', 'Core UI screens', 'Unit test suite'],
    keyMetrics: 'Core CRUD operations functional, API tests passing',
  });

  if (weekCount >= 4) {
    weeklyPlans.push({
      week: 3,
      title: 'Feature Expansion & Integration',
      objectives: [
        `Integrate ${project.techStack.length > 3 ? project.techStack.slice(3, 5).join(' and ') : 'external services'}`,
        'Implement advanced features: search, filtering, and data processing',
        'Add error handling, loading states, and edge case management',
        'Conduct mid-project code review and refactoring sprint',
      ],
      deliverables: ['Integrated external services', 'Advanced feature set', 'Refactored codebase'],
      keyMetrics: 'All integrations tested, zero critical bugs',
    });
  }

  if (weekCount >= 5) {
    weeklyPlans.push({
      week: 4,
      title: 'Polish, Performance & Testing',
      objectives: [
        'Optimize performance: lazy loading, caching, query optimization',
        'Implement responsive design and cross-browser compatibility',
        'Add comprehensive error boundaries and fallback UI',
        'Write integration tests and end-to-end tests for critical flows',
      ],
      deliverables: ['Performance audit report', 'E2E test coverage', 'Responsive UI'],
      keyMetrics: 'Lighthouse score ≥ 90, E2E tests passing',
    });
  }

  // Final week: Always deploy & present
  weeklyPlans.push({
    week: weekCount,
    title: 'Deployment, Documentation & Presentation',
    objectives: [
      'Deploy to production environment and configure monitoring',
      'Write comprehensive documentation: API docs, setup guide, architecture overview',
      'Prepare demo video (3-5 min) showcasing key features and technical decisions',
      'Submit final project report with learnings and future improvement roadmap',
    ],
    deliverables: ['Live deployment URL', 'Documentation site', 'Demo video', 'Final report'],
    keyMetrics: 'Zero-downtime deployment, full documentation coverage',
  });

  // Fill middle weeks if 6-week project
  if (weekCount >= 6 && weeklyPlans.length < weekCount) {
    weeklyPlans.splice(weeklyPlans.length - 1, 0, {
      week: weekCount - 1,
      title: 'Advanced Features & User Testing',
      objectives: [
        'Implement remaining advanced features from the backlog',
        'Conduct user acceptance testing with 3-5 test users',
        'Fix bugs, address feedback, and improve UX based on findings',
        'Add analytics tracking and monitoring dashboards',
      ],
      deliverables: ['UAT report', 'Bug fix log', 'Analytics dashboard'],
      keyMetrics: 'All critical feedback addressed, analytics tracking live',
    });
  }

  // Renumber
  weeklyPlans.forEach((w, i) => { w.week = i + 1; });

  return {
    overview: `This ${project.duration} project will take you through the complete lifecycle of building "${project.title}" — from architecture design to production deployment. You'll work with ${project.techStack.join(', ')} to deliver a portfolio-ready project worth ${project.points} leaderboard points.`,
    weeklyPlan: weeklyPlans,
    techStackBreakdown: project.techStack.map((tech) => ({
      name: tech,
      role: getTechRole(tech),
    })),
    finalDeliverable: `A fully deployed ${project.title.toLowerCase()} with comprehensive documentation, test coverage ≥ 70%, and a 3-5 minute demo video presentation.`,
    evaluationCriteria: [
      'Code quality & architecture decisions (25%)',
      'Feature completeness & correctness (25%)',
      'Documentation & demo presentation (20%)',
      'Testing coverage & reliability (15%)',
      'UI/UX polish & responsiveness (15%)',
    ],
  };
}

function getTechRole(tech: string): string {
  const roles: Record<string, string> = {
    'Next.js': 'Full-stack React framework for SSR/SSG',
    'TypeScript': 'Type-safe JavaScript for better DX',
    'React': 'UI component library for interactive interfaces',
    'Tailwind CSS': 'Utility-first CSS framework for rapid styling',
    'Prisma': 'Type-safe ORM for database operations',
    'PostgreSQL': 'Primary relational database',
    'OpenAI API': 'LLM integration for AI-powered features',
    'OpenAI': 'Large language model for text generation',
    'Python': 'Primary language for backend / ML',
    'PyTorch': 'Deep learning framework for model training',
    'FastAPI': 'High-performance Python API framework',
    'D3.js': 'Data visualization library',
    'Redis': 'In-memory cache & message broker',
    'WebSocket': 'Real-time bidirectional communication',
    'Docker': 'Containerization for consistent environments',
    'Kubernetes': 'Container orchestration platform',
    'Node.js': 'Server-side JavaScript runtime',
    'Go': 'Systems programming for performance-critical services',
    'gRPC': 'High-performance RPC framework',
    'Pandas': 'Data manipulation & analysis library',
    'SQL': 'Database querying language',
    'Figma': 'Design tool for UI/UX prototyping',
    'Storybook': 'Component development environment',
    'React Native': 'Cross-platform mobile framework',
    'Expo': 'React Native toolchain & services',
    'Supabase': 'Open-source Firebase alternative (BaaS)',
    'Chart.js': 'Lightweight charting library',
    'LangChain': 'Framework for LLM application development',
    'Pinecone': 'Vector database for semantic search',
    'Terraform': 'Infrastructure as Code tool',
    'Prometheus': 'Metrics collection & alerting',
    'Grafana': 'Monitoring dashboard platform',
    'Helm': 'Kubernetes package manager',
    'ArgoCD': 'GitOps continuous delivery tool',
    'GitHub Actions': 'CI/CD automation platform',
    'Playwright': 'End-to-end browser testing framework',
    'Slack API': 'Messaging integration platform',
    'SQLite': 'Lightweight embedded database',
    'Clerk Auth': 'Authentication & user management',
    'Yjs (CRDT)': 'Conflict-free replicated data types for collaboration',
    'Canvas API': 'Browser API for 2D graphics rendering',
    'Redis Pub/Sub': 'Message broadcasting for real-time events',
    'CSS Variables': 'Custom properties for design tokens',
    'Radix UI': 'Accessible headless UI component primitives',
    'HealthKit': 'Apple health data framework',
    'Google Fit API': 'Android health data integration',
    'NIST CVE Database': 'Vulnerability reference database',
    'Kong API Gateway': 'API gateway & service mesh',
    'Apache Airflow': 'Workflow orchestration platform',
    'Metabase': 'Business intelligence dashboard tool',
    'dbt': 'Data transformation tool for analytics',
    'Great Expectations': 'Data validation & quality framework',
    'Cron': 'Task scheduling utility',
    'Streamlit': 'Python data app framework',
  };
  return roles[tech] || 'Supporting technology';
}

// ── Difficulty badge styles ────────────────────────────────────────────────
function getDifficultyStyles(diff: string) {
  switch (diff) {
    case 'Beginner':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'Intermediate':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'Advanced':
      return 'bg-rose-50 text-rose-800 border-rose-200';
    default:
      return 'bg-slate-50 text-slate-800 border-slate-200';
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export const InternshipProjectsView: React.FC = () => {
  const [activeDomain, setActiveDomain] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);

  // ── Filtering ──────────────────────────────────────────────────────────
  const filteredProjects = PROJECTS.filter((p) => {
    const matchesDomain = activeDomain === 'all' || p.domain === activeDomain;
    const matchesDifficulty = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDomain && matchesDifficulty && matchesSearch;
  });

  // ── Generate plan handler ──────────────────────────────────────────────
  const handleGeneratePlan = (project: Project) => {
    setSelectedProject(project);
    setIsGenerating(true);
    setExpandedWeek(1);
    // Simulate brief generation delay
    setTimeout(() => {
      setGeneratedPlan(generatePlan(project));
      setIsGenerating(false);
    }, 600);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setGeneratedPlan(null);
  };

  // ═════════════════════════════════════════════════════════════════════════
  // PLAN VIEW — when a project is selected and plan is generated
  // ═════════════════════════════════════════════════════════════════════════
  if (selectedProject) {
    const domain = DOMAINS.find((d) => d.id === selectedProject.domain);
    const DomainIcon = domain?.icon || Layers;

    return (
      <div className="space-y-6 pb-12 animate-[fadeSlideIn_0.2s_ease-out]">
        {/* Back button */}
        <button
          onClick={handleBackToProjects}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          <span>Back to Projects</span>
        </button>

        {/* Project Header Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-slate-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${domain?.bgColor} ${domain?.color} border ${domain?.borderColor}`}>
                    {domain?.label}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${getDifficultyStyles(selectedProject.difficulty)}`}>
                    {selectedProject.difficulty}
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight">{selectedProject.title}</h1>
                <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">{selectedProject.description}</p>
              </div>
              <div className="flex items-center gap-6 text-xs text-slate-400 shrink-0">
                <div className="text-center">
                  <div className="text-xl font-black text-emerald-400">{selectedProject.points}</div>
                  <div className="mt-0.5 font-semibold">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-black text-white">{selectedProject.duration}</div>
                  <div className="mt-0.5 font-semibold">Duration</div>
                </div>
              </div>
            </div>

            {/* Meta pills row */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/10">
              <span className="px-3 py-1 rounded-lg bg-white/10 text-white/80 text-xs font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {selectedProject.duration}
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 text-white/80 text-xs font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> {selectedProject.teamSize} members
              </span>
              {selectedProject.techStack.map((tech) => (
                <span key={tech} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 text-[11px] font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Generating spinner */}
        {isGenerating && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
              <p className="text-sm font-semibold text-slate-600">Generating your project plan...</p>
            </div>
          </div>
        )}

        {/* Generated Plan Content */}
        {generatedPlan && !isGenerating && (
          <div className="space-y-6 animate-[fadeSlideIn_0.25s_ease-out]">

            {/* Overview Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4.5 h-4.5 text-amber-500" />
                <h2 className="text-base font-extrabold text-slate-900">Project Overview</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{generatedPlan.overview}</p>
            </div>

            {/* Weekly Plan Accordion */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4.5 h-4.5 text-blue-600" />
                  <h2 className="text-base font-extrabold text-slate-900">Weekly Execution Plan</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">Click each week to expand the detailed breakdown</p>
              </div>

              <div className="divide-y divide-slate-100">
                {generatedPlan.weeklyPlan.map((week) => {
                  const isOpen = expandedWeek === week.week;
                  return (
                    <div key={week.week}>
                      <button
                        onClick={() => setExpandedWeek(isOpen ? null : week.week)}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                            W{week.week}
                          </span>
                          <div>
                            <div className="font-bold text-sm text-slate-900">{week.title}</div>
                            <div className="text-[11px] text-slate-500 font-medium mt-0.5">{week.keyMetrics}</div>
                          </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-5 pt-1 bg-slate-50/50 animate-[fadeSlideIn_0.15s_ease-out]">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Objectives */}
                            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
                              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Target className="w-3.5 h-3.5 text-blue-600" /> Objectives
                              </div>
                              <ul className="space-y-2">
                                {week.objectives.map((obj, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                                    <span>{obj}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Deliverables */}
                            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
                              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5 text-amber-500" /> Deliverables
                              </div>
                              <ul className="space-y-2">
                                {week.deliverables.map((del, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                                    <span>{del}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tech Stack Breakdown */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4.5 h-4.5 text-blue-600" />
                  <h2 className="text-base font-extrabold text-slate-900">Tech Stack Breakdown</h2>
                </div>
                <button
                  onClick={() => handleCopy(generatedPlan.techStackBreakdown.map((t) => `${t.name}: ${t.role}`).join('\n'), 'techstack')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  {copiedField === 'techstack' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'techstack' ? 'Copied!' : 'Copy All'}</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {generatedPlan.techStackBreakdown.map((tech) => (
                  <div key={tech.name} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{tech.name}</div>
                      <div className="text-[11px] text-slate-500 leading-snug mt-0.5">{tech.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evaluation Criteria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4.5 h-4.5 text-amber-500" />
                  <h2 className="text-base font-extrabold text-slate-900">Evaluation Criteria</h2>
                </div>
                <ul className="space-y-2.5">
                  {generatedPlan.evaluationCriteria.map((c, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs text-slate-700">
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex-1">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: c.match(/\((\d+)%\)/)?.[1] + '%' }}
                        />
                      </div>
                      <span className="font-semibold whitespace-nowrap">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4.5 h-4.5 text-emerald-700" />
                  <h2 className="text-base font-extrabold text-emerald-900">Final Deliverable</h2>
                </div>
                <p className="text-sm text-emerald-800 leading-relaxed">{generatedPlan.finalDeliverable}</p>
                <div className="mt-4 pt-4 border-t border-emerald-200/60">
                  <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-2">Learning Outcomes</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.learningOutcomes.map((lo, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
                        {lo}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Copy Full Plan Button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={() => {
                  const fullPlan = [
                    `# Project Plan: ${selectedProject.title}`,
                    `\n## Overview\n${generatedPlan.overview}`,
                    `\n## Tech Stack\n${generatedPlan.techStackBreakdown.map((t) => `- **${t.name}**: ${t.role}`).join('\n')}`,
                    `\n## Weekly Plan`,
                    ...generatedPlan.weeklyPlan.map((w) => [
                      `\n### Week ${w.week}: ${w.title}`,
                      `**Key Metrics:** ${w.keyMetrics}`,
                      `**Objectives:**\n${w.objectives.map((o) => `- ${o}`).join('\n')}`,
                      `**Deliverables:**\n${w.deliverables.map((d) => `- ${d}`).join('\n')}`,
                    ].join('\n')),
                    `\n## Evaluation Criteria\n${generatedPlan.evaluationCriteria.map((c) => `- ${c}`).join('\n')}`,
                    `\n## Final Deliverable\n${generatedPlan.finalDeliverable}`,
                  ].join('\n');
                  handleCopy(fullPlan, 'fullplan');
                }}
                className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-lg shadow-slate-900/20 flex items-center gap-2 transition-all"
              >
                {copiedField === 'fullplan' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedField === 'fullplan' ? 'Plan Copied to Clipboard!' : 'Copy Full Plan as Markdown'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // PROJECT BROWSER VIEW — default view
  // ═════════════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-emerald-600" />
          <span>Internship Projects</span>
        </h1>
        <p className="text-sm text-slate-500 font-medium max-w-2xl">
          Select a project aligned with your domain, generate a detailed execution plan, and earn leaderboard points upon completion.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Projects', value: PROJECTS.length.toString(), icon: Layers, accent: 'text-blue-600' },
          { label: 'Domains', value: (DOMAINS.length - 1).toString(), icon: Globe, accent: 'text-emerald-600' },
          { label: 'Max Points', value: '550', icon: Star, accent: 'text-amber-600' },
          { label: 'Avg Duration', value: '4.7 wks', icon: Clock, accent: 'text-purple-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <stat.icon className={`w-3.5 h-3.5 ${stat.accent}`} />
              <span>{stat.label}</span>
            </div>
            <div className="text-xl font-black text-slate-900 mt-1">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Domain Filter Pills */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter by Domain</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {DOMAINS.map((domain) => {
            const Icon = domain.icon;
            const isActive = activeDomain === domain.id;
            return (
              <button
                key={domain.id}
                onClick={() => setActiveDomain(domain.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : `${domain.bgColor} ${domain.color} ${domain.borderColor} hover:shadow-xs`
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : ''}`} />
                <span>{domain.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search + Difficulty Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, tech stack, or keywords..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-xs"
          />
        </div>
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs shrink-0">
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setDifficultyFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                difficultyFilter === lvl
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="text-xs font-semibold text-slate-500">
        Showing {filteredProjects.length} of {PROJECTS.length} projects
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredProjects.map((project) => {
          const domain = DOMAINS.find((d) => d.id === project.domain);
          const DomainIcon = domain?.icon || Layers;
          return (
            <div
              key={project.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all group"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${domain?.bgColor} ${domain?.color} ${domain?.borderColor} flex items-center gap-1`}>
                    <DomainIcon className="w-3 h-3" />
                    {domain?.label}
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${getDifficultyStyles(project.difficulty)}`}>
                    {project.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 shrink-0">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{project.points} pts</span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-extrabold text-slate-900 leading-snug mb-2 group-hover:text-emerald-800 transition-colors">
                {project.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                {project.description}
              </p>

              {/* Meta row */}
              <div className="flex items-center gap-3 mb-4 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {project.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {project.teamSize}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> {project.popularity}% popular
                </span>
              </div>

              {/* Tech stack pills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.techStack.map((tech) => (
                  <span key={tech} className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-150 text-slate-600 text-[10px] font-semibold">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Generate Plan Button */}
              <button
                onClick={() => handleGeneratePlan(project)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all group/btn"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Generate Project Plan</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="w-10 h-10 text-slate-300 mb-3" />
          <div className="text-sm font-bold text-slate-600">No projects found</div>
          <div className="text-xs text-slate-400 mt-1">Try adjusting your filters or search query</div>
        </div>
      )}
    </div>
  );
};
