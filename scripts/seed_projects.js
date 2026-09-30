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
    scenario: 'The company has 200+ internal product markdown docs and FAQs. Employees and trial users waste hours searching for technical answers.',
    targetProblem: 'Lack of an accessible, accurate AI assistant that answers technical questions with verified source citations.',
    sampleBenchmark: 'An interactive Streamlit / Next.js AI assistant powered by OpenAI APIs and a lightweight vector store (FAISS/Chroma) that answers queries in <2 seconds with citations.',
  },
  swe: {
    company: 'PayPulse Fintech',
    scenario: 'The operations team relies on manual spreadsheets to track transaction reviews and customer accounts, leading to data errors and lack of access logs.',
    targetProblem: 'No centralized internal web application with secure authentication and structured CRUD data operations.',
    sampleBenchmark: 'A clean full-stack web application built with React/Next.js, Node.js, and Supabase/PostgreSQL with JWT authentication, validation, and CRUD operations.',
  },
  cybersecurity: {
    company: 'HealthTech Connect (HIPAA Compliance)',
    scenario: 'The startup is preparing for vendor security questionnaires and needs an audit of web application vulnerabilities and access control baselines.',
    targetProblem: 'Unidentified OWASP vulnerabilities, misconfigured HTTP headers, and lack of a documented incident response playbook.',
    sampleBenchmark: 'A detailed OWASP Top 10 security audit report using OWASP ZAP and browser tools, complete with CVSS risk scores, proof-of-concept steps, and remediation SOPs.',
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
    targetProblem: 'Inability to track which channels (Search vs Social vs Email) drive profitable customer acquisition.',
    sampleBenchmark: 'An omnichannel marketing strategy report with a live Looker Studio dashboard, UTM tracking framework, and high-converting ad copy templates.',
  },
  finance: {
    company: 'Vanguard Logistics',
    scenario: 'Leadership lacks real-time visibility into monthly cash burn and budget variance across operational departments.',
    targetProblem: 'Inaccurate runway forecasting leading to delayed investment decisions.',
    sampleBenchmark: 'A 3-statement financial model in Excel/Sheets with monthly cash flow projections, sensitivity analysis tables, and executive summary charts.',
  },
  product: {
    company: 'SaaSFlow Platform',
    scenario: 'Product team wants to launch a new workflow automation feature but lacks structured competitive analysis and user prioritization.',
    targetProblem: 'Risk of building unused features without clear GTM positioning and persona research.',
    sampleBenchmark: 'A GTM Strategy deck in Figma/Miro with RICE feature prioritization matrix, competitive analysis matrix, and user interview synthesis.',
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
    title: 'AI Document Knowledge Assistant & Q&A App',
    description: 'Build an interactive Retrieval-Augmented Generation (RAG) assistant using LangChain/LlamaIndex, OpenAI APIs, and a lightweight vector store (FAISS/Chroma) to answer questions from custom documentation with citations.',
    domain: 'ai',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    teamSize: '1–2',
    techStack: ['Python', 'LangChain', 'OpenAI API', 'FAISS / Chroma', 'Streamlit'],
    learningOutcomes: ['RAG architecture & chunking', 'Vector embeddings & similarity search', 'Prompt template design', 'Interactive Streamlit UI development'],
    points: 500,
    popularity: 98,
  },
  {
    title: 'AI Prompt Engineering & Chatbot Application',
    description: 'Design domain-specific prompt templates, build an interactive conversational assistant using OpenAI APIs, and create an automated prompt evaluation matrix to benchmark response quality.',
    domain: 'ai',
    difficulty: 'Beginner',
    duration: '4 weeks',
    teamSize: '1',
    techStack: ['Python', 'OpenAI API', 'Streamlit', 'Prompt Templates', 'JSON / Pandas'],
    learningOutcomes: ['Prompt engineering best practices', 'System vs User prompt crafting', 'Few-shot prompting techniques', 'Chatbot state management'],
    points: 500,
    popularity: 95,
  },
  {
    title: 'Full-Stack Web App with Auth & Database (CRUD)',
    description: 'Develop a responsive web application featuring user authentication, protected routes, relational database schema (CRUD operations), and automated API endpoint validation.',
    domain: 'swe',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    teamSize: '1–2',
    techStack: ['Next.js / React', 'Node.js / Express', 'Supabase / PostgreSQL', 'TailwindCSS', 'TypeScript'],
    learningOutcomes: ['Full-stack CRUD architecture', 'Relational database schema modeling', 'Secure JWT / OAuth authentication', 'RESTful API route handlers'],
    points: 500,
    popularity: 96,
  },
  {
    title: 'Interactive Analytics Dashboard & REST API Integration',
    description: 'Create a clean, responsive frontend dashboard that fetches data from public/mock REST APIs, transforms JSON data, and visualizes KPIs with interactive charts and filtering controls.',
    domain: 'swe',
    difficulty: 'Beginner',
    duration: '4 weeks',
    teamSize: '1',
    techStack: ['React / Next.js', 'TailwindCSS', 'Recharts', 'REST APIs', 'TypeScript'],
    learningOutcomes: ['API data fetching & error handling', 'Interactive data visualization', 'Component modularity & props design', 'Responsive UI layout'],
    points: 500,
    popularity: 92,
  },
  {
    title: 'Web Application Security Audit & OWASP Top 10 Checklist',
    description: 'Perform a systematic security assessment of web applications using automated scanning tools and browser DevTools, identify OWASP Top 10 vulnerabilities, and write practical remediation code snippets.',
    domain: 'cybersecurity',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    teamSize: '1–2',
    techStack: ['OWASP ZAP', 'Browser DevTools', 'Security Headers', 'CVSS Scoring', 'Remediation SOPs'],
    learningOutcomes: ['OWASP Top 10 vulnerability identification', 'Automated vulnerability scanning', 'CVSS severity score calculation', 'Security remediation documentation'],
    points: 500,
    popularity: 97,
  },
  {
    title: 'Security Baseline Audit & Incident Response Playbook',
    description: 'Evaluate access control configurations, audit authentication and security event logs, and build a step-by-step Incident Response (IR) playbook for handling phishing and credential compromise.',
    domain: 'cybersecurity',
    difficulty: 'Beginner',
    duration: '4 weeks',
    teamSize: '1',
    techStack: ['Access Control Matrix', 'Log Analysis', 'NIST Cybersecurity Framework', 'Incident Playbooks', 'Google Docs / Sheets'],
    learningOutcomes: ['Principle of least privilege auditing', 'Security event log interpretation', 'Incident triage & containment workflows', 'Security policy writing'],
    points: 500,
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
    points: 500,
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
    points: 500,
    popularity: 91,
  },
  {
    title: 'Omnichannel Digital Marketing & Campaign Strategy',
    description: 'Develop a cohesive multi-channel marketing campaign strategy across Search, Paid Social, and Email, complete with target persona messaging, budget allocation, and ROI tracking dashboards.',
    domain: 'marketing',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    teamSize: '1–2',
    techStack: ['Google Analytics 4', 'Meta Ads Manager', 'SEO Tools (Ahrefs/SEMrush)', 'Looker Studio', 'Canva'],
    learningOutcomes: ['Digital campaign planning', 'Customer acquisition cost (CAC) forecasting', 'UTM tracking & attribution modeling', 'Ad creative & copywriting strategy'],
    points: 500,
    popularity: 96,
  },
  {
    title: 'Corporate Financial Modeling & Cash Flow Forecast',
    description: 'Construct a structured 3-statement financial model, monthly cash flow projection, and variance analysis sheet for operational budgeting and executive decision-making.',
    domain: 'finance',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    teamSize: '1–2',
    techStack: ['Financial Modeling', 'Excel / Sheets (Advanced)', 'Power BI', 'QuickBooks / Xero', 'Variance Analysis'],
    learningOutcomes: ['3-statement financial modeling', 'Cash burn & runway forecasting', 'Budget variance analysis', 'Executive financial reporting'],
    points: 500,
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
    points: 500,
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
    points: 500,
    popularity: 85,
  },
  {
    title: 'Product Go-To-Market (GTM) Strategy & Competitive Analysis',
    description: 'Conduct a thorough competitive analysis, target persona validation, positioning framework, and RICE feature prioritization roadmap for launching a SaaS feature or product.',
    domain: 'product',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    teamSize: '1–2',
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
    points: 500,
    popularity: 89,
  },
  {
    title: 'HR Performance Management & OKR Evaluation Framework',
    description: 'Develop a quarterly OKR (Objectives & Key Results) tracking template, employee self-appraisal rubric, and structured 360-degree performance feedback process.',
    domain: 'hr',
    difficulty: 'Beginner',
    duration: '4 weeks',
    teamSize: '1',
    techStack: ['OKR Frameworks', 'Performance Management', 'Google Sheets', 'HR Analytics', 'Employee Feedback Design'],
    learningOutcomes: ['OKR goal setting methodology', 'Performance appraisal rubric design', '360-degree feedback framework', 'Employee growth mapping'],
    points: 500,
    popularity: 80,
  },
  {
    title: 'Outbound Cold Email & Lead Nurturing Campaign',
    description: 'Craft high-converting cold outreach email copy, setup automated drip sequences, conduct A/B subject line experiments, and analyze response rate conversions.',
    domain: 'sales',
    difficulty: 'Beginner',
    duration: '4 weeks',
    teamSize: '1',
    techStack: ['Copywriting', 'Apollo.io / Instantly', 'Email Deliverability Setup', 'HubSpot / Mailchimp', 'A/B Testing'],
    learningOutcomes: ['Cold email copywriting', 'Email deliverability (SPF/DKIM)', 'A/B testing methodology', 'Outreach response tracking'],
    points: 500,
    popularity: 87,
  },
  {
    title: 'Content Marketing Strategy & SEO Editorial Calendar',
    description: 'Perform keyword research, design a 3-month topic cluster strategy, write SEO-optimized long-form articles, and setup Google Search Console performance tracking.',
    domain: 'marketing',
    difficulty: 'Beginner',
    duration: '4 weeks',
    teamSize: '1',
    techStack: ['SEO Copywriting', 'SurferSEO', 'WordPress / CMS', 'Google Search Console', 'Editorial Calendar'],
    learningOutcomes: ['SEO keyword research & intent', 'Topic cluster strategy', 'Search engine content optimization', 'Editorial calendar management'],
    points: 500,
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
    points: 500,
    popularity: 78,
  },
  {
    title: 'No-Code Business Website & AI Customer Support Chatbot',
    description: 'Build a responsive, modern business website using no-code/low-code builders (Framer, Webflow, or WordPress) and integrate an intelligent AI customer support chatbot (Voiceflow, Chatbase, or Tidio) trained on business FAQs to capture leads and resolve inquiries 24/7 without writing complex backend code.',
    domain: 'swe',
    difficulty: 'Beginner',
    duration: '4 weeks',
    teamSize: '1',
    techStack: ['Framer / Webflow / WordPress', 'Voiceflow / Chatbase / Tidio', 'HTML/Script Embeds', 'Lead Forms & Webhooks', 'Google Analytics 4'],
    learningOutcomes: ['No-code responsive web layout & UX design', 'AI knowledge base curation & conversation flows', 'Third-party script widget embedding & triggers', 'Lead capture conversion tracking & analytics'],
    points: 500,
    popularity: 97,
  },
  {
    title: 'Digital Marketing Circulation, Content Syndication & Growth Engine',
    description: 'Build and execute an organic content circulation and distribution engine that repurposes high-value core insights into multi-platform formats (LinkedIn carousels, X threads, short-form video hooks, and email newsletters) to maximize circulation reach, referral loops, and subscriber acquisition.',
    domain: 'marketing',
    difficulty: 'Beginner',
    duration: '4 weeks',
    teamSize: '1',
    techStack: ['Content Syndication Frameworks', 'Email Newsletter (Substack / Mailchimp)', 'Social Scheduling (Buffer / Publer)', 'Canva / CapCut', 'Audience Analytics (Meta / LinkedIn / GA4)'],
    learningOutcomes: ['1-to-Many content repurposing & circulation workflows', 'Viral hook architecture & headline copywriting', 'Email newsletter audience growth & circulation metrics', 'Cross-channel engagement tracking & referral loop optimization'],
    points: 500,
    popularity: 95,
  }
];

async function seed() {
  console.log('Authenticating for seed operation...');
  let adminEmail = process.env.ADMIN_EMAIL || 'aun@datacrumbs.org';
  let adminPassword = process.env.ADMIN_PASSWORD || 'Password123!';
  
  let { data: auth, error: authErr } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });

  if (authErr && adminEmail !== 'aun@datacrumbs.org') {
    console.log('Trying fallback aun@datacrumbs.org...');
    const retry = await supabase.auth.signInWithPassword({
      email: 'aun@datacrumbs.org',
      password: 'Password123!',
    });
    auth = retry.data;
    authErr = retry.error;
  }

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

  console.log(`Seeding ${RAW_PROJECTS.length} calibrated projects (all 500 points) into Supabase...`);

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
      points: 500,
      popularity: p.popularity,
      case_study: caseStudy,
      final_deliverable: `A comprehensive executive case study for "${p.title}", complete with working prototype/templates, standardized SOP documentation, and a 3-5 minute video presentation.`,
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

  console.log(`Successfully seeded ${data.length} projects (all 500 points) into Supabase!`);
}

seed();
