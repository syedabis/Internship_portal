'use client';

import React, { useState } from 'react';
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
  popularity: number;
}

const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'HR Talent Acquisition & Onboarding Workflow',
    description: 'Design and implement a structured talent pipeline, 30-60-90 day employee onboarding journey, automated check-ins, and performance feedback frameworks for a remote workforce.',
    domain: 'hr',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    teamSize: '1–2',
    techStack: ['HRIS Frameworks', 'Notion', 'Excel / Sheets', 'LMS Tools', 'Process Mapping'],
    learningOutcomes: ['End-to-end recruitment funnel', 'Onboarding SLA design', 'Employee retention strategies', 'HR metrics & analytics'],
    points: 350,
    popularity: 94,
  },
  {
    id: 'p2',
    title: 'B2B Sales Pipeline & Lead Scoring Engine',
    description: 'Build an outbound sales pipeline strategy, define ideal customer profiles (ICPs), create a quantitative lead scoring model, and design automated email follow-up workflows.',
    domain: 'sales',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    teamSize: '1–2',
    techStack: ['HubSpot CRM', 'Salesforce Logic', 'LinkedIn Sales Navigator', 'Excel Financials', 'Email Automation'],
    learningOutcomes: ['B2B prospecting methodology', 'CRM pipeline optimization', 'Lead scoring algorithms', 'Sales conversion tracking'],
    points: 380,
    popularity: 91,
  },
  {
    id: 'p3',
    title: 'Omnichannel Digital Growth & ROI Campaign',
    description: 'Develop a multi-channel digital marketing campaign strategy across Search, Paid Social, and Content Marketing, complete with CAC/LTV forecasting and live ROI analytics dashboards.',
    domain: 'marketing',
    difficulty: 'Advanced',
    duration: '5 weeks',
    teamSize: '2–3',
    techStack: ['Google Analytics 4', 'Meta Ads Manager', 'SEO Tools (Ahrefs/SEMrush)', 'Looker Studio', 'Canva'],
    learningOutcomes: ['Performance marketing strategy', 'Customer acquisition cost (CAC)', 'UTM attribution modeling', 'Data-driven ad copywriting'],
    points: 450,
    popularity: 96,
  },
  {
    id: 'p4',
    title: 'Corporate Financial Modeling & Cash Flow Forecast',
    description: 'Construct a 3-statement financial model, monthly cash flow forecast, and variance analysis system for quarterly operational budgeting and executive decision-making.',
    domain: 'finance',
    difficulty: 'Advanced',
    duration: '5 weeks',
    teamSize: '1–2',
    techStack: ['Financial Modeling', 'Excel / Sheets (Advanced)', 'Power BI', 'QuickBooks / Xero', 'Variance Analysis'],
    learningOutcomes: ['3-statement financial modeling', 'Cash burn & runway forecasting', 'Budget variance analysis', 'Executive financial reporting'],
    points: 480,
    popularity: 88,
  },
  {
    id: 'p5',
    title: 'Supply Chain & Vendor Performance Management',
    description: 'Establish vendor evaluation SLAs, procurement tracking frameworks, and inventory optimization models to reduce supply chain delays and operational expenditure.',
    domain: 'operations',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    teamSize: '1–2',
    techStack: ['Operations Process Mapping', 'ERP Systems', 'Excel / Power Pivot', 'SLA Frameworks', 'Risk Assessment'],
    learningOutcomes: ['Vendor SLA management', 'Inventory replenishment logic', 'Operational bottleneck audit', 'Cost reduction strategy'],
    points: 360,
    popularity: 82,
  },
  {
    id: 'p6',
    title: 'Customer Retention & CSAT Health Score System',
    description: 'Analyze customer churn drivers, design an automated NPS/CSAT survey workflow, and build a proactive customer health score playbook to expand account expansion revenue.',
    domain: 'customersuccess',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    teamSize: '1–2',
    techStack: ['Zendesk / Freshdesk', 'NPS Analytics', 'Customer Journey Mapping', 'Churn Analysis', 'Gainsight Frameworks'],
    learningOutcomes: ['Net Promoter Score (NPS) methodology', 'Customer health scoring', 'Churn reduction tactics', 'Account expansion playbooks'],
    points: 340,
    popularity: 85,
  },
  {
    id: 'p7',
    title: 'Product Go-To-Market (GTM) & Competitive Positioning',
    description: 'Conduct a comprehensive competitive analysis, user persona validation, positioning framework, and RICE feature prioritization matrix for launching a new SaaS product feature.',
    domain: 'product',
    difficulty: 'Advanced',
    duration: '5 weeks',
    teamSize: '1–3',
    techStack: ['Product Strategy', 'Miro / Figma', 'User Research Methods', 'RICE Prioritization', 'Feature Roadmapping'],
    learningOutcomes: ['GTM product strategy', 'Competitive benchmarking', 'User interview synthesis', 'RICE prioritization framework'],
    points: 500,
    popularity: 93,
  },
  {
    id: 'p8',
    title: 'Corporate Brand Identity & Marketing Design System',
    description: 'Produce a complete brand identity package including visual design guidelines, social media creative templates, investor pitch decks, and digital ad marketing collateral.',
    domain: 'design',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    teamSize: '1–2',
    techStack: ['Figma', 'Adobe Illustrator', 'Photoshop', 'Brand Guidelines', 'Visual Asset Design'],
    learningOutcomes: ['Corporate visual identity', 'Brand style guide creation', 'Marketing collateral design', 'Design token consistency'],
    points: 320,
    popularity: 89,
  },
  {
    id: 'p9',
    title: 'HR Performance Management & OKR Evaluation Framework',
    description: 'Develop a quarterly OKR (Objectives & Key Results) tracking template, employee self-appraisal rubric, and structured 360-degree performance feedback process.',
    domain: 'hr',
    difficulty: 'Beginner',
    duration: '3 weeks',
    teamSize: '1',
    techStack: ['OKR Frameworks', 'Performance Management', 'Google Sheets', 'HR Analytics', 'Employee Feedback Design'],
    learningOutcomes: ['OKR goal setting methodology', 'Performance appraisal rubric design', '360-degree feedback framework', 'Employee growth mapping'],
    points: 260,
    popularity: 80,
  },
  {
    id: 'p10',
    title: 'Outbound Cold Email & Lead Nurturing Campaign',
    description: 'Craft high-converting cold outreach email copy, setup automated drip sequences, conduct A/B subject line experiments, and analyze response rate conversions.',
    domain: 'sales',
    difficulty: 'Beginner',
    duration: '3 weeks',
    teamSize: '1',
    techStack: ['Copywriting', 'Apollo.io / Instantly', 'Email Deliverability Setup', 'HubSpot / Mailchimp', 'A/B Testing'],
    learningOutcomes: ['Cold email copywriting', 'Email deliverability (SPF/DKIM)', 'A/B testing methodology', 'Outreach response tracking'],
    points: 280,
    popularity: 87,
  },
  {
    id: 'p11',
    title: 'Content Marketing Strategy & SEO Editorial Calendar',
    description: 'Perform keyword research, design a 3-month topic cluster strategy, write SEO-optimized long-form articles, and setup Google Search Console performance tracking.',
    domain: 'marketing',
    difficulty: 'Beginner',
    duration: '3 weeks',
    teamSize: '1',
    techStack: ['SEO Copywriting', 'SurferSEO', 'WordPress / CMS', 'Google Search Console', 'Editorial Calendar'],
    learningOutcomes: ['SEO keyword research & intent', 'Topic cluster strategy', 'Search engine content optimization', 'Editorial calendar management'],
    points: 270,
    popularity: 84,
  },
  {
    id: 'p12',
    title: 'Support SLA Architecture & Knowledge Base Optimization',
    description: 'Rearchitect customer support ticket tiers, write 20+ standardized self-service help center articles, and implement workflows to reduce First Response Time (FRT).',
    domain: 'customersuccess',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    teamSize: '1–2',
    techStack: ['Helpdesk Administration', 'Technical Writing', 'Knowledge Base Design', 'Ticket Analytics', 'SLA Management'],
    learningOutcomes: ['SLA escalation rules', 'Knowledge base taxonomy', 'Help center technical writing', 'Support queue optimization'],
    points: 330,
    popularity: 78,
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

  return {
    overview: `This ${project.duration} project will guide you through the execution of "${project.title}" — from strategy and process design to live deployment and reporting. You will leverage tools like ${project.techStack.join(', ')} to deliver a industry-standard portfolio project worth ${project.points} leaderboard points.`,
    weeklyPlan: weeklyPlans,
    techStackBreakdown: project.techStack.map((tech) => ({
      name: tech,
      role: getTechRole(tech),
    })),
    finalDeliverable: `A comprehensive executive case study for "${project.title}", complete with live dashboards/templates, standardized SOP documentation, and a 3-5 minute video presentation.`,
    evaluationCriteria: [
      'Strategic depth & problem-solving framework (25%)',
      'Execution completeness & template quality (25%)',
      'Data accuracy & analytical rigor (20%)',
      'Documentation & presentation clarity (15%)',
      'Tool mastery & automation efficiency (15%)',
    ],
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
  };
  return roles[tech] || 'Supporting business tool';
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

            {/* Tools & Methodology Breakdown */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4.5 h-4.5 text-blue-600" />
                  <h2 className="text-base font-extrabold text-slate-900">Tools & Methodology Breakdown</h2>
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
                    `\n## Tools & Methodology\n${generatedPlan.techStackBreakdown.map((t) => `- **${t.name}**: ${t.role}`).join('\n')}`,
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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-emerald-600" />
          <span>Internship Projects</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-2xl">
          Select a project aligned with your domain (HR, Sales, Marketing, Finance, Operations, Product, CS, Design), generate a detailed execution plan, and earn leaderboard points upon completion.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Projects', value: PROJECTS.length.toString(), icon: '/Icons/4.png' },
          { label: 'Domains', value: (DOMAINS.length - 1).toString(), icon: '/Icons/5.png' },
          { label: 'Max Points', value: '500', icon: '/Icons/6.png' },
          { label: 'Avg Duration', value: '4.2 wks', icon: '/Icons/7.png' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={stat.icon} alt={stat.label} className="w-9 h-9 object-contain" />
            </div>
            <div className="min-w-0">
              <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none">{stat.value}</div>
              <div className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase mt-1 truncate">{stat.label}</div>
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
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
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
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                difficultyFilter === diff
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Count */}
      <div className="text-xs text-slate-500 font-medium">
        Showing {filteredProjects.length} of {PROJECTS.length} projects
      </div>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map((project) => {
          const domain = DOMAINS.find((d) => d.id === project.domain);
          const DomainIcon = domain?.icon || Layers;

          return (
            <div
              key={project.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${domain?.bgColor} ${domain?.color} ${domain?.borderColor} flex items-center gap-1`}>
                      <DomainIcon className="w-3 h-3" />
                      {domain?.label}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${getDifficultyStyles(project.difficulty)}`}>
                      {project.difficulty}
                    </span>
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

                {/* Tech / Tools Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/80 text-slate-700 text-[10px] font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Generate Plan Button */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleGeneratePlan(project)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Generate Project Plan</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
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
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
