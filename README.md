# PolicyTrace India

AI-powered legislative impact tracker connecting Indian government decisions to community impacts.

**Live Demo:** [Coming soon - Deploying to Vercel]

## Problem
Indian citizens can't connect parliamentary bills to real-world impacts. Legislation passes, but people don't know how they're affected until it's too late.

## Solution
PolicyTrace India tracks legislation from proposal to implementation, predicts community-level impacts by pincode, and alerts affected residents before decisions are final.

## Features
- **Legislative Tracking**: Monitor bills from Lok Sabha, Rajya Sabha, and state assemblies
- **AI Impact Analysis**: Predict community impacts using Azure OpenAI and demographic data
- **Pincode-Based Alerts**: Get notified about bills affecting your area
- **Multi-Language Support**: Available in 8 Indian languages
- **Plain Language Translation**: Convert legal text to simple language
- **Action Steps**: Know exactly what to do and when

## Tech Stack
- **Frontend**: Next.js 15, React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **AI**: Azure OpenAI (GPT-4o)
- **Data**: PRS Legislative Research, data.gov.in, Census India
- **Deployment**: Vercel

## Data Sources
- PRS Legislative Research (structured bill data)
- data.gov.in (parliamentary datasets)
- India Code (legal text repository)
- Census of India (demographic data)
- SECC (socio-economic data)

## Setup

### Prerequisites
- Node.js 18+
- Azure OpenAI account
- Supabase account

### Installation

```bash
# Clone repository
git clone https://github.com/AadilRashid/policytrace-india.git
cd policytrace-india

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Run Supabase migrations
# Create project at supabase.com
# Run schema.sql and sample-data.sql in SQL Editor

# Start development server
npm run dev
```

Visit https://policytrace-india.vercel.app/

## Usage

### For Citizens
1. Browse bills affecting India
2. Enter your pincode to see local impact
3. Get analysis in your preferred language
4. See specific action steps and timelines

### For Developers
```javascript
// Analyze bill impact
const analysis = await fetch('/api/analyze', {
  method: 'POST',
  body: JSON.stringify({ 
    billId: 'prs-1', 
    pincode: '110001',
    language: 'hindi'
  })
});
```

## Roadmap

### Phase 1 (Current - MVP)
- [x] Bill tracking from PRS
- [x] AI impact analysis
- [x] Pincode mapping
- [x] Multi-language support
- [x] Modern UI with loading states

### Phase 2 (Next 3 months)
- [ ] Real-time bill scraping
- [ ] SMS/WhatsApp alerts
- [ ] Mobile app (React Native)
- [ ] State assembly tracking
- [ ] Community forums

### Phase 3 (6 months)
- [ ] Voting record tracking
- [ ] Corporate influence mapping
- [ ] API for NGOs and journalists
- [ ] Constituency impact maps

## Contributing
We welcome contributions! This is an open-source project aimed at strengthening Indian democracy.

## License
MIT License - See [LICENSE](LICENSE)

## Funding
Applying for Mozilla Foundation Democracy x AI Cohort 2026.

## Contact
- GitHub: [@AadilRashid](https://github.com/AadilRashid)
- Project: [PolicyTrace India](https://github.com/AadilRashid/policytrace-india)

## Acknowledgments
- PRS Legislative Research for structured data
- data.gov.in for open government data
- Mozilla Foundation for supporting civic tech
- Azure for OpenAI credits

---

**Built with ❤️ for Indian democracy**
