import axios from 'axios';
import * as cheerio from 'cheerio';

// PRS Legislative Research scraper
export async function scrapePRSBills() {
  try {
    // PRS Bill Track page
    const response = await axios.get('https://prsindia.org/billtrack/the-parliament/parliament-sessions');
    const $ = cheerio.load(response.data);
    
    const bills = [];
    
    // Scrape bill listings
    $('.bill-listing-item').each((i, elem) => {
      const title = $(elem).find('.bill-title').text().trim();
      const status = $(elem).find('.bill-status').text().trim();
      const link = $(elem).find('a').attr('href');
      
      if (title) {
        bills.push({
          id: `prs-${i}`,
          title,
          status,
          source: 'PRS',
          url: `https://prsindia.org${link}`,
          ministry: $(elem).find('.ministry').text().trim(),
          introduced_date: $(elem).find('.date').text().trim()
        });
      }
    });
    
    return bills;
  } catch (error) {
    console.error('PRS scraping error:', error.message);
    return getMockPRSBills();
  }
}

// Fallback mock data based on real PRS bills
function getMockPRSBills() {
  return [
    {
      id: 'prs-1',
      title: 'The Digital Personal Data Protection Bill, 2023',
      summary: 'Provides for the processing of digital personal data in a manner that recognizes both the right of individuals to protect their personal data and the need to process such data for lawful purposes.',
      full_text: 'A Bill to provide for the processing of digital personal data in a manner that recognizes both the right of individuals to protect their personal data and the need to process such data for lawful purposes and for matters connected therewith or incidental thereto.',
      status: 'Passed',
      ministry: 'Ministry of Electronics and Information Technology',
      introduced_date: '2023-08-03',
      source: 'PRS',
      url: 'https://prsindia.org/billtrack/the-digital-personal-data-protection-bill-2023'
    },
    {
      id: 'prs-2',
      title: 'The Bharatiya Nyaya Sanhita, 2023',
      summary: 'Replaces the Indian Penal Code, 1860. Defines offences and prescribes punishments for them.',
      full_text: 'A Bill to consolidate and amend the provisions relating to offences and for matters connected therewith or incidental thereto.',
      status: 'Passed',
      ministry: 'Ministry of Home Affairs',
      introduced_date: '2023-08-11',
      source: 'PRS',
      url: 'https://prsindia.org/billtrack/the-bharatiya-nyaya-sanhita-2023'
    },
    {
      id: 'prs-3',
      title: 'The Telecommunications Bill, 2023',
      summary: 'Provides for development, expansion and operation of telecommunication services and telecommunication networks.',
      full_text: 'A Bill to provide for development, expansion and operation of telecommunication services and telecommunication networks, assignment of spectrum, and for matters connected therewith or incidental thereto.',
      status: 'Passed',
      ministry: 'Ministry of Communications',
      introduced_date: '2023-12-18',
      source: 'PRS',
      url: 'https://prsindia.org/billtrack/the-telecommunications-bill-2023'
    },
    {
      id: 'prs-4',
      title: 'The Coastal Aquaculture Authority (Amendment) Bill, 2023',
      summary: 'Amends the Coastal Aquaculture Authority Act, 2005 to regulate coastal aquaculture in India.',
      full_text: 'A Bill to amend the Coastal Aquaculture Authority Act, 2005.',
      status: 'Pending',
      ministry: 'Ministry of Fisheries, Animal Husbandry and Dairying',
      introduced_date: '2023-12-11',
      source: 'PRS',
      url: 'https://prsindia.org/billtrack/the-coastal-aquaculture-authority-amendment-bill-2023'
    },
    {
      id: 'prs-5',
      title: 'The Oilfields (Regulation and Development) Amendment Bill, 2024',
      summary: 'Amends the Oilfields Act, 1948 to regulate the business of winning petroleum.',
      full_text: 'A Bill to amend the Oilfields (Regulation and Development) Act, 1948.',
      status: 'Introduced',
      ministry: 'Ministry of Petroleum and Natural Gas',
      introduced_date: '2024-02-05',
      source: 'PRS',
      url: 'https://prsindia.org/billtrack/the-oilfields-regulation-and-development-amendment-bill-2024'
    }
  ];
}

// Data.gov.in API integration
export async function fetchDataGovInBills() {
  try {
    const response = await axios.get('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070', {
      params: {
        'api-key': process.env.DATA_GOV_IN_API_KEY || 'demo',
        format: 'json',
        limit: 50
      }
    });
    
    return response.data.records || [];
  } catch (error) {
    console.error('data.gov.in error:', error.message);
    return [];
  }
}

// Sansad.in scraper
export async function scrapeSansadBills() {
  try {
    const response = await axios.get('https://sansad.in/ls/bills');
    const $ = cheerio.load(response.data);
    
    const bills = [];
    
    $('.bill-row').each((i, elem) => {
      bills.push({
        id: `sansad-${i}`,
        title: $(elem).find('.bill-name').text().trim(),
        status: $(elem).find('.status').text().trim(),
        source: 'Sansad',
        url: 'https://sansad.in' + $(elem).find('a').attr('href')
      });
    });
    
    return bills;
  } catch (error) {
    console.error('Sansad scraping error:', error.message);
    return [];
  }
}
