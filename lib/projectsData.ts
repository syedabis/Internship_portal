// Central dataset for all 20 Internship Projects across 11 domains

export type CaseStudyData = {
  company: string;
  scenario: string;
  targetProblem: string;
  sampleBenchmark: string;
};

export type WeekPlanData = {
  week: number;
  title: string;
  objectives: string[];
  deliverables: string[];
  keyMetrics: string;
};

export type Project = {
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
  caseStudy?: CaseStudyData;
  weeklyPlan?: WeekPlanData[];
  finalDeliverable?: string;
  evaluationCriteria?: string[];
  created_at?: string;
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p_ai1',
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
    id: 'p_ai2',
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
    id: 'p_swe1',
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
    id: 'p_swe2',
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
    id: 'p_sec1',
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
    id: 'p_sec2',
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
    id: 'p1',
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
    id: 'p2',
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
    id: 'p3',
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
    id: 'p4',
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
    id: 'p5',
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
    id: 'p6',
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
    id: 'p7',
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
    id: 'p8',
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
    id: 'p9',
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
    id: 'p10',
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
    id: 'p11',
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
    id: 'p12',
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
    id: 'p13',
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
    id: 'p14',
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

