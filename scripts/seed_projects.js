const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Helper to parse .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Supabase environment variables missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CASE_STUDIES = {
  ai: {
    company: 'Acme Cloud Intelligence (SaaS Startup)',
    scenario: 'The company has 500+ internal Notion & Slack docs. Employees waste 12+ hours/week searching for documentation.',
    targetProblem: 'No central AI system to answer technical questions with verified source citations.',
    sampleBenchmark: 'A Streamlit / Next.js RAG application connected to a Pinecone vector database that ingests markdown files, processes queries in < 2 seconds, and provides clickable source links.',
  },
  swe: {
    company: 'PayPulse Fintech',
    scenario: 'Monolithic API service crashes during high-traffic payment processing bursts due to database locking.',
    targetProblem: 'Lack of containerized microservices, rate limiting, and automated deployment pipelines.',
    sampleBenchmark: 'A TypeScript microservice built with Node.js/Express, JWT authentication, Redis rate limiting, Docker containerization, and a GitHub Actions CI/CD script.',
  },
  cybersecurity: {
    company: 'HealthTech Connect (HIPAA Compliance)',
    scenario: 'Preparing for a SOC-2 security audit, but lacks vulnerability scanning logs and SIEM incident playbooks.',
    targetProblem: 'Unidentified OWASP Top 10 vulnerabilities and manual threat detection processes.',
    sampleBenchmark: 'A detailed OWASP PenTest audit report generated via Burp Suite/OWASP ZAP, complete with CVSS risk scores, proof-of-concept steps, and code remediation snippets.',
  },
  hr: {
    company: 'Nova Workflows (50-Person Remote Team)',
    scenario: 'New remote hires report feeling lost during their first month because onboarding documents are scattered.',
    targetProblem: 'High 90-day employee churn rate (24%) due to unstructured onboarding.',
    sampleBenchmark: 'A Notion 30-60-90 Day Onboarding Portal with automated check-in milestones, mentor assignment rubrics, and a 1-page HR manager SOP.',
  },
  sales: {
    company: 'Apex B2B Solutions',
    scenario: 'Sales reps spend 65% of their day reviewing unqualified inbound leads with no systematic lead scoring algorithm.',
    targetProblem: 'Low sales pipeline velocity and missed quarterly revenue targets.',
    sampleBenchmark: 'An interactive Excel/HubSpot Quantitative Lead Scoring Model with lead tier routing (Hot/Warm/Cold) and a 5-step outbound email drip sequence.',
  },
  marketing: {
    company: 'Lumina Consumer Brand',
    scenario: 'Paid ad spend is increasing, but CAC (Customer Acquisition Cost) has risen 35% without clear UTM attribution.',
    targetProblem: 'Inability to track which channels (Search vs Social) drive profitable long-term LTV.',
    sampleBenchmark: 'An omnichannel marketing strategy report with a live Looker Studio dashboard, UTM tracking framework, and 3 high-converting ad copy templates.',
  },
  finance: {
    company: 'Vanguard Logistics',
    scenario: 'Leadership lacks real-time visibility into monthly cash burn and budget variance across operational departments.',
    targetProblem: 'Inaccurate runway forecasting leading to delayed investment decisions.',
    sampleBenchmark: 'A 3-statement financial model in Excel/Sheets with monthly cash flow projections, sensitivity analysis tables, and executive summary charts.',
  },
  product: {
    company: 'SaaSFlow Platform',
    scenario: 'Product team wants to launch a new automated workflow feature but lacks user research validation and prioritization.',
    targetProblem: 'Risk of building unused features without clear GTM positioning.',
    sampleBenchmark: 'A GTM Strategy deck in Figma/Miro with RICE feature prioritization matrix, competitive analysis matrix, and 5 user interview synthesis notes.',
  },
  operations: {
    company: 'Nexus Global Supply Chain',
    scenario: 'Supplier fulfillment delays average 18 days with 12% stockout rates across core distribution warehouses.',
    targetProblem: 'Lack of supplier SLA scoring, automated inventory reorder thresholds, and bottleneck mapping.',
    sampleBenchmark: 'An interactive Supply Chain Dashboard with vendor SLA scorecards, dynamic safety stock formulas, and end-to-end operational bottleneck audit.',
  },
  customersuccess: {
    company: 'CloudPulse Enterprise Software',
    scenario: 'Customer churn rate increased to 9.2% annually, with support ticket response times exceeding SLA targets.',
    targetProblem: 'No proactive health scoring system to flag at-risk accounts before contract renewal periods.',
    sampleBenchmark: 'A Customer Success Health Scoring model in Google Sheets/Notion with automated CSAT/NPS survey workflows, churn risk tiers, and customer onboarding journey maps.',
  },
  design: {
    company: 'Aura Fintech & Payments',
    scenario: 'Inconsistent typography, component sizing, and brand colors across web, mobile, and marketing channels.',
    targetProblem: 'Absence of unified brand style guidelines and scalable reusable component tokens.',
    sampleBenchmark: 'A comprehensive Brand Design System in Figma complete with typography hierarchy, WCAG-compliant color palettes, design tokens, and social marketing templates.',
  },
};

const RAW_PROJECTS = [
  {
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
  }
];

async function seed() {
  console.log('Authenticating as admin@datacrumbs.org...');
  const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_EMAILS?.split(',')[0]?.trim() || 'admin@datacrumbs.org';
  const adminPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS || 'admin123';
  const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });

  if (authErr) {
    console.error('Authentication failed:', authErr.message);
    process.exit(1);
  }

  console.log('Authenticated successfully:', auth.user.email);

  // Check existing projects count
  const { data: existing } = await supabase.from('projects').select('id');
  if (existing && existing.length > 0) {
    console.log(`Clearing ${existing.length} existing projects to avoid duplicates...`);
    for (const item of existing) {
      await supabase.from('projects').delete().eq('id', item.id);
    }
  }

  console.log(`Seeding ${RAW_PROJECTS.length} projects into Supabase...`);

  const payload = RAW_PROJECTS.map((p) => {
    const caseStudy = CASE_STUDIES[p.domain] || {
      company: 'Enterprise Organization Example',
      scenario: `The company needs a structured execution plan for ${p.title}.`,
      targetProblem: `Lack of standardized frameworks and SOP documentation for ${p.domain.toUpperCase()} operations.`,
      sampleBenchmark: `A comprehensive portfolio project featuring live operational templates and executive presentation video.`,
    };

    return {
      title: p.title,
      description: p.description,
      domain: p.domain,
      difficulty: p.difficulty,
      duration: p.duration,
      team_size: p.teamSize,
      tech_stack: p.techStack,
      learning_outcomes: p.learningOutcomes,
      points: p.points,
      popularity: p.popularity,
      case_study: caseStudy,
      final_deliverable: `A comprehensive executive case study for "${p.title}", complete with live dashboards/templates, standardized SOP documentation, and a 3-5 minute video presentation.`,
      evaluation_criteria: [
        'Strategic depth & problem-solving framework (25%)',
        'Execution completeness & template quality (25%)',
        'Data accuracy & analytical rigor (20%)',
        'Documentation & presentation clarity (15%)',
        'Tool mastery & automation efficiency (15%)',
      ],
    };
  });

  const { data, error } = await supabase.from('projects').insert(payload).select();

  if (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }

  console.log(`Successfully seeded ${data.length} projects into Supabase with full case studies and rubrics!`);
}

seed();
