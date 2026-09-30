'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { INITIAL_PROJECTS, Project } from '@/lib/projectsData';
import toast from '@/lib/toast';
import {
  Search,
  Sparkles,
  Clock,
  Users,
  ChevronRight,
  ChevronDown,
  Palette,
  BarChart3,
  Globe,
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
  Briefcase,
  DollarSign,
  HeartHandshake,
  Megaphone,
  UserCheck,
  FileText,
  Send,
  ExternalLink,
  FileCheck,
  AlertCircle,
  XCircle,
  Loader2,
  X,
  Cpu,
  Code,
  ShieldCheck,
  Award,
  Video,
  Plus,
} from 'lucide-react';

// ── Domain definitions (Corporate & Business Functions) ───────────────────
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
  { id: 'ai', label: 'Artificial Intelligence (AI)', icon: Cpu, color: 'text-violet-700', bgColor: 'bg-violet-50', borderColor: 'border-violet-200' },
  { id: 'swe', label: 'Software Engineering', icon: Code, color: 'text-cyan-700', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200' },
  { id: 'cybersecurity', label: 'Cybersecurity & InfoSec', icon: ShieldCheck, color: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  { id: 'hr', label: 'Human Resources (HR)', icon: Users, color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  { id: 'sales', label: 'Sales & Business Dev', icon: TrendingUp, color: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  { id: 'marketing', label: 'Digital Marketing & Growth', icon: Target, color: 'text-rose-700', bgColor: 'bg-rose-50', borderColor: 'border-rose-200' },
  { id: 'finance', label: 'Finance & Accounting', icon: DollarSign, color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { id: 'operations', label: 'Operations & Logistics', icon: Briefcase, color: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  { id: 'customersuccess', label: 'Customer Success & Support', icon: HeartHandshake, color: 'text-teal-700', bgColor: 'bg-teal-50', borderColor: 'border-teal-200' },
  { id: 'product', label: 'Product & Strategy', icon: Lightbulb, color: 'text-indigo-700', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
  { id: 'design', label: 'Graphic Design & Branding', icon: Palette, color: 'text-pink-700', bgColor: 'bg-pink-50', borderColor: 'border-pink-200' },
];

// ── Project definitions ────────────────────────────────────────────────────
// ── Project definitions from central lib/projectsData ──────────────────────
const PROJECTS: Project[] = INITIAL_PROJECTS;

interface ExampleCaseStudy {
  company: string;
  scenario: string;
  targetProblem: string;
  sampleBenchmark: string;
}

interface WeekPlan {
  week: number;
  title: string;
  objectives: string[];
  deliverables: string[];
  keyMetrics: string;
}

interface GeneratedPlan {
  overview: string;
  exampleCaseStudy: ExampleCaseStudy;
  weeklyPlan: WeekPlan[];
  techStackBreakdown: { name: string; role: string }[];
  finalDeliverable: string;
  evaluationCriteria: string[];
}

function getExampleCaseStudy(project: Project): ExampleCaseStudy {
  if (project.domain === 'ai') {
    return {
      company: 'Acme Cloud Intelligence (SaaS Startup)',
      scenario: 'The company has 200+ internal product markdown docs and FAQs. Employees and trial users waste hours searching for technical answers.',
      targetProblem: 'Lack of an accessible, accurate AI assistant that answers technical questions with verified source citations.',
      sampleBenchmark: 'An interactive Streamlit / Next.js AI assistant powered by OpenAI APIs and a lightweight vector store (FAISS/Chroma) that answers queries in < 2 seconds with citations.',
    };
  }
  if (project.domain === 'swe') {
    return {
      company: 'PayPulse Fintech',
      scenario: 'The operations team relies on manual spreadsheets to track transaction reviews and customer accounts, leading to data errors and lack of access logs.',
      targetProblem: 'No centralized internal web application with secure authentication and structured CRUD data operations.',
      sampleBenchmark: 'A clean full-stack web application built with React/Next.js, Node.js, and Supabase/PostgreSQL with JWT authentication, validation, and CRUD operations.',
    };
  }
  if (project.domain === 'cybersecurity') {
    return {
      company: 'HealthTech Connect (HIPAA Compliance)',
      scenario: 'The startup is preparing for vendor security questionnaires and needs an audit of web application vulnerabilities and access control baselines.',
      targetProblem: 'Unidentified OWASP vulnerabilities, misconfigured HTTP headers, and lack of a documented incident response playbook.',
      sampleBenchmark: 'A detailed OWASP Top 10 security audit report using OWASP ZAP and browser tools, complete with CVSS risk scores, proof-of-concept steps, and remediation SOPs.',
    };
  }
  if (project.domain === 'hr') {
    return {
      company: 'Nova Workflows (50-Person Remote Team)',
      scenario: 'New remote hires report feeling lost during their first month because onboarding documents are scattered.',
      targetProblem: 'High 90-day employee churn rate (24%) due to unstructured onboarding.',
      sampleBenchmark: 'A Notion 30-60-90 Day Onboarding Portal with automated check-in milestones, mentor assignment rubrics, and a 1-page HR manager SOP.',
    };
  }
  if (project.domain === 'sales') {
    return {
      company: 'Apex B2B Solutions',
      scenario: 'Sales reps spend 65% of their day reviewing unqualified inbound leads with no systematic lead scoring algorithm.',
      targetProblem: 'Low sales pipeline velocity and missed quarterly revenue targets.',
      sampleBenchmark: 'An interactive Excel/HubSpot Quantitative Lead Scoring Model with lead tier routing (Hot/Warm/Cold) and a 5-step outbound email drip sequence.',
    };
  }
  if (project.domain === 'marketing') {
    return {
      company: 'Lumina Consumer Brand',
      scenario: 'Paid ad spend is increasing, but CAC (Customer Acquisition Cost) has risen 35% without clear UTM attribution.',
      targetProblem: 'Inability to track which channels (Search vs Social vs Email) drive profitable customer acquisition.',
      sampleBenchmark: 'An omnichannel marketing strategy report with a live Looker Studio dashboard, UTM tracking framework, and high-converting ad copy templates.',
    };
  }
  if (project.domain === 'finance') {
    return {
      company: 'Vanguard Logistics',
      scenario: 'Leadership lacks real-time visibility into monthly cash burn and budget variance across operational departments.',
      targetProblem: 'Inaccurate runway forecasting leading to delayed investment decisions.',
      sampleBenchmark: 'A 3-statement financial model in Excel/Sheets with monthly cash flow projections, sensitivity analysis tables, and executive summary charts.',
    };
  }
  if (project.domain === 'product') {
    return {
      company: 'SaaSFlow Platform',
      scenario: 'Product team wants to launch a new workflow automation feature but lacks structured competitive analysis and user prioritization.',
      targetProblem: 'Risk of building unused features without clear GTM positioning and persona research.',
      sampleBenchmark: 'A GTM Strategy deck in Figma/Miro with RICE feature prioritization matrix, competitive analysis matrix, and user interview synthesis.',
    };
  }
  if (project.domain === 'operations') {
    return {
      company: 'Nexus Global Supply Chain',
      scenario: 'Supplier fulfillment delays average 18 days with 12% stockout rates across core distribution warehouses.',
      targetProblem: 'Lack of supplier SLA scoring, automated inventory reorder thresholds, and bottleneck mapping.',
      sampleBenchmark: 'An interactive Supply Chain Dashboard with vendor SLA scorecards, dynamic safety stock formulas, and end-to-end operational bottleneck audit.',
    };
  }
  if (project.domain === 'customersuccess') {
    return {
      company: 'CloudPulse Enterprise Software',
      scenario: 'Customer churn rate increased to 9.2% annually, with support ticket response times exceeding SLA targets.',
      targetProblem: 'No proactive health scoring system to flag at-risk accounts before contract renewal periods.',
      sampleBenchmark: 'A Customer Success Health Scoring model in Google Sheets/Notion with automated CSAT/NPS survey workflows, churn risk tiers, and customer onboarding journey maps.',
    };
  }
  if (project.domain === 'design') {
    return {
      company: 'Aura Fintech & Payments',
      scenario: 'Inconsistent typography, component sizing, and brand colors across web, mobile, and marketing channels.',
      targetProblem: 'Absence of unified brand style guidelines and scalable reusable component tokens.',
      sampleBenchmark: 'A comprehensive Brand Design System in Figma complete with typography hierarchy, WCAG-compliant color palettes, design tokens, and social marketing templates.',
    };
  }
  return {
    company: 'Enterprise Organization Example',
    scenario: `The company needs a structured execution plan for ${project.title} to improve operational efficiency.`,
    targetProblem: `Lack of standardized frameworks and SOP documentation for ${project.domain.toUpperCase()} operations.`,
    sampleBenchmark: `A comprehensive portfolio project featuring live operational templates, standardized SOP documentation, and an executive presentation video.`,
  };
}

function generatePlan(project: Project): GeneratedPlan {
  const weekCount = parseInt(project.duration);
  const weeklyPlans: WeekPlan[] = [];

  // Week 1: Research & Setup
  weeklyPlans.push({
    week: 1,
    title: 'Scope Definition & Baseline Analysis',
    objectives: [
      `Audit current domain workflows and baseline tools (${project.techStack.slice(0, 3).join(', ')})`,
      'Conduct stakeholder interviews / market research to map core project requirements',
      'Define success metrics (KPIs/OKRs) and establish workspace documentation structure',
      'Create project master sheet / workspace dashboard',
    ],
    deliverables: ['Baseline audit report', 'Project charter & KPI document', 'Workspace setup'],
    keyMetrics: '100% stakeholder alignment & scope approval',
  });

  // Week 2: Core Framework Development
  weeklyPlans.push({
    week: 2,
    title: 'Framework & Workflow Design',
    objectives: [
      `Design the primary operational framework and ${project.techStack.slice(1, 3).join(' / ')} workflows`,
      'Create standardized templates, formulas, or process documentation',
      'Conduct mid-stage testing with sample data or dummy scenarios',
      'Gather initial feedback from domain mentors or team members',
    ],
    deliverables: ['Core framework draft', 'Standardized templates & guidelines', 'Test scenario log'],
    keyMetrics: 'Initial framework approved, zero critical process gaps',
  });

  if (weekCount >= 4) {
    weeklyPlans.push({
      week: 3,
      title: 'Execution & Tool Integration',
      objectives: [
        `Integrate ${project.techStack.length > 3 ? project.techStack.slice(3, 5).join(' and ') : 'additional tools & automation'}`,
        'Roll out test execution across target scenarios or campaign segments',
        'Refine copy, analytics tracking, or calculation formulas based on pilot data',
        'Establish operational SLAs and quality assurance checklists',
      ],
      deliverables: ['Integrated tool workflows', 'Pilot execution data', 'SLA checklist'],
      keyMetrics: 'Pilot metrics meeting performance target ≥ 80%',
    });
  }

  if (weekCount >= 5) {
    weeklyPlans.push({
      week: 4,
      title: 'Optimization & Data Analytics',
      objectives: [
        'Analyze pilot data and perform gap analysis against benchmark standards',
        'Optimize conversion funnels, response times, or cost efficiency metrics',
        'Build live visual reporting dashboards for leadership review',
        'Conduct peer review sprint and implement feedback iterations',
      ],
      deliverables: ['Analytics dashboard', 'Funnel optimization report', 'Revised process templates'],
      keyMetrics: 'Dashboard live, performance improvement ≥ 15%',
    });
  }

  // Final week: Presentation & Rollout
  weeklyPlans.push({
    week: weekCount,
    title: 'Final Implementation, SOPs & Executive Presentation',
    objectives: [
      'Finalize Standard Operating Procedures (SOPs) and training handoff documentation',
      'Publish final project portfolio materials (case study report + executive summary)',
      'Prepare a 3-5 minute video presentation walking through strategic findings and outcomes',
      'Present results to domain leads for final score evaluation',
    ],
    deliverables: ['Final SOP documentation', 'Executive presentation deck', 'Demo video (3-5 min)', 'Portfolio case study'],
    keyMetrics: '100% deliverable approval by domain leads',
  });

  // Fill middle weeks if 6-week project
  if (weekCount >= 6 && weeklyPlans.length < weekCount) {
    weeklyPlans.splice(weeklyPlans.length - 1, 0, {
      week: weekCount - 1,
      title: 'Scaling Strategy & Stakeholder Review',
      objectives: [
        'Develop long-term scaling recommendations and risk mitigation strategies',
        'Conduct full review session with cross-functional stakeholders',
        'Finalize automation rules and automated reporting alerts',
      ],
      deliverables: ['Scaling roadmap doc', 'Stakeholder sign-off log', 'Automation ruleset'],
      keyMetrics: 'All stakeholder feedback resolved',
    });
  }

  // Renumber
  weeklyPlans.forEach((w, i) => { w.week = i + 1; });

  // Use admin custom case study if provided, otherwise domain fallback
  const customCaseStudy = project.caseStudy && project.caseStudy.company ? {
    company: project.caseStudy.company,
    scenario: project.caseStudy.scenario || '',
    targetProblem: project.caseStudy.targetProblem || '',
    sampleBenchmark: project.caseStudy.sampleBenchmark || '',
  } : getExampleCaseStudy(project);

  // Use admin custom weekly plan if provided, otherwise structured weeklyPlans
  const customWeeklyPlan = (project.weeklyPlan && Array.isArray(project.weeklyPlan) && project.weeklyPlan.length > 0)
    ? project.weeklyPlan.map((w: any, idx: number) => ({
        week: w.week || idx + 1,
        title: w.title || `Week ${idx + 1} Plan`,
        objectives: Array.isArray(w.objectives) ? w.objectives : [String(w.objectives || 'Complete week deliverables')],
        deliverables: Array.isArray(w.deliverables) ? w.deliverables : [String(w.deliverables || 'Weekly deliverable link')],
        keyMetrics: w.keyMetrics || 'Successful mentor sign-off',
      }))
    : weeklyPlans;

  const customFinalDeliverable = project.finalDeliverable || `A comprehensive executive case study for "${project.title}", complete with live dashboards/templates, standardized SOP documentation, and a 3-5 minute video presentation.`;

  const customEvaluationCriteria = (project.evaluationCriteria && Array.isArray(project.evaluationCriteria) && project.evaluationCriteria.length > 0)
    ? project.evaluationCriteria
    : [
        'Strategic depth & problem-solving framework (25%)',
        'Execution completeness & template quality (25%)',
        'Data accuracy & analytical rigor (20%)',
        'Documentation & presentation clarity (15%)',
        'Tool mastery & automation efficiency (15%)',
      ];

  return {
    overview: `This ${project.duration} project will guide you through the execution of "${project.title}" — from strategy and process design to live deployment and reporting. You will leverage tools like ${project.techStack.join(', ')} to deliver a industry-standard portfolio project worth ${project.points} leaderboard points.`,
    exampleCaseStudy: customCaseStudy,
    weeklyPlan: customWeeklyPlan,
    techStackBreakdown: project.techStack.map((tech) => ({
      name: tech,
      role: getTechRole(tech),
    })),
    finalDeliverable: customFinalDeliverable,
    evaluationCriteria: customEvaluationCriteria,
  };
}

function getTechRole(tech: string): string {
  const roles: Record<string, string> = {
    'HRIS Frameworks': 'HR Management Systems & Employee Data Architecture',
    'Notion': 'Workspace documentation, SOP wikis & project tracking',
    'Excel / Sheets': 'Data modeling, quantitative calculations & reporting',
    'LMS Tools': 'Learning Management Systems for onboarding & training',
    'Process Mapping': 'Visual workflow & standard operating procedure (SOP) design',
    'HubSpot CRM': 'Customer Relationship Management & sales pipeline tracking',
    'Salesforce Logic': 'Enterprise sales workflow & lead management logic',
    'LinkedIn Sales Navigator': 'B2B prospecting & targeted lead discovery',
    'Excel Financials': 'Financial modeling, valuation & formula logic',
    'Email Automation': 'Drip campaign sequences & automated follow-ups',
    'Google Analytics 4': 'Web traffic, event attribution & user behavior analytics',
    'Meta Ads Manager': 'Paid social campaign creation, audience targeting & ad optimization',
    'SEO Tools (Ahrefs/SEMrush)': 'Keyword research, search volume & competitor auditing',
    'Looker Studio': 'Interactive business intelligence & executive dashboarding',
    'Canva': 'Rapid visual asset & social media creative design',
    'Financial Modeling': '3-statement financial modeling & valuation logic',
    'Excel / Sheets (Advanced)': 'VLOOKUP, INDEX/MATCH, Pivot Tables & financial macros',
    'Power BI': 'Enterprise data modeling, DAX queries & interactive reports',
    'QuickBooks / Xero': 'Cloud accounting software & general ledger tracking',
    'Variance Analysis': 'Budget vs. actual expenditure monitoring framework',
    'Operations Process Mapping': 'End-to-end supply chain & operational workflow design',
    'ERP Systems': 'Enterprise Resource Planning & inventory synchronization',
    'Excel / Power Pivot': 'Large dataset analysis & data model creation',
    'SLA Frameworks': 'Service Level Agreement definition & compliance tracking',
    'Risk Assessment': 'Operational risk identification & mitigation planning',
    'Zendesk / Freshdesk': 'Support ticketing system, queue routing & SLA tracking',
    'NPS Analytics': 'Net Promoter Score survey analysis & sentiment grouping',
    'Customer Journey Mapping': 'Touchpoint analysis from onboarding to renewal',
    'Churn Analysis': 'Predictive analysis for customer retention & churn prevention',
    'Gainsight Frameworks': 'Customer success health scoring & expansion playbooks',
    'Product Strategy': 'GTM positioning, value proposition & market validation',
    'Miro / Figma': 'Collaborative whiteboarding & visual wireframing',
    'User Research Methods': 'Customer interviews, surveys & usability synthesis',
    'RICE Prioritization': 'Reach, Impact, Confidence, Effort scoring methodology',
    'Feature Roadmapping': 'Release planning & milestone strategy',
    'Adobe Illustrator': 'Vector graphic design, typography & logo creation',
    'Photoshop': 'Image editing & marketing visual asset processing',
    'Brand Guidelines': 'Typography, color palette & brand voice standards',
    'Visual Asset Design': 'Creative collateral for digital & print channels',
    'OKR Frameworks': 'Objectives and Key Results goal-setting methodology',
    'Performance Management': 'Appraisal rubrics & 360-degree review design',
    'Google Sheets': 'Collaborative cloud spreadsheets',
    'HR Analytics': 'Headcount, turnover & performance data analysis',
    'Employee Feedback Design': 'Structured survey & review templates',
    'Copywriting': 'High-converting persuasive text generation for sales',
    'Apollo.io / Instantly': 'B2B contact data & cold email automation platforms',
    'Email Deliverability Setup': 'SPF, DKIM, DMARC & domain warmup configuration',
    'HubSpot / Mailchimp': 'Email marketing platform & automation builder',
    'A/B Testing': 'Split-testing subject lines, copy & call-to-actions',
    'SEO Copywriting': 'Search engine optimized content writing for intent matching',
    'SurferSEO': 'On-page content optimization & keyword density tool',
    'WordPress / CMS': 'Content management system publishing & formatting',
    'Google Search Console': 'Search index monitoring & click-through-rate analytics',
    'Editorial Calendar': 'Content scheduling, distribution & publishing plan',
    'Helpdesk Administration': 'Support queue configuration & macro management',
    'Technical Writing': 'Clear, step-by-step user documentation',
    'Knowledge Base Design': 'Self-service help center taxonomy & layout',
    'Ticket Analytics': 'Support volume, response time & resolution metrics',
    'SLA Management': 'Response time SLAs & escalation procedure design',
    // Software, AI & Security Stack roles
    'Node.js / Express': 'Backend RESTful API service & middleware routing',
    'TypeScript': 'Type-safe application architecture & static typing',
    'PostgreSQL': 'Relational data persistence, schema design & SQL optimization',
    'Docker': 'Containerization, environment isolation & deployment',
    'GitHub Actions': 'CI/CD pipeline automation & continuous testing',
    'Python': 'Backend service logic, data manipulation & scripting',
    'FastAPI': 'Asynchronous high-performance REST API endpoints',
    'LangChain': 'LLM orchestration, prompt templates & agent execution',
    'LlamaIndex': 'Data ingestion & retrieval-augmented generation (RAG)',
    'Pinecone': 'Vector database indexing & high-speed similarity search',
    'ChromaDB': 'Embedded vector storage & embedding index management',
    'Next.js / React': 'Server-side rendering, client state & modern UI',
    'Tailwind CSS': 'Utility-first modern interface styling',
    'Redis': 'In-memory caching, queue management & rate limiting',
    'Linux / Bash': 'System administration, server scripting & process control',
    'Burp Suite': 'Web application security testing & vulnerability auditing',
    'OWASP ZAP': 'Automated penetration testing & vulnerability assessment',
    'Nmap': 'Network discovery & security auditing',
    'Wireshark': 'Network packet analysis & traffic inspection',
    'Splunk / Elastic SIEM': 'Security event monitoring, threat detection & log analysis',
    'OpenAI API': 'Generative AI completions, structured outputs & embeddings',
    'Streamlit': 'Rapid AI/ML prototyping & data application deployment',
  };
  return roles[tech] || 'Core technology & domain methodology';
}

interface ParsedCriterion {
  title: string;
  weight: number;
  weightStr: string;
  description: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  barColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

function parseCriterion(criterionStr: string, index: number): ParsedCriterion {
  const match = criterionStr.match(/^(.*?)\s*\((\d+)%\)$/);
  const title = match ? match[1].trim() : criterionStr;
  const weight = match ? parseInt(match[2], 10) : 20;

  const presets = [
    {
      description: 'Clear problem framing, metric-driven solution logic & stakeholder alignment',
      color: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 border-emerald-200',
      badgeText: 'text-emerald-700',
      barColor: 'bg-emerald-500',
      icon: Target,
    },
    {
      description: 'Complete deliverables, functional templates, and production-ready quality',
      color: 'text-blue-700',
      badgeBg: 'bg-blue-50 border-blue-200',
      badgeText: 'text-blue-700',
      barColor: 'bg-blue-500',
      icon: CheckCircle2,
    },
    {
      description: 'Accurate data modeling, realistic quantitative benchmarks & analytical depth',
      color: 'text-violet-700',
      badgeBg: 'bg-violet-50 border-violet-200',
      badgeText: 'text-violet-700',
      barColor: 'bg-violet-500',
      icon: BarChart3,
    },
    {
      description: 'Polished SOP documentation, executive summary clarity & video presentation',
      color: 'text-amber-700',
      badgeBg: 'bg-amber-50 border-amber-200',
      badgeText: 'text-amber-700',
      barColor: 'bg-amber-500',
      icon: FileText,
    },
    {
      description: 'Mastery of industry tools, modern workflows & automation best practices',
      color: 'text-indigo-700',
      badgeBg: 'bg-indigo-50 border-indigo-200',
      badgeText: 'text-indigo-700',
      barColor: 'bg-indigo-500',
      icon: Zap,
    },
  ];

  const preset = presets[index % presets.length];

  return {
    title,
    weight,
    weightStr: `${weight}%`,
    description: preset.description,
    color: preset.color,
    badgeBg: preset.badgeBg,
    badgeText: preset.badgeText,
    barColor: preset.barColor,
    icon: preset.icon,
  };
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
  const [projectsList, setProjectsList] = useState<Project[]>(PROJECTS);
  const [activeDomain, setActiveDomain] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);

  // ── Single Enrolled Active Project State ────────────────────────────────
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeProjectTitle, setActiveProjectTitle] = useState<string | null>(null);
  const [activeProjectStartedAt, setActiveProjectStartedAt] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [projectToSwitchTo, setProjectToSwitchTo] = useState<Project | null>(null);

  const isProjectActive = (project: Project | null | undefined): boolean => {
    if (!project) return false;
    if (activeProjectId && String(project.id) === String(activeProjectId)) return true;
    if (activeProjectTitle) {
      const pTitle = project.title.toLowerCase().trim();
      const aTitle = activeProjectTitle.toLowerCase().trim();
      if (pTitle === aTitle) return true;
      if (aTitle.includes('enterprise ai rag') && pTitle.includes('ai document knowledge assistant')) return true;
      if (aTitle.includes('rag knowledge agent') && pTitle.includes('ai document knowledge assistant')) return true;
      if (aTitle.includes('ai document') && pTitle.includes('ai document')) return true;
    }
    return false;
  };

  // ── Weekly Submissions State ────────────────────────────────────────────
  const [submissions, setSubmissions] = useState<Record<number, any>>({});
  const [submittingWeek, setSubmittingWeek] = useState<number | null>(null);
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Custom Project Proposals State ──────────────────────────────────────
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [userProposals, setUserProposals] = useState<any[]>([]);
  const [showProposalsDrawer, setShowProposalsDrawer] = useState(false);
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);

  // Proposal Form Fields
  const [propTitle, setPropTitle] = useState('');
  const [propDomain, setPropDomain] = useState('ai');
  const [propDifficulty, setPropDifficulty] = useState<'Beginner' | 'Intermediate'>('Intermediate');
  const [propDuration, setPropDuration] = useState('4 weeks');
  const [propTechStack, setPropTechStack] = useState('');
  const [propProblemStatement, setPropProblemStatement] = useState('');
  const [propDeliverables, setPropDeliverables] = useState('');
  const [propReferenceUrl, setPropReferenceUrl] = useState('');

  const fetchUserProposals = async (userEmail?: string) => {
    const email = userEmail || currentUser?.email?.toLowerCase().trim();
    if (!email) return;
    try {
      const { data, error } = await supabase
        .from('project_submissions')
        .select('*')
        .eq('user_email', email)
        .eq('week_number', 0)
        .order('created_at', { ascending: false });

      if (data) {
        setUserProposals(data);
      }
    } catch (err) {
      console.warn('Error fetching proposals:', err);
    }
  };

  // ── Load User & Active Project ──────────────────────────────────────────
  useEffect(() => {
    const fetchUserAndActiveProject = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUser(user);
          const email = user.email?.toLowerCase().trim();
          fetchUserProposals(email);
          const metaId = user.user_metadata?.active_project_id;
          const metaTitle = user.user_metadata?.active_project_title;
          const metaStartedAt = user.user_metadata?.active_project_started_at;

          let localData: any = null;
          if (email) {
            try {
              const raw = localStorage.getItem(`cortexa_active_project_${email}`);
              if (raw) localData = JSON.parse(raw);
            } catch {}
          }

          const resolvedId = metaId || localData?.id || null;
          const resolvedTitle = metaTitle || localData?.title || null;
          const resolvedStartedAt = metaStartedAt || localData?.startedAt || null;

          setActiveProjectId(resolvedId ? String(resolvedId) : null);
          setActiveProjectTitle(resolvedTitle || null);
          setActiveProjectStartedAt(resolvedStartedAt || null);

          if (email && resolvedId && !localData) {
            localStorage.setItem(
              `cortexa_active_project_${email}`,
              JSON.stringify({ id: String(resolvedId), title: resolvedTitle, startedAt: resolvedStartedAt })
            );
          }
        }
      } catch (err) {
        console.warn('Auth user fetch error:', err);
      }
    };

    fetchUserAndActiveProject();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        const email = session.user.email?.toLowerCase().trim();
        fetchUserProposals(email);
        const metaId = session.user.user_metadata?.active_project_id;
        const metaTitle = session.user.user_metadata?.active_project_title;
        const metaStartedAt = session.user.user_metadata?.active_project_started_at;

        let localData: any = null;
        if (email) {
          try {
            const raw = localStorage.getItem(`cortexa_active_project_${email}`);
            if (raw) localData = JSON.parse(raw);
          } catch {}
        }

        setActiveProjectId(metaId ? String(metaId) : (localData?.id ? String(localData.id) : null));
        setActiveProjectTitle(metaTitle || localData?.title || null);
        setActiveProjectStartedAt(metaStartedAt || localData?.startedAt || null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleProposeProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.email) {
      toast.error('Please sign in to submit a project proposal.');
      return;
    }
    if (!propTitle.trim()) {
      toast.error('Please enter a project title.');
      return;
    }
    if (!propProblemStatement.trim()) {
      toast.error('Please describe the problem statement or objective.');
      return;
    }

    setIsSubmittingProposal(true);
    const email = currentUser.email.toLowerCase().trim();
    const proposalId = `proposal_${Date.now()}`;
    const techStackArray = propTechStack
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const notesPayload = {
      type: 'project_proposal',
      domain: propDomain,
      difficulty: propDifficulty,
      duration: propDuration,
      techStack: techStackArray,
      problemStatement: propProblemStatement.trim(),
      targetDeliverables: propDeliverables.trim(),
      referenceUrl: propReferenceUrl.trim(),
    };

    try {
      const { data, error } = await supabase.from('project_submissions').insert([
        {
          user_email: email,
          user_name: currentUser.user_metadata?.full_name || email.split('@')[0],
          project_id: proposalId,
          project_title: propTitle.trim(),
          week_number: 0,
          deliverable_url: propReferenceUrl.trim() || 'https://datacrumbs.org/proposal',
          notes: JSON.stringify(notesPayload),
          status: 'pending',
          points_awarded: 0,
        },
      ]).select();

      if (error) {
        toast.error(`Proposal submission failed: ${error.message}`);
      } else {
        toast.success('Project idea proposed! Mentors will review and assign points soon.');
        setShowProposeModal(false);
        setPropTitle('');
        setPropProblemStatement('');
        setPropDeliverables('');
        setPropTechStack('');
        setPropReferenceUrl('');
        if (data && data[0]) {
          setUserProposals((prev) => [data[0], ...prev]);
        } else {
          fetchUserProposals(email);
        }
      }
    } catch (err: any) {
      toast.error(`Error: ${err?.message || 'Could not submit proposal'}`);
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  const loadSubmissionsForProject = async (projectId: string, userEmail?: string) => {
    if (!userEmail) return;
    try {
      const { data } = await supabase
        .from('project_submissions')
        .select('*')
        .eq('project_id', String(projectId))
        .eq('user_email', userEmail.toLowerCase().trim());

      if (data && data.length > 0) {
        const subMap: Record<number, any> = {};
        data.forEach((sub: any) => {
          subMap[sub.week_number] = sub;
        });
        setSubmissions(subMap);
      } else {
        setSubmissions({});
      }
    } catch (err) {
      console.warn('Submissions load error:', err);
    }
  };

  useEffect(() => {
    if (selectedProject && currentUser?.email) {
      loadSubmissionsForProject(selectedProject.id, currentUser.email);
    }
  }, [selectedProject, currentUser]);

  // ── Start Project Enrollment Handler ────────────────────────────────────
  const handleStartProject = async (project: Project, skipConfirmation = false) => {
    if (!currentUser?.email) {
      toast.error('Please sign in to start a project.');
      return;
    }

    // Single active project rule: prompt confirmation if switching from a different project that actually exists
    const currentActiveExists = projectsList.some((p) => isProjectActive(p));
    if (activeProjectId && !isProjectActive(project) && currentActiveExists && !skipConfirmation) {
      setProjectToSwitchTo(project);
      return;
    }

    setIsEnrolling(true);
    const email = currentUser.email.toLowerCase().trim();
    const nowIso = new Date().toISOString();

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          active_project_id: String(project.id),
          active_project_title: project.title,
          active_project_started_at: nowIso,
        },
      });

      if (error) {
        console.warn('Supabase updateUser metadata notice:', error.message);
      } else if (data?.user) {
        setCurrentUser(data.user);
      }

      // Sync local storage for instant responsiveness
      localStorage.setItem(
        `cortexa_active_project_${email}`,
        JSON.stringify({
          id: String(project.id),
          title: project.title,
          startedAt: nowIso,
        })
      );

      setActiveProjectId(String(project.id));
      setActiveProjectTitle(project.title);
      setActiveProjectStartedAt(nowIso);
      setProjectToSwitchTo(null);

      // Open project view if not already open
      if (!selectedProject || String(selectedProject.id) !== String(project.id)) {
        setSelectedProject(project);
        setGeneratedPlan(generatePlan(project));
      }

      toast.success(`Started "${project.title}"! You are now enrolled.`);
    } catch (err: any) {
      console.error('Error starting project:', err);
      toast.error(`Could not start project: ${err?.message || 'Please check connection.'}`);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleSubmitDeliverable = async () => {
    if (!selectedProject || submittingWeek === null || !deliverableUrl.trim()) return;

    if (!currentUser?.email) {
      toast.error('Please sign in to submit your project deliverable.');
      return;
    }

    // Safety check: only active project can submit
    if (!isProjectActive(selectedProject)) {
      toast.error('You can only submit deliverables for your currently active enrolled project.');
      return;
    }

    setIsSubmitting(true);
    const email = currentUser.email.toLowerCase().trim();

    const payload = {
      user_email: email,
      user_name: currentUser.user_metadata?.full_name || email.split('@')[0],
      project_id: String(selectedProject.id),
      project_title: selectedProject.title,
      week_number: submittingWeek,
      deliverable_url: deliverableUrl.trim(),
      notes: submissionNotes.trim(),
      status: 'pending',
      updated_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from('project_submissions')
        .upsert([payload], { onConflict: 'user_email,project_id,week_number' })
        .select();

      if (error) {
        toast.error(`Submission error: ${error.message}`);
      } else {
        toast.success(`Week ${submittingWeek} deliverable submitted successfully!`);
        const newSub = data && data[0] ? data[0] : payload;
        setSubmissions((prev) => ({ ...prev, [submittingWeek]: newSub }));
        setSubmittingWeek(null);
        setDeliverableUrl('');
        setSubmissionNotes('');
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      toast.error(`Submission failed: ${err?.message || 'Please check connection.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLocalProjects = (): Project[] => {
    try {
      const saved = localStorage.getItem('cortexa_projects_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Error reading local projects:', err);
    }
    return PROJECTS;
  };

  const loadProjects = async () => {
    const local = getLocalProjects();
    try {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        const mapped: Project[] = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          domain: p.domain,
          difficulty: p.difficulty || 'Intermediate',
          duration: p.duration || '4 weeks',
          teamSize: p.team_size || p.teamSize || '1-2',
          techStack: p.tech_stack || p.techStack || [],
          learningOutcomes: p.learning_outcomes || p.learningOutcomes || [],
          points: p.points || 500,
          popularity: p.popularity || 90,
          caseStudy: p.case_study || undefined,
          weeklyPlan: p.weekly_plan || undefined,
          finalDeliverable: p.final_deliverable || undefined,
          evaluationCriteria: p.evaluation_criteria || undefined,
          created_at: p.created_at,
        }));
        setProjectsList(mapped);
      } else {
        setProjectsList(local);
      }
    } catch {
      setProjectsList(local);
    }
  };

  useEffect(() => {
    loadProjects();
    const handleUpdate = () => loadProjects();
    window.addEventListener('cortexa_projects_updated', handleUpdate);
    return () => window.removeEventListener('cortexa_projects_updated', handleUpdate);
  }, []);

  // Auto-reconcile orphaned or renamed active project IDs/titles
  useEffect(() => {
    if (!projectsList || projectsList.length === 0) return;
    if (!activeProjectId && !activeProjectTitle) return;

    // Check if activeProjectId already matches directly
    const exactMatch = projectsList.find((p) => String(p.id) === String(activeProjectId));
    if (exactMatch) {
      if (activeProjectTitle !== exactMatch.title) {
        setActiveProjectTitle(exactMatch.title);
      }
      return;
    }

    // Try finding by title or alias
    const matched = projectsList.find((p) => isProjectActive(p));
    if (matched) {
      setActiveProjectId(String(matched.id));
      setActiveProjectTitle(matched.title);
      if (currentUser?.email) {
        const email = currentUser.email.toLowerCase().trim();
        const nowIso = activeProjectStartedAt || new Date().toISOString();
        localStorage.setItem(
          `cortexa_active_project_${email}`,
          JSON.stringify({ id: String(matched.id), title: matched.title, startedAt: nowIso })
        );
        supabase.auth.updateUser({
          data: {
            active_project_id: String(matched.id),
            active_project_title: matched.title,
            active_project_started_at: nowIso,
          },
        }).catch(() => {});
      }
    }
  }, [projectsList, activeProjectId, activeProjectTitle]);

  // ── Filtering ──────────────────────────────────────────────────────────
  const filteredProjects = projectsList.filter((p) => {
    const matchesDomain = activeDomain === 'all' || p.domain === activeDomain;
    const matchesDifficulty = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.techStack && p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesDomain && matchesDifficulty && matchesSearch;
  });

  // ── View plan handler ──────────────────────────────────────────────
  const handleGeneratePlan = (project: Project) => {
    setSelectedProject(project);
    setExpandedWeek(1);
    setGeneratedPlan(generatePlan(project));
    setIsGenerating(false);
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
  // MAIN RENDER (Unified container)
  // ═════════════════════════════════════════════════════════════════════════
  const isSelectedActive = isProjectActive(selectedProject);

  return (
    <div className="space-y-6 pb-12">
      {/* ── PLAN VIEW: Active when a project is selected ── */}
      {selectedProject && (() => {
        const domain = DOMAINS.find((d) => d.id === selectedProject.domain);
        return (
          <div className="space-y-6 animate-[fadeSlideIn_0.2s_ease-out]">
            {/* Back button */}
            <button
              onClick={handleBackToProjects}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              <span>Back to Projects</span>
            </button>

            {/* Project Header Banner with Dark Abstract Textured Background */}
            <div className="relative rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-800/80 overflow-hidden text-white">
              <div
                className="absolute inset-0 -scale-x-100 bg-cover bg-center pointer-events-none"
                style={{
                  backgroundImage: `url('/dark-abstract-textured-background-with-green-and-t-2026-08-20-19-21-18-utc.JPG (1).jpeg')`,
                }}
              />

              <div className="relative z-10 space-y-4">
                {/* Top Badges & Points/Duration */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-900/60 text-purple-200 border border-purple-500/40">
                      {domain?.label || selectedProject.domain}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                        selectedProject.difficulty === 'Beginner'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                          : selectedProject.difficulty === 'Intermediate'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                          : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {selectedProject.difficulty}
                    </span>
                    {isSelectedActive && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 flex items-center gap-1.5 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Active Enrolled Project
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-emerald-400 leading-none">
                        {selectedProject.points}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                        Points
                      </div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-white leading-none">
                        {selectedProject.duration}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                        Duration
                      </div>
                    </div>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {selectedProject.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-4xl leading-relaxed mt-2">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Divider & Horizontal Meta Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-700/50">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-900/70 border border-slate-700/60 text-slate-300 text-xs font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" /> {selectedProject.duration}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-900/70 border border-slate-700/60 text-slate-300 text-xs font-semibold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400" /> {selectedProject.teamSize} members
                  </span>
                  {selectedProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-300 text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Active Status / "Start Project" Callout Banner ── */}
            {isSelectedActive ? (
              <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-emerald-950/90 border border-emerald-500/40 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                        Your Active Enrolled Project
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        In Progress
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      You are currently enrolled in this project. Complete each weekly deliverable below to earn {selectedProject.points} leaderboard points.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Enrolled
                  </div>
                </div>
              </div>
            ) : activeProjectId ? (
              <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
                    <AlertCircle className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                        Browsing Mode Only
                      </span>
                      <span className="text-[11px] text-slate-400">•</span>
                      <span className="text-xs text-slate-300">
                        Currently enrolled: <strong className="text-white">{activeProjectTitle || 'Another Project'}</strong>
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Interns work on one project at a time. You can review this full plan, or start this project to make it your active focus.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleStartProject(selectedProject)}
                  disabled={isEnrolling}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer shrink-0"
                >
                  {isEnrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-slate-950" />}
                  <span>Start Project</span>
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                    <Sparkles className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                        Project Enrollment
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        Ready to Begin
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Ready to commit to this project? Start this project to enroll and unlock weekly deliverable submissions.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleStartProject(selectedProject)}
                  disabled={isEnrolling}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer shrink-0"
                >
                  {isEnrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-slate-950" />}
                  <span>Start Project</span>
                </button>
              </div>
            )}

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

                {/* Real-World Example Case Study & Benchmark Card */}
                <div className="bg-black text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-extrabold text-white">
                          Real-World Case Study & Benchmark Example
                        </h2>
                        <p className="text-xs text-neutral-400">What to build and how top submissions look</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                      Sample Guidance
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-neutral-950 rounded-xl p-4 border border-neutral-800 space-y-2">
                      <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" /> Example Scenario: {generatedPlan.exampleCaseStudy.company}
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        <strong className="text-white">Context:</strong> {generatedPlan.exampleCaseStudy.scenario}
                      </p>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        <strong className="text-white">Core Problem:</strong> {generatedPlan.exampleCaseStudy.targetProblem}
                      </p>
                    </div>

                    <div className="bg-neutral-950 rounded-xl p-4 border border-neutral-800 space-y-2">
                      <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Top Submission Benchmark Output
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {generatedPlan.exampleCaseStudy.sampleBenchmark}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Weekly Plan Accordion */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                  <div className="p-6 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4.5 h-4.5 text-blue-600" />
                      <h2 className="text-base font-extrabold text-slate-900">Weekly Execution Plan</h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Click each week to expand the detailed breakdown and milestone deliverables
                    </p>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {generatedPlan.weeklyPlan.map((week) => {
                      const isOpen = expandedWeek === week.week;
                      return (
                        <div key={week.week}>
                          <button
                            onClick={() => setExpandedWeek(isOpen ? null : week.week)}
                            className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors text-left cursor-pointer"
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
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
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

                                {/* Weekly Submission Action Bar (Spans full width) */}
                                <div className="col-span-1 md:col-span-2 mt-2 p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`p-2 rounded-lg ${
                                        isSelectedActive
                                          ? 'bg-emerald-50 text-emerald-700'
                                          : 'bg-slate-100 text-slate-500'
                                      }`}
                                    >
                                      <FileCheck className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                        <span>Week {week.week} Submission Status</span>
                                        {isSelectedActive && (
                                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                                            Active Project
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[11px] mt-0.5">
                                        {!isSelectedActive ? (
                                          <span className="text-slate-500">
                                            You must start this project to unlock deliverable submissions.
                                          </span>
                                        ) : submissions[week.week] ? (
                                          <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 flex-wrap">
                                              {submissions[week.week].status === 'approved' && (
                                                <span className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                  Approved (+{submissions[week.week].points_awarded || 100} pts)
                                                </span>
                                              )}
                                              {submissions[week.week].status === 'rejected' && (
                                                <span className="flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                                                  <XCircle className="w-3 h-3 text-rose-600" />
                                                  Revisions Requested
                                                </span>
                                              )}
                                              {submissions[week.week].status === 'pending' && (
                                                <span className="flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                                  <Clock className="w-3 h-3 text-amber-600" />
                                                  Submitted (Under Review)
                                                </span>
                                              )}
                                              <span className="text-slate-400 text-[10px]">
                                                Updated {new Date(submissions[week.week].updated_at || submissions[week.week].created_at).toLocaleDateString()}
                                              </span>
                                            </div>

                                            {/* Mentor Feedback Display */}
                                            {(() => {
                                              let parsedNotes: any = {};
                                              try {
                                                parsedNotes = JSON.parse(submissions[week.week].notes || '{}');
                                              } catch {
                                                parsedNotes = {};
                                              }
                                              const feedback = parsedNotes.mentorFeedback || parsedNotes.adminFeedback || '';
                                              if (!feedback) return null;
                                              const isRejected = submissions[week.week].status === 'rejected';

                                              return (
                                                <div
                                                  className={`p-2.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2 mt-1.5 ${
                                                    isRejected
                                                      ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                                                      : 'bg-purple-50/80 border-purple-200 text-purple-900'
                                                  }`}
                                                >
                                                  <Sparkles
                                                    className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                                      isRejected ? 'text-rose-600' : 'text-purple-600'
                                                    }`}
                                                  />
                                                  <div>
                                                    <span className="font-bold">
                                                      {isRejected ? 'Mentor Revision Guidance: ' : 'Mentor Feedback: '}
                                                    </span>
                                                    <span>{feedback}</span>
                                                  </div>
                                                </div>
                                              );
                                            })()}
                                          </div>
                                        ) : (
                                          <span className="text-slate-500">
                                            Not submitted yet. Complete deliverables and submit link.
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {!isSelectedActive ? (
                                    <button
                                      onClick={() => handleStartProject(selectedProject)}
                                      disabled={isEnrolling}
                                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
                                    >
                                      <Zap className="w-3.5 h-3.5 fill-white" />
                                      <span>Start Project</span>
                                    </button>
                                  ) : submissions[week.week] ? (
                                    <div className="flex items-center gap-2 shrink-0">
                                      <a
                                        href={submissions[week.week].deliverable_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                      >
                                        <span>View Submitted Link</span>
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                      <button
                                        onClick={() => setSubmittingWeek(week.week)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                          submissions[week.week].status === 'rejected'
                                            ? 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                        }`}
                                      >
                                        {submissions[week.week].status === 'rejected' ? 'Resubmit' : 'Update'}
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setSubmittingWeek(week.week)}
                                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
                                    >
                                      <Send className="w-3.5 h-3.5" />
                                      <span>Submit Week {week.week} Deliverable</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tools & Methodology Breakdown */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4.5 h-4.5 text-blue-600" />
                      <h2 className="text-base font-extrabold text-slate-900">Tools & Methodology Breakdown</h2>
                    </div>
                    <button
                      onClick={() =>
                        handleCopy(
                          generatedPlan.techStackBreakdown.map((t) => `${t.name}: ${t.role}`).join('\n'),
                          'techstack'
                        )
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedField === 'techstack' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedField === 'techstack' ? 'Copied!' : 'Copy All'}</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {generatedPlan.techStackBreakdown.map((tech) => (
                      <div
                        key={tech.name}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{tech.name}</div>
                          <div className="text-[11px] text-slate-500 leading-snug mt-0.5">{tech.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Evaluation Criteria & Final Deliverable (Option 1: Segmented Ribbon & Rubric Scorecards) ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left: Evaluation Criteria & Segmented Weightage Ribbon (7 cols on lg) */}
                  <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80">
                            <Award className="w-5 h-5 text-amber-500" />
                          </div>
                          <div>
                            <h2 className="text-base font-extrabold text-slate-900">Evaluation Criteria & Rubric</h2>
                            <p className="text-[11px] text-slate-500">Grading weightage applied across all weekly milestones</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                          100% Total Weight
                        </span>
                      </div>

                      {/* Segmented 100% Weightage Distribution Ribbon */}
                      <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          <span>Weightage Distribution</span>
                          <span className="text-slate-400 font-normal">5 Evaluated Categories</span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-slate-200/70 overflow-hidden flex shadow-inner p-0.5 gap-0.5">
                          {generatedPlan.evaluationCriteria.map((c, i) => {
                            const parsed = parseCriterion(c, i);
                            return (
                              <div
                                key={i}
                                style={{ width: `${parsed.weight}%` }}
                                className={`h-full rounded-full ${parsed.barColor} transition-all duration-300 relative group cursor-default`}
                                title={`${parsed.title}: ${parsed.weightStr}`}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Rubric Scorecard Cards List */}
                      <div className="space-y-2 pt-1">
                        {generatedPlan.evaluationCriteria.map((c, i) => {
                          const parsed = parseCriterion(c, i);
                          const IconComponent = parsed.icon;
                          return (
                            <div
                              key={i}
                              className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-start justify-between gap-3 group"
                            >
                              <div className="flex items-start gap-2.5 min-w-0">
                                <div className={`p-1.5 rounded-lg ${parsed.badgeBg} ${parsed.badgeText} shrink-0 mt-0.5 border`}>
                                  <IconComponent className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                                    {parsed.title}
                                  </div>
                                  <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                                    {parsed.description}
                                  </div>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-black border ${parsed.badgeBg} ${parsed.badgeText}`}>
                                  {parsed.weightStr}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right: Final Deliverable Package Card (5 cols on lg) */}
                  <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <h2 className="text-base font-extrabold text-slate-900">Final Deliverable Package</h2>
                            <p className="text-[11px] text-slate-500">3 capstone artifacts required for completion</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Executive Capstone
                        </span>
                      </div>

                      {/* Project Objective Summary */}
                      <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 text-xs text-slate-700 leading-relaxed font-medium">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Capstone Objective
                        </div>
                        {generatedPlan.finalDeliverable}
                      </div>

                      {/* 3 Tangible Capstone Artifact Cards */}
                      <div className="space-y-2.5 pt-0.5">
                        {/* Artifact 1 */}
                        <div className="p-3 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex items-start justify-between gap-3 shadow-2xs group">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 shrink-0 mt-0.5">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                                1. Executive Case Study & SOP Wiki
                              </div>
                              <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                                Comprehensive problem diagnosis, framework architecture & standardized procedures.
                              </div>
                            </div>
                          </div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                            Notion / PDF
                          </span>
                        </div>

                        {/* Artifact 2 */}
                        <div className="p-3 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex items-start justify-between gap-3 shadow-2xs group">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 mt-0.5">
                              <Code className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                                2. Working Prototype / Code Assets
                              </div>
                              <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                                Live interactive system, containerized repo code, or validated operational templates.
                              </div>
                            </div>
                          </div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                            Live / Repo
                          </span>
                        </div>

                        {/* Artifact 3 */}
                        <div className="p-3 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex items-start justify-between gap-3 shadow-2xs group">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 shrink-0 mt-0.5">
                              <Video className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 leading-snug group-hover:text-purple-700 transition-colors">
                                3. Video Walkthrough & Presentation
                              </div>
                              <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                                3–5 min executive recording demonstrating solution logic and business impact.
                              </div>
                            </div>
                          </div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                            3-5 Min Loom
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Verified Learning Outcomes */}
                    <div className="pt-3 border-t border-slate-100">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-700">
                          <Sparkles className="w-3 h-3 text-emerald-600" /> Verified Competencies
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold">Portfolio Ready</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProject.learningOutcomes.map((lo, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50/80 border border-emerald-200/70 text-emerald-800 text-[10px] font-semibold shadow-2xs flex items-center gap-1"
                          >
                            <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
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
                        `\n## Tools & Methodology\n${generatedPlan.techStackBreakdown.map((t) => `- **${t.name}**: ${t.role}`).join('\n')}`,
                        `\n## Weekly Plan`,
                        ...generatedPlan.weeklyPlan.map((w) =>
                          [
                            `\n### Week ${w.week}: ${w.title}`,
                            `**Key Metrics:** ${w.keyMetrics}`,
                            `**Objectives:**\n${w.objectives.map((o) => `- ${o}`).join('\n')}`,
                            `**Deliverables:**\n${w.deliverables.map((d) => `- ${d}`).join('\n')}`,
                          ].join('\n')
                        ),
                        `\n## Evaluation Criteria\n${generatedPlan.evaluationCriteria.map((c) => `- ${c}`).join('\n')}`,
                        `\n## Final Deliverable\n${generatedPlan.finalDeliverable}`,
                      ].join('\n');
                      handleCopy(fullPlan, 'fullplan');
                      toast.success('Project plan copied to clipboard as Markdown!');
                    }}
                    className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-lg shadow-slate-900/20 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    {copiedField === 'fullplan' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>{copiedField === 'fullplan' ? 'Plan Copied to Clipboard!' : 'Copy Full Plan as Markdown'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ── PROJECT BROWSER VIEW (when no project selected) ── */}
      {!selectedProject && (
        <>
          {/* Page Header */}
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-emerald-600" />
              <span>Internship Projects</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-2xl">
              Browse projects across all domains. You can view execution plans for any project, and choose one active project to enroll in and submit weekly deliverables.
            </p>
          </div>

          {/* ── Active Enrolled Project Card Banner (if user has active project) ── */}
          {activeProjectId && (() => {
            const activeProj = projectsList.find((p) => isProjectActive(p));
            if (!activeProj) return null;
            return (
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-2xl p-5 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-[fadeIn_0.2s_ease-out]">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 fill-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        My Active Enrolled Project
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">• {activeProj.domain.toUpperCase()}</span>
                      <span className="text-xs text-amber-400 font-bold">• {activeProj.points} pts</span>
                      <span className="text-xs text-slate-400 font-semibold">• {activeProj.duration}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{activeProj.title}</h3>
                    <p className="text-xs text-slate-300 line-clamp-1 max-w-2xl">{activeProj.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleGeneratePlan(activeProj)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer shrink-0 self-stretch md:self-auto justify-center"
                >
                  <span>Continue Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })()}

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Projects', value: projectsList.length.toString(), icon: '/Icons/4.png' },
              { label: 'Domains', value: (DOMAINS.length - 1).toString(), icon: '/Icons/5.png' },
              {
                label: 'Max Points',
                value: String(Math.max(...projectsList.map((p) => p.points || 0), 500)),
                icon: '/Icons/6.png',
              },
              { label: 'Avg Duration', value: '4.0 wks', icon: '/Icons/7.png' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3.5"
              >
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={stat.icon} alt={stat.label} className="w-9 h-9 object-contain" />
                </div>
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase mt-1 truncate">
                    {stat.label}
                  </div>
                </div>
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
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border cursor-pointer ${
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

          {/* Search & Difficulty Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects, tools, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs shrink-0">
              {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    difficultyFilter === diff
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Propose a Project Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {userProposals.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowProposalsDrawer(!showProposalsDrawer)}
                  className="px-3.5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>My Ideas ({userProposals.length})</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowProposeModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-600/20 cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Propose a Project</span>
              </button>
            </div>
          </div>

          {/* My Submitted Proposals Drawer */}
          {showProposalsDrawer && userProposals.length > 0 && (
            <div className="bg-gradient-to-b from-purple-50/60 to-white border border-purple-200 rounded-2xl p-5 shadow-xs space-y-3 animate-[fadeIn_0.2s_ease-out]">
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                    <Lightbulb className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">My Proposed Project Ideas</h3>
                    <p className="text-[11px] text-slate-500">Track your custom capstone reviews & mentor feedback</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProposalsDrawer(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-purple-100/50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {userProposals.map((prop) => {
                  let parsedNotes: any = {};
                  try {
                    parsedNotes = JSON.parse(prop.notes || '{}');
                  } catch {
                    parsedNotes = { problemStatement: prop.notes };
                  }

                  const isPending = prop.status === 'pending';
                  const isApproved = prop.status === 'approved';
                  const isRejected = prop.status === 'rejected';

                  return (
                    <div
                      key={prop.id}
                      className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                            {parsedNotes.domain?.toUpperCase() || 'CUSTOM'}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 border ${
                              isApproved
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : isRejected
                                ? 'bg-rose-50 text-rose-700 border-rose-300'
                                : 'bg-amber-50 text-amber-700 border-amber-300'
                            }`}
                          >
                            {isApproved && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            {isPending && <Clock className="w-3 h-3 text-amber-600" />}
                            {isRejected && <AlertCircle className="w-3 h-3 text-rose-600" />}
                            <span>
                              {isApproved
                                ? `Approved (+${prop.points_awarded || 500} pts)`
                                : isRejected
                                ? 'Revisions Requested'
                                : 'Under Review'}
                            </span>
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900">{prop.project_title}</h4>
                        {parsedNotes.problemStatement && (
                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                            {parsedNotes.problemStatement}
                          </p>
                        )}
                      </div>

                      {parsedNotes.adminFeedback && (
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700">
                          <span className="font-bold text-slate-900">Mentor Notes: </span>
                          {parsedNotes.adminFeedback}
                        </div>
                      )}

                      <div className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100 flex items-center justify-between">
                        <span>Submitted {new Date(prop.created_at).toLocaleDateString()}</span>
                        {parsedNotes.duration && <span>Target: {parsedNotes.duration}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Projects Count */}
          <div className="text-xs text-slate-500 font-medium">
            Showing {filteredProjects.length} of {projectsList.length} projects
          </div>

          {/* Projects Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProjects.map((project) => {
              const domain = DOMAINS.find((d) => d.id === project.domain);
              const DomainIcon = domain?.icon || Layers;
              const isActive = isProjectActive(project);

              return (
                <div
                  key={project.id}
                  className={`bg-white border rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group ${
                    isActive
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${domain?.bgColor} ${domain?.color} ${domain?.borderColor} flex items-center gap-1`}
                        >
                          <DomainIcon className="w-3 h-3" />
                          {domain?.label}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${getDifficultyStyles(
                            project.difficulty
                          )}`}
                        >
                          {project.difficulty}
                        </span>
                        {isActive && (
                          <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{project.points} pts</span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors tracking-tight">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-normal leading-relaxed mt-1.5 line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    {/* Duration & Team */}
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 font-semibold pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {project.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> {project.teamSize}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700">
                        <TrendingUp className="w-3.5 h-3.5" /> {project.popularity}% popular
                      </span>
                    </div>

                    {/* Skills & Experience Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {(project.learningOutcomes && project.learningOutcomes.length > 0
                        ? project.learningOutcomes
                        : project.techStack
                      ).map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50/80 border border-emerald-200/70 text-emerald-800 text-[10px] font-semibold flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => handleGeneratePlan(project)}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isActive ? 'Continue Active Project' : 'View Project Plan'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    {!isActive && (
                      <button
                        onClick={() => handleStartProject(project)}
                        disabled={isEnrolling}
                        className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shrink-0"
                        title="Start this project"
                      >
                        <Zap className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                        <span>Start Project</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No projects found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search query or filter selection to find available projects.
              </p>
              <button
                onClick={() => {
                  setActiveDomain('all');
                  setSearchQuery('');
                  setDifficultyFilter('All');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Submission Modal (Shared) ── */}
      {submittingWeek !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-100 animate-[scaleUp_0.15s_ease-out]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
                  <Send className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Submit Week {submittingWeek} Deliverable
                  </h3>
                  <p className="text-xs text-slate-500 truncate max-w-xs font-medium">
                    {(selectedProject as any)?.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSubmittingWeek(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Deliverable URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  value={deliverableUrl}
                  onChange={(e) => setDeliverableUrl(e.target.value)}
                  placeholder="https://notion.so/... or https://drive.google.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Provide a public link to your Notion document, Google Drive file, Loom video, or GitHub repository.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Notes & Reflection (Optional)
                </label>
                <textarea
                  rows={3}
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Summarize key findings, tools used, or challenges overcome..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSubmittingWeek(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDeliverable}
                disabled={isSubmitting || !deliverableUrl.trim()}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{isSubmitting ? 'Submitting...' : `Submit Week ${submittingWeek}`}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Switch Active Project Confirmation Modal (Single Active Policy) ── */}
      {projectToSwitchTo && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-slate-100 animate-[scaleUp_0.15s_ease-out]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Switch Active Project?
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Single active project policy</p>
                </div>
              </div>
              <button
                onClick={() => setProjectToSwitchTo(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                You are currently working on:
              </p>
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 font-bold text-slate-900 text-xs truncate">
                {activeProjectTitle || 'Current Project'}
              </div>
              <p>
                To maintain focus, interns can only have <strong>one active project</strong> at a time. Switching will make:
              </p>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 font-bold text-emerald-900 text-xs">
                {projectToSwitchTo.title}
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Note: Any previously submitted deliverables and evaluations will remain safely recorded in your portal history.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setProjectToSwitchTo(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Keep Current
              </button>
              <button
                onClick={() => handleStartProject(projectToSwitchTo, true)}
                disabled={isEnrolling}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                {isEnrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-white" />}
                <span>Confirm & Start Project</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Propose Custom Project Modal ── */}
      {showProposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]">
          <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Propose a Custom Project Idea
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Submit your custom capstone or prototype concept for mentor review
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProposeModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleProposeProject} className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Project Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Customer Support Agent or SaaS Churn Predictor"
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                />
              </div>

              {/* Domain & Target Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Domain / Track</label>
                  <select
                    value={propDomain}
                    onChange={(e) => setPropDomain(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium cursor-pointer"
                  >
                    {DOMAINS.filter((d) => d.id !== 'all').map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Proposed Scope</label>
                  <select
                    value={`${propDifficulty}|${propDuration}`}
                    onChange={(e) => {
                      const [diff, dur] = e.target.value.split('|');
                      setPropDifficulty(diff as any);
                      setPropDuration(dur);
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium cursor-pointer"
                  >
                    <option value="Beginner|4 weeks">Beginner (4 Weeks, 500 pts)</option>
                    <option value="Intermediate|4 weeks">Intermediate (4 Weeks, 500 pts)</option>
                    <option value="Advanced|4 weeks">Advanced (4 Weeks, 500 pts)</option>
                  </select>
                </div>
              </div>

              {/* Tech Stack / Key Tools */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Proposed Tech Stack & Key Tools
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, Node.js, PostgreSQL, OpenAI API, TailwindCSS"
                  value={propTechStack}
                  onChange={(e) => setPropTechStack(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                />
              </div>

              {/* Problem Statement */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Problem Statement & Objective <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="What business problem or technical challenge does this project solve? What is the background context?"
                  value={propProblemStatement}
                  onChange={(e) => setPropProblemStatement(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                />
              </div>

              {/* Tangible Deliverables */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Planned Final Deliverables
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 1. Live deployed prototype/GitHub repo, 2. Standard Operating Procedure doc, 3. 3-min presentation video"
                  value={propDeliverables}
                  onChange={(e) => setPropDeliverables(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                />
              </div>

              {/* Reference Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Reference Spec, Figma or GitHub Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/your-username/repo or Notion doc link"
                  value={propReferenceUrl}
                  onChange={(e) => setPropReferenceUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProposeModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProposal}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingProposal ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Submit Proposal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

