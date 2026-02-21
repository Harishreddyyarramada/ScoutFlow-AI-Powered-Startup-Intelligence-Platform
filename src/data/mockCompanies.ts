export interface Signal {
  type: 'hiring' | 'blog' | 'funding' | 'founder' | 'product' | 'website';
  label: string;
  timestamp: string;
}

export interface EnrichmentData {
  summary: string;
  bullets: string[];
  keywords: string[];
  signals: { label: string; detected: boolean }[];
  sources: { url: string; fetchedAt: string }[];
  fetchedAt: string;
}

export interface Company {
  id: string;
  name: string;
  website: string;
  sector: string;
  stage: string;
  location: string;
  foundedYear: number;
  score: number;
  scoreBreakdown: {
    sectorMatch: number;
    stageMatch: number;
    hiringActivity: number;
    technicalSignals: number;
    blogFreshness: number;
  };
  tags: string[];
  signals: Signal[];
  enriched: boolean;
  enrichmentData?: EnrichmentData;
  description: string;
  employees: string;
}

export const SECTORS = ['AI', 'Fintech', 'DevTools', 'Climate', 'SaaS', 'Health', 'Security'] as const;
export const STAGES = ['Pre-seed', 'Seed', 'Series A', 'Series B'] as const;
export const LOCATIONS = ['San Francisco', 'New York', 'London', 'Berlin', 'Singapore', 'Toronto', 'Tel Aviv', 'Austin', 'Seattle', 'Boston'] as const;

const mockEnrichment: EnrichmentData = {
  summary: "An innovative technology company leveraging cutting-edge solutions to transform their target industry with a strong focus on developer experience and scalability.",
  bullets: [
    "Building next-generation platform for enterprise customers",
    "Strong technical team with experience from top tech companies",
    "Recently launched v2.0 with significant performance improvements",
    "Growing customer base across multiple verticals",
    "Open-source contributions and active developer community",
  ],
  keywords: ["AI", "platform", "enterprise", "developer-tools", "API", "automation", "scalable", "cloud-native"],
  signals: [
    { label: "Careers page exists", detected: true },
    { label: "Blog updated recently", detected: true },
    { label: "Changelog detected", detected: true },
    { label: "API documentation found", detected: false },
  ],
  sources: [
    { url: "https://example.com", fetchedAt: new Date().toISOString() },
    { url: "https://example.com/about", fetchedAt: new Date().toISOString() },
    { url: "https://example.com/blog", fetchedAt: new Date().toISOString() },
  ],
  fetchedAt: new Date().toISOString(),
};

export const mockCompanies: Company[] = [
  { id: '1', name: 'NeuralPath AI', website: 'https://neuralpath.ai', sector: 'AI', stage: 'Seed', location: 'San Francisco', foundedYear: 2023, score: 92, scoreBreakdown: { sectorMatch: 30, stageMatch: 25, hiringActivity: 20, technicalSignals: 12, blogFreshness: 5 }, tags: ['LLM', 'Enterprise', 'NLP'], signals: [{ type: 'hiring', label: '5 new roles posted', timestamp: '2026-02-18T10:00:00Z' }, { type: 'blog', label: 'Published "Scaling LLMs"', timestamp: '2026-02-15T08:00:00Z' }, { type: 'funding', label: 'Rumored $4M round', timestamp: '2026-02-10T12:00:00Z' }], enriched: false, description: 'Building enterprise-grade LLM infrastructure for regulated industries.', employees: '15-30' },
  { id: '2', name: 'Stackweave', website: 'https://stackweave.dev', sector: 'DevTools', stage: 'Pre-seed', location: 'Austin', foundedYear: 2024, score: 78, scoreBreakdown: { sectorMatch: 20, stageMatch: 20, hiringActivity: 15, technicalSignals: 15, blogFreshness: 8 }, tags: ['CI/CD', 'Infrastructure', 'Open Source'], signals: [{ type: 'product', label: 'Launched v2.0', timestamp: '2026-02-12T14:00:00Z' }, { type: 'hiring', label: '3 engineering roles', timestamp: '2026-02-08T09:00:00Z' }], enriched: false, description: 'Next-gen CI/CD pipelines with built-in observability and AI-powered debugging.', employees: '5-10' },
  { id: '3', name: 'Carbonex', website: 'https://carbonex.io', sector: 'Climate', stage: 'Series A', location: 'London', foundedYear: 2022, score: 85, scoreBreakdown: { sectorMatch: 25, stageMatch: 20, hiringActivity: 20, technicalSignals: 10, blogFreshness: 10 }, tags: ['Carbon Credits', 'Marketplace', 'B2B'], signals: [{ type: 'funding', label: 'Closed $12M Series A', timestamp: '2026-01-28T16:00:00Z' }, { type: 'hiring', label: '8 new positions', timestamp: '2026-02-05T11:00:00Z' }, { type: 'blog', label: 'Q4 Impact Report', timestamp: '2026-01-20T10:00:00Z' }], enriched: false, description: 'Digital marketplace for verified carbon credits with real-time pricing and verification.', employees: '30-50' },
  { id: '4', name: 'PayGrid', website: 'https://paygrid.com', sector: 'Fintech', stage: 'Seed', location: 'New York', foundedYear: 2023, score: 88, scoreBreakdown: { sectorMatch: 28, stageMatch: 22, hiringActivity: 18, technicalSignals: 12, blogFreshness: 8 }, tags: ['Payments', 'API', 'B2B'], signals: [{ type: 'product', label: 'API v3 launched', timestamp: '2026-02-14T13:00:00Z' }, { type: 'founder', label: 'CEO spoke at FinTech Summit', timestamp: '2026-02-01T09:00:00Z' }], enriched: false, description: 'Unified payment orchestration API for multi-currency B2B transactions.', employees: '20-40' },
  { id: '5', name: 'SentinelOps', website: 'https://sentinelops.io', sector: 'Security', stage: 'Series A', location: 'Tel Aviv', foundedYear: 2022, score: 81, scoreBreakdown: { sectorMatch: 22, stageMatch: 20, hiringActivity: 18, technicalSignals: 14, blogFreshness: 7 }, tags: ['Cybersecurity', 'DevSecOps', 'Cloud'], signals: [{ type: 'hiring', label: '12 roles posted', timestamp: '2026-02-16T10:00:00Z' }, { type: 'blog', label: 'Zero-day research published', timestamp: '2026-02-10T08:00:00Z' }], enriched: false, description: 'Automated security posture management for cloud-native applications.', employees: '40-60' },
  { id: '6', name: 'VoxHealth', website: 'https://voxhealth.ai', sector: 'Health', stage: 'Pre-seed', location: 'Boston', foundedYear: 2024, score: 73, scoreBreakdown: { sectorMatch: 18, stageMatch: 20, hiringActivity: 15, technicalSignals: 10, blogFreshness: 10 }, tags: ['Voice AI', 'Healthcare', 'Patient Care'], signals: [{ type: 'product', label: 'Beta launched', timestamp: '2026-02-06T15:00:00Z' }], enriched: false, description: 'Voice-first AI assistant for patient intake and clinical documentation.', employees: '3-8' },
  { id: '7', name: 'DataForge', website: 'https://dataforge.dev', sector: 'DevTools', stage: 'Seed', location: 'Seattle', foundedYear: 2023, score: 76, scoreBreakdown: { sectorMatch: 20, stageMatch: 22, hiringActivity: 14, technicalSignals: 12, blogFreshness: 8 }, tags: ['Data Pipeline', 'ETL', 'Real-time'], signals: [{ type: 'hiring', label: '4 roles posted', timestamp: '2026-02-13T11:00:00Z' }, { type: 'website', label: 'New docs site launched', timestamp: '2026-02-07T14:00:00Z' }], enriched: false, description: 'Real-time data pipeline orchestration with visual debugging and schema evolution.', employees: '10-20' },
  { id: '8', name: 'GreenVolt', website: 'https://greenvolt.energy', sector: 'Climate', stage: 'Seed', location: 'Berlin', foundedYear: 2023, score: 70, scoreBreakdown: { sectorMatch: 22, stageMatch: 20, hiringActivity: 10, technicalSignals: 10, blogFreshness: 8 }, tags: ['Energy', 'IoT', 'Smart Grid'], signals: [{ type: 'blog', label: 'EU regulation analysis', timestamp: '2026-02-09T10:00:00Z' }], enriched: false, description: 'Smart grid optimization using IoT sensors and predictive analytics for renewable energy.', employees: '10-15' },
  { id: '9', name: 'Clarifin', website: 'https://clarifin.com', sector: 'Fintech', stage: 'Series A', location: 'Singapore', foundedYear: 2021, score: 90, scoreBreakdown: { sectorMatch: 28, stageMatch: 22, hiringActivity: 20, technicalSignals: 12, blogFreshness: 8 }, tags: ['Compliance', 'RegTech', 'KYC'], signals: [{ type: 'funding', label: 'Series A at $15M', timestamp: '2026-01-15T08:00:00Z' }, { type: 'hiring', label: '10 roles across APAC', timestamp: '2026-02-11T09:00:00Z' }, { type: 'founder', label: 'CTO featured in TechCrunch', timestamp: '2026-02-03T14:00:00Z' }], enriched: false, description: 'AI-powered compliance automation for financial institutions across Asia-Pacific.', employees: '50-80' },
  { id: '10', name: 'MeshQL', website: 'https://meshql.io', sector: 'DevTools', stage: 'Pre-seed', location: 'San Francisco', foundedYear: 2025, score: 65, scoreBreakdown: { sectorMatch: 18, stageMatch: 18, hiringActivity: 10, technicalSignals: 12, blogFreshness: 7 }, tags: ['GraphQL', 'API Gateway', 'Open Source'], signals: [{ type: 'product', label: 'Open source launch', timestamp: '2026-02-17T12:00:00Z' }], enriched: false, description: 'Federated GraphQL gateway with automatic schema stitching and real-time subscriptions.', employees: '2-5' },
  { id: '11', name: 'Synthetica', website: 'https://synthetica.ai', sector: 'AI', stage: 'Series A', location: 'Toronto', foundedYear: 2022, score: 87, scoreBreakdown: { sectorMatch: 28, stageMatch: 20, hiringActivity: 19, technicalSignals: 12, blogFreshness: 8 }, tags: ['Synthetic Data', 'Privacy', 'ML'], signals: [{ type: 'funding', label: '$10M Series A', timestamp: '2026-01-25T10:00:00Z' }, { type: 'hiring', label: '7 ML engineer roles', timestamp: '2026-02-14T09:00:00Z' }], enriched: false, description: 'Privacy-preserving synthetic data generation for enterprise ML training pipelines.', employees: '25-40' },
  { id: '12', name: 'Lumi Health', website: 'https://lumihealth.co', sector: 'Health', stage: 'Seed', location: 'London', foundedYear: 2023, score: 72, scoreBreakdown: { sectorMatch: 18, stageMatch: 20, hiringActivity: 14, technicalSignals: 10, blogFreshness: 10 }, tags: ['Mental Health', 'B2C', 'Mobile'], signals: [{ type: 'product', label: 'iOS app launched', timestamp: '2026-02-08T16:00:00Z' }, { type: 'blog', label: 'Clinical study results', timestamp: '2026-02-02T10:00:00Z' }], enriched: false, description: 'Evidence-based digital mental health platform with personalized therapy programs.', employees: '15-25' },
  { id: '13', name: 'Covalent Cloud', website: 'https://covalentcloud.com', sector: 'SaaS', stage: 'Series B', location: 'San Francisco', foundedYear: 2020, score: 83, scoreBreakdown: { sectorMatch: 22, stageMatch: 18, hiringActivity: 20, technicalSignals: 13, blogFreshness: 10 }, tags: ['Multi-cloud', 'Platform', 'Enterprise'], signals: [{ type: 'hiring', label: '15 roles globally', timestamp: '2026-02-15T11:00:00Z' }, { type: 'funding', label: '$30M Series B', timestamp: '2026-01-10T08:00:00Z' }], enriched: false, description: 'Multi-cloud management platform with cost optimization and automated governance.', employees: '80-120' },
  { id: '14', name: 'AltLayer', website: 'https://altlayer.xyz', sector: 'DevTools', stage: 'Seed', location: 'Singapore', foundedYear: 2023, score: 68, scoreBreakdown: { sectorMatch: 18, stageMatch: 20, hiringActivity: 12, technicalSignals: 10, blogFreshness: 8 }, tags: ['Web3', 'Rollup', 'Infrastructure'], signals: [{ type: 'product', label: 'Mainnet launch', timestamp: '2026-02-04T12:00:00Z' }], enriched: false, description: 'Rollup-as-a-service platform enabling custom execution layers for decentralized applications.', employees: '10-20' },
  { id: '15', name: 'Therma', website: 'https://therma.io', sector: 'Climate', stage: 'Series A', location: 'Austin', foundedYear: 2021, score: 79, scoreBreakdown: { sectorMatch: 24, stageMatch: 20, hiringActivity: 15, technicalSignals: 12, blogFreshness: 8 }, tags: ['HVAC', 'Energy Efficiency', 'IoT'], signals: [{ type: 'hiring', label: '6 roles posted', timestamp: '2026-02-12T10:00:00Z' }, { type: 'blog', label: 'DOE partnership announced', timestamp: '2026-02-06T09:00:00Z' }], enriched: false, description: 'AI-powered HVAC optimization reducing commercial building energy consumption by 30%.', employees: '30-45' },
  { id: '16', name: 'Vectrix', website: 'https://vectrix.ai', sector: 'AI', stage: 'Pre-seed', location: 'Berlin', foundedYear: 2025, score: 71, scoreBreakdown: { sectorMatch: 25, stageMatch: 18, hiringActivity: 10, technicalSignals: 10, blogFreshness: 8 }, tags: ['Computer Vision', 'Manufacturing', 'Quality'], signals: [{ type: 'product', label: 'MVP demo released', timestamp: '2026-02-16T14:00:00Z' }], enriched: false, description: 'Computer vision quality inspection system for precision manufacturing lines.', employees: '3-6' },
  { id: '17', name: 'Paylo', website: 'https://paylo.co', sector: 'Fintech', stage: 'Pre-seed', location: 'New York', foundedYear: 2025, score: 62, scoreBreakdown: { sectorMatch: 22, stageMatch: 15, hiringActivity: 8, technicalSignals: 10, blogFreshness: 7 }, tags: ['Embedded Finance', 'API', 'SMB'], signals: [{ type: 'founder', label: 'Ex-Stripe team', timestamp: '2026-02-01T10:00:00Z' }], enriched: false, description: 'Embedded finance API enabling SMBs to offer lending and insurance products.', employees: '2-5' },
  { id: '18', name: 'Armada Security', website: 'https://armada.sec', sector: 'Security', stage: 'Seed', location: 'Boston', foundedYear: 2023, score: 77, scoreBreakdown: { sectorMatch: 22, stageMatch: 20, hiringActivity: 15, technicalSignals: 12, blogFreshness: 8 }, tags: ['API Security', 'Zero Trust', 'Enterprise'], signals: [{ type: 'hiring', label: '5 security engineers', timestamp: '2026-02-13T09:00:00Z' }, { type: 'blog', label: 'API threat landscape report', timestamp: '2026-02-08T10:00:00Z' }], enriched: false, description: 'API-first zero trust security platform protecting enterprise microservice architectures.', employees: '15-25' },
  { id: '19', name: 'Bloom Analytics', website: 'https://bloomanalytics.co', sector: 'SaaS', stage: 'Seed', location: 'Toronto', foundedYear: 2024, score: 74, scoreBreakdown: { sectorMatch: 20, stageMatch: 20, hiringActivity: 14, technicalSignals: 12, blogFreshness: 8 }, tags: ['Product Analytics', 'Privacy-first', 'B2B'], signals: [{ type: 'product', label: 'GA4 migration tool', timestamp: '2026-02-10T11:00:00Z' }, { type: 'hiring', label: '3 engineering roles', timestamp: '2026-02-05T09:00:00Z' }], enriched: false, description: 'Privacy-first product analytics with cookieless tracking and GDPR compliance built in.', employees: '8-15' },
  { id: '20', name: 'Cortex Labs', website: 'https://cortexlabs.ai', sector: 'AI', stage: 'Series B', location: 'San Francisco', foundedYear: 2020, score: 95, scoreBreakdown: { sectorMatch: 30, stageMatch: 20, hiringActivity: 22, technicalSignals: 15, blogFreshness: 8 }, tags: ['AGI', 'Research', 'Enterprise AI'], signals: [{ type: 'funding', label: '$50M Series B', timestamp: '2026-02-01T08:00:00Z' }, { type: 'hiring', label: '20+ roles posted', timestamp: '2026-02-14T10:00:00Z' }, { type: 'blog', label: 'New reasoning paper', timestamp: '2026-02-12T09:00:00Z' }], enriched: false, description: 'Building foundational reasoning models for complex enterprise decision-making systems.', employees: '100-150' },
  { id: '21', name: 'FleetEdge', website: 'https://fleetedge.io', sector: 'SaaS', stage: 'Series A', location: 'Seattle', foundedYear: 2022, score: 80, scoreBreakdown: { sectorMatch: 22, stageMatch: 20, hiringActivity: 18, technicalSignals: 12, blogFreshness: 8 }, tags: ['Fleet Management', 'Logistics', 'IoT'], signals: [{ type: 'hiring', label: '8 roles posted', timestamp: '2026-02-11T10:00:00Z' }, { type: 'product', label: 'ELD integration shipped', timestamp: '2026-02-07T14:00:00Z' }], enriched: false, description: 'AI-powered fleet management platform optimizing routes, compliance, and driver safety.', employees: '35-55' },
  { id: '22', name: 'GenomeKit', website: 'https://genomekit.bio', sector: 'Health', stage: 'Series A', location: 'Boston', foundedYear: 2021, score: 82, scoreBreakdown: { sectorMatch: 20, stageMatch: 20, hiringActivity: 18, technicalSignals: 14, blogFreshness: 10 }, tags: ['Genomics', 'Diagnostics', 'ML'], signals: [{ type: 'funding', label: '$8M Series A', timestamp: '2026-01-20T10:00:00Z' }, { type: 'blog', label: 'FDA breakthrough designation', timestamp: '2026-02-09T08:00:00Z' }], enriched: false, description: 'ML-powered genomic analysis platform accelerating rare disease diagnostics.', employees: '25-40' },
  { id: '23', name: 'Nexus Finance', website: 'https://nexusfi.com', sector: 'Fintech', stage: 'Series B', location: 'London', foundedYear: 2020, score: 86, scoreBreakdown: { sectorMatch: 26, stageMatch: 18, hiringActivity: 20, technicalSignals: 14, blogFreshness: 8 }, tags: ['Treasury', 'Enterprise', 'Automation'], signals: [{ type: 'funding', label: '$25M Series B', timestamp: '2026-01-30T08:00:00Z' }, { type: 'hiring', label: '12 roles in Europe', timestamp: '2026-02-13T10:00:00Z' }], enriched: false, description: 'Automated treasury management platform for mid-market enterprises across Europe.', employees: '60-90' },
  { id: '24', name: 'Prism AI', website: 'https://prismai.dev', sector: 'AI', stage: 'Seed', location: 'Tel Aviv', foundedYear: 2024, score: 84, scoreBreakdown: { sectorMatch: 28, stageMatch: 22, hiringActivity: 14, technicalSignals: 12, blogFreshness: 8 }, tags: ['Code Generation', 'IDE', 'Productivity'], signals: [{ type: 'product', label: 'VS Code extension launched', timestamp: '2026-02-15T12:00:00Z' }, { type: 'hiring', label: '4 roles posted', timestamp: '2026-02-10T09:00:00Z' }], enriched: false, description: 'AI-powered code generation and refactoring tools integrated into popular IDEs.', employees: '8-15' },
  { id: '25', name: 'TerraTrace', website: 'https://terratrace.co', sector: 'Climate', stage: 'Seed', location: 'San Francisco', foundedYear: 2024, score: 69, scoreBreakdown: { sectorMatch: 22, stageMatch: 20, hiringActivity: 10, technicalSignals: 10, blogFreshness: 7 }, tags: ['Supply Chain', 'Traceability', 'ESG'], signals: [{ type: 'blog', label: 'ESG reporting guide', timestamp: '2026-02-07T10:00:00Z' }, { type: 'product', label: 'Pilot with major retailer', timestamp: '2026-01-28T14:00:00Z' }], enriched: false, description: 'Supply chain traceability platform for ESG compliance and Scope 3 emissions tracking.', employees: '5-12' },
];
