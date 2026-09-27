// Central dataset for all 18 Internship Projects across 11 domains

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
  }
];
