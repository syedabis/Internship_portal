'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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
  Loader2,
  X,
  Cpu,
  Code,
  ShieldCheck,
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
    id: 'p_ai1',
    title: 'Enterprise AI RAG Knowledge Agent & Vector Pipeline',
    description: 'Build an end-to-end Retrieval-Augmented Generation (RAG) assistant using LangChain/LlamaIndex, vector embeddings, and OpenAI APIs to query technical documentation.',
    domain: 'ai',
    difficulty: 'Advanced',
    duration: '5 weeks',
    teamSize: '1–2',
    techStack: ['Python', 'LangChain', 'OpenAI API', 'Pinecone / Qdrant', 'Streamlit'],
    learningOutcomes: ['RAG architecture design', 'Vector database indexing', 'Prompt optimization', 'LLM latency benchmarking'],
    points: 500,
    popularity: 98,
  },
  {
    id: 'p_ai2',
    title: 'LLM Prompt Engineering & Fine-Tuning Evaluation',
    description: 'Construct automated evaluation pipelines, design domain-specific prompt strategies, and format JSONL datasets for fine-tuning open-source language models.',
    domain: 'ai',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    teamSize: '1',
    techStack: ['OpenAI Evals', 'Python / Pandas', 'HuggingFace', 'PromptLayer', 'JSONL Datasets'],
    learningOutcomes: ['LLM evaluation metrics', 'Dataset curation & cleaning', 'Few-shot prompt design', 'Model alignment auditing'],
    points: 400,
    popularity: 95,
  },
  {
    id: 'p_swe1',
    title: 'Full-Stack Microservices Architecture & API Gateway',
    description: 'Architect a scalable REST / GraphQL backend with JWT authentication, Redis rate limiting, Docker containerization, and GitHub Actions CI/CD workflows.',
    domain: 'swe',
    difficulty: 'Advanced',
    duration: '5 weeks',
    teamSize: '2–3',
    techStack: ['Node.js / Express', 'TypeScript', 'PostgreSQL', 'Docker', 'GitHub Actions'],
    learningOutcomes: ['Microservice decomposition', 'Database schema migration', 'CI/CD pipeline automation', 'API security & rate limiting'],
    points: 480,
    popularity: 96,
  },
  {
    id: 'p_swe2',
    title: 'Real-Time Analytics Dashboard & WebSockets Engine',
    description: 'Develop a high-performance frontend application using Next.js, WebSockets, and state management to render real-time streaming telemetry and interactive charts.',
    domain: 'swe',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    teamSize: '1–2',
    techStack: ['React / Next.js', 'TailwindCSS', 'WebSockets', 'Recharts', 'Zustand'],
    learningOutcomes: ['WebSockets connection lifecycle', 'State management optimization', 'Real-time UI updates', 'Responsive dashboard design'],
    points: 390,
    popularity: 92,
  },
  {
    id: 'p_sec1',
    title: 'Web Application Penetration Testing & Vulnerability Audit',
    description: 'Perform OWASP Top 10 security testing, execute automated vulnerability scans, identify injection flaws, and compile executive remediation reports.',
    domain: 'cybersecurity',
    difficulty: 'Advanced',
    duration: '5 weeks',
    teamSize: '1–2',
    techStack: ['Burp Suite', 'OWASP ZAP', 'Nmap', 'Threat Modeling', 'Security Remediation'],
    learningOutcomes: ['OWASP Top 10 exploitation', 'Vulnerability assessment', 'CVSS scoring framework', 'Security patch recommendations'],
    points: 500,
    popularity: 97,
  },
  {
    id: 'p_sec2',
    title: 'SOC SIEM Log Analysis & Threat Detection Playbooks',
    description: 'Configure SIEM log ingestion rules, detect unauthorized access attempts, analyze network pcap captures, and write automated incident response playbooks.',
    domain: 'cybersecurity',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    teamSize: '1',
    techStack: ['Splunk / Elastic SIEM', 'Wireshark', 'Log Parser', 'Mitre ATT&CK', 'Incident Playbooks'],
    learningOutcomes: ['SIEM query syntax (SPL/KQL)', 'Network protocol analysis', 'MITRE ATT&CK mapping', 'Automated containment steps'],
    points: 420,
    popularity: 91,
  },
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
      scenario: 'The company has 500+ internal Notion & Slack docs. Employees waste 12+ hours/week searching for documentation.',
      targetProblem: 'No central AI system to answer technical questions with verified source citations.',
      sampleBenchmark: 'A Streamlit / Next.js RAG application connected to a Pinecone vector database that ingests markdown files, processes queries in < 2 seconds, and provides clickable source links.',
    };
  }
  if (project.domain === 'swe') {
    return {
      company: 'PayPulse Fintech',
      scenario: 'Monolithic API service crashes during high-traffic payment processing bursts due to database locking.',
      targetProblem: 'Lack of containerized microservices, rate limiting, and automated deployment pipelines.',
      sampleBenchmark: 'A TypeScript microservice built with Node.js/Express, JWT authentication, Redis rate limiting, Docker containerization, and a GitHub Actions CI/CD script.',
    };
  }
  if (project.domain === 'cybersecurity') {
    return {
      company: 'HealthTech Connect (HIPAA Compliance)',
      scenario: 'Preparing for a SOC-2 security audit, but lacks vulnerability scanning logs and SIEM incident playbooks.',
      targetProblem: 'Unidentified OWASP Top 10 vulnerabilities and manual threat detection processes.',
      sampleBenchmark: 'A detailed OWASP PenTest audit report generated via Burp Suite/OWASP ZAP, complete with CVSS risk scores, proof-of-concept steps, and code remediation snippets.',
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
      targetProblem: 'Inability to track which channels (Search vs Social) drive profitable long-term LTV.',
      sampleBenchmark: 'An omnichannel marketing strategy report with a live Looker Studio dashboard, UTM tracking framework, and 3 high-converting ad copy templates.',
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
      scenario: 'Product team wants to launch a new automated workflow feature but lacks user research validation and prioritization.',
      targetProblem: 'Risk of building unused features without clear GTM positioning.',
      sampleBenchmark: 'A GTM Strategy deck in Figma/Miro with RICE feature prioritization matrix, competitive analysis matrix, and 5 user interview synthesis notes.',
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

  return {
    overview: `This ${project.duration} project will guide you through the execution of "${project.title}" — from strategy and process design to live deployment and reporting. You will leverage tools like ${project.techStack.join(', ')} to deliver a industry-standard portfolio project worth ${project.points} leaderboard points.`,
    exampleCaseStudy: getExampleCaseStudy(project),
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
  const [projectsList, setProjectsList] = useState<Project[]>(PROJECTS);
  const [activeDomain, setActiveDomain] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);

  // ── Weekly Submissions State ────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [submissions, setSubmissions] = useState<Record<number, any>>({});
  const [submittingWeek, setSubmittingWeek] = useState<number | null>(null);
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setCurrentUser(user));
  }, []);

  const loadSubmissionsForProject = async (projectId: string, userEmail?: string) => {
    if (!userEmail) return;
    try {
      const { data } = await supabase
        .from('project_submissions')
        .select('*')
        .eq('project_id', projectId)
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

  const handleSubmitDeliverable = async () => {
    if (!selectedProject || submittingWeek === null || !deliverableUrl.trim()) return;
    setIsSubmitting(true);
    const email = currentUser?.email || 'intern@datacrumbs.org';

    const payload = {
      user_email: email.toLowerCase().trim(),
      user_name: currentUser?.user_metadata?.full_name || email.split('@')[0],
      project_id: selectedProject.id,
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

      const newSub = data && data[0] ? data[0] : payload;
      setSubmissions((prev) => ({ ...prev, [submittingWeek]: newSub }));
    } catch (err) {
      console.error('Submission error:', err);
      setSubmissions((prev) => ({ ...prev, [submittingWeek]: payload }));
    }

    setIsSubmitting(false);
    setSubmittingWeek(null);
    setDeliverableUrl('');
    setSubmissionNotes('');
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
          points: p.points || 350,
          popularity: p.popularity || 90,
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

        {/* Project Header Banner with Dark Abstract Textured Background */}
        <div className="relative rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-800/80 overflow-hidden text-white">
          {/* Horizontally inverted background image */}
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
                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                  selectedProject.difficulty === 'Beginner'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                    : selectedProject.difficulty === 'Intermediate'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                    : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                }`}>
                  {selectedProject.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 leading-none">{selectedProject.points}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Points</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white leading-none">{selectedProject.duration}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Duration</div>
                </div>
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{selectedProject.title}</h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-4xl leading-relaxed mt-2">{selectedProject.description}</p>
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
                <span key={tech} className="px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-300 text-xs font-medium">
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

            {/* Real-World Example Case Study & Benchmark Card */}
            <div className="bg-black text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-white">Real-World Case Study & Benchmark Example</h2>
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
                            {/* Weekly Submission Action Bar */}
                            <div className="mt-4 p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                                  <FileCheck className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-slate-900">
                                    Week {week.week} Submission Status
                                  </div>
                                  <div className="text-[11px] text-slate-500 mt-0.5">
                                    {submissions[week.week] ? (
                                      <span className="flex items-center gap-1.5 font-semibold text-amber-600">
                                        <Clock className="w-3 h-3" /> Submitted (Pending Review)
                                      </span>
                                    ) : (
                                      'Not submitted yet. Complete deliverables and submit link.'
                                    )}
                                  </div>
                                </div>
                              </div>

                              {submissions[week.week] ? (
                                <div className="flex items-center gap-2">
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
                                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
                                  >
                                    Update
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setSubmittingWeek(week.week)}
                                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
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

              {/* View Plan Button */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleGeneratePlan(project)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View Project Plan</span>
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

      {/* ── Submission Modal ── */}
      {submittingWeek !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
                  <Send className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Submit Week {submittingWeek} Deliverable
                  </h3>
                  <p className="text-xs text-slate-500 truncate max-w-xs font-medium">{(selectedProject as any)?.title}</p>
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
    </div>
  );
};
