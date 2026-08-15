export interface CityItem {
  id: string;
  name: string;
  subtitle?: string;
  keywords: string[];
}

export interface StateRegionItem {
  id: string;
  name: string;
  region: 'India' | 'International';
  flag?: string;
  cities: CityItem[];
}

export const INDIA_LOCATION_DATA: StateRegionItem[] = [
  {
    id: 'karnataka',
    name: 'Karnataka',
    region: 'India',
    cities: [
      { id: 'bengaluru', name: 'Bengaluru', subtitle: 'Capital — IT Hub', keywords: ['bengaluru', 'bangalore', 'whitefield', 'koramangala', 'indiranagar', 'electronic city', 'karnataka'] },
      { id: 'mysuru', name: 'Mysuru', subtitle: 'Heritage City', keywords: ['mysuru', 'mysore', 'karnataka'] },
      { id: 'hubballi-dharwad', name: 'Hubballi-Dharwad', subtitle: 'Commercial Centre', keywords: ['hubballi', 'dharwad', 'hubli', 'karnataka'] },
      { id: 'mangaluru', name: 'Mangaluru', subtitle: 'Port City', keywords: ['mangaluru', 'mangalore', 'karnataka'] },
    ],
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    region: 'India',
    cities: [
      { id: 'chennai', name: 'Chennai', subtitle: 'Capital', keywords: ['chennai', 'omr', 'guindy', 'anna nagar', 'velachery', 'tamil nadu'] },
      { id: 'coimbatore', name: 'Coimbatore', subtitle: 'Industrial Hub', keywords: ['coimbatore', 'tamil nadu'] },
      { id: 'madurai', name: 'Madurai', subtitle: 'Cultural Centre', keywords: ['madurai', 'tamil nadu'] },
      { id: 'tiruchirappalli', name: 'Tiruchirappalli (Trichy)', subtitle: 'Central Hub', keywords: ['tiruchirappalli', 'trichy', 'tamil nadu'] },
      { id: 'salem', name: 'Salem', subtitle: 'Steel & Textile City', keywords: ['salem', 'tamil nadu'] },
    ],
  },
  {
    id: 'kerala',
    name: 'Kerala',
    region: 'India',
    cities: [
      { id: 'thiruvananthapuram', name: 'Thiruvananthapuram', subtitle: 'Capital', keywords: ['thiruvananthapuram', 'trivandrum', 'technopark', 'kerala'] },
      { id: 'kochi', name: 'Kochi (Ernakulam)', subtitle: 'Largest Commercial Hub', keywords: ['kochi', 'ernakulam', 'kakkanad', 'infopark', 'kerala'] },
      { id: 'kozhikode', name: 'Kozhikode', subtitle: 'Northern Hub', keywords: ['kozhikode', 'calicut', 'kerala'] },
      { id: 'thrissur', name: 'Thrissur', subtitle: 'Cultural Capital', keywords: ['thrissur', 'trichur', 'kerala'] },
    ],
  },
  {
    id: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    region: 'India',
    cities: [
      { id: 'visakhapatnam', name: 'Visakhapatnam', subtitle: 'Largest City & IT Hub', keywords: ['visakhapatnam', 'vizag', 'andhra pradesh'] },
      { id: 'vijayawada', name: 'Vijayawada', subtitle: 'Commercial Hub', keywords: ['vijayawada', 'andhra pradesh'] },
      { id: 'amaravati', name: 'Amaravati', subtitle: 'Capital', keywords: ['amaravati', 'andhra pradesh'] },
      { id: 'guntur', name: 'Guntur', subtitle: 'Trading Hub', keywords: ['guntur', 'andhra pradesh'] },
    ],
  },
  {
    id: 'telangana',
    name: 'Telangana',
    region: 'India',
    cities: [
      { id: 'hyderabad', name: 'Hyderabad', subtitle: 'Capital — HITEC City', keywords: ['hyderabad', 'gachibowli', 'hitec city', 'madhapur', 'jubilee hills', 'banjara hills', 'telangana'] },
      { id: 'warangal', name: 'Warangal', subtitle: 'Second Largest City', keywords: ['warangal', 'kazipet', 'telangana'] },
      { id: 'nizamabad', name: 'Nizamabad', subtitle: 'Commercial Hub', keywords: ['nizamabad', 'telangana'] },
    ],
  },
  {
    id: 'delhi-ncr',
    name: 'Delhi NCR',
    region: 'India',
    cities: [
      { id: 'new-delhi', name: 'New Delhi', subtitle: 'National Capital', keywords: ['new delhi', 'delhi', 'dwarka', 'south delhi', 'connaught place', 'rohini', 'delhi ncr'] },
      { id: 'gurugram', name: 'Gurugram (Gurgaon)', subtitle: 'Cyber Hub & Luxury Living', keywords: ['gurugram', 'gurgaon', 'golf course road', 'cyber city', 'sohna road', 'haryana', 'delhi ncr'] },
      { id: 'noida-greater-noida', name: 'Noida & Greater Noida', subtitle: 'Expressway & Film City Hub', keywords: ['noida', 'greater noida', 'noida expressway', 'sector 62', 'sector 150', 'yamuna expressway', 'delhi ncr', 'uttar pradesh'] },
      { id: 'faridabad', name: 'Faridabad', subtitle: 'Industrial & Metro Corridor', keywords: ['faridabad', 'neharpar', 'delhi ncr', 'haryana'] },
      { id: 'ghaziabad', name: 'Ghaziabad', subtitle: 'Indirapuram & Raj Nagar', keywords: ['ghaziabad', 'indirapuram', 'vaishali', 'raj nagar extension', 'delhi ncr', 'uttar pradesh'] },
    ],
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    region: 'India',
    cities: [
      { id: 'lucknow', name: 'Lucknow', subtitle: 'Capital — Gomti Nagar Hub', keywords: ['lucknow', 'gomti nagar', 'shaheed path', 'hazratganj', 'uttar pradesh'] },
      { id: 'noida-up', name: 'Noida/Greater Noida', subtitle: 'Commercial & Residential Metros', keywords: ['noida', 'greater noida', 'sector 137', 'uttar pradesh'] },
      { id: 'kanpur', name: 'Kanpur', subtitle: 'Industrial City', keywords: ['kanpur', 'civil lines', 'uttar pradesh'] },
      { id: 'agra', name: 'Agra', subtitle: 'Heritage & Tourism Hub', keywords: ['agra', 'taj nagari', 'uttar pradesh'] },
      { id: 'varanasi', name: 'Varanasi', subtitle: 'Cultural & Spiritual Capital', keywords: ['varanasi', 'kashi', 'banaras', 'uttar pradesh'] },
      { id: 'prayagraj', name: 'Prayagraj (Allahabad)', subtitle: 'Educational & Legal Hub', keywords: ['prayagraj', 'allahabad', 'civil lines', 'uttar pradesh'] },
    ],
  },
  {
    id: 'haryana',
    name: 'Haryana',
    region: 'India',
    cities: [
      { id: 'gurugram-hr', name: 'Gurugram', subtitle: 'Corporate & High-Rise Hub', keywords: ['gurugram', 'gurgaon', 'haryana'] },
      { id: 'faridabad-hr', name: 'Faridabad', subtitle: 'Smart City Corridor', keywords: ['faridabad', 'haryana'] },
      { id: 'panchkula', name: 'Panchkula', subtitle: 'Tricity Suburb', keywords: ['panchkula', 'haryana', 'tricity'] },
      { id: 'sonipat-panipat', name: 'Sonipat & Panipat', subtitle: 'Upcoming Industrial Corridors', keywords: ['sonipat', 'panipat', 'kundli', 'haryana'] },
    ],
  },
  {
    id: 'punjab',
    name: 'Punjab',
    region: 'India',
    cities: [
      { id: 'chandigarh', name: 'Chandigarh', subtitle: 'Shared Capital (UT)', keywords: ['chandigarh', 'punjab', 'tricity', 'sector 17', 'sector 35'] },
      { id: 'ludhiana', name: 'Ludhiana', subtitle: 'Commercial & Textile Capital', keywords: ['ludhiana', 'sarabha nagar', 'punjab'] },
      { id: 'amritsar', name: 'Amritsar', subtitle: 'Holy City & Tourism Hub', keywords: ['amritsar', 'ranjit avenue', 'punjab'] },
      { id: 'mohali', name: 'Mohali', subtitle: 'Growing Real Estate & IT Hub', keywords: ['mohali', 'sas nagar', 'aerocity', 'sector 82', 'punjab'] },
      { id: 'jalandhar', name: 'Jalandhar', subtitle: 'Sports & NRI Hub', keywords: ['jalandhar', 'model town', 'punjab'] },
    ],
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    region: 'India',
    cities: [
      { id: 'jaipur', name: 'Jaipur', subtitle: 'Capital — Major Growth City', keywords: ['jaipur', 'vaishali nagar', 'jagatpura', 'mansarovar', 'rajasthan'] },
      { id: 'jodhpur', name: 'Jodhpur', subtitle: 'Sun City', keywords: ['jodhpur', 'shastri nagar', 'rajasthan'] },
      { id: 'udaipur', name: 'Udaipur', subtitle: 'City of Lakes & Luxury Living', keywords: ['udaipur', 'sukher', 'rajasthan'] },
      { id: 'kota', name: 'Kota', subtitle: 'Education City', keywords: ['kota', 'vigyan nagar', 'rajasthan'] },
    ],
  },
  {
    id: 'uttarakhand',
    name: 'Uttarakhand',
    region: 'India',
    cities: [
      { id: 'dehradun', name: 'Dehradun', subtitle: 'Capital — Foothills Paradise', keywords: ['dehradun', 'rajpur road', 'sahastradhara', 'uttarakhand'] },
      { id: 'haridwar', name: 'Haridwar', subtitle: 'Spiritual Gateway', keywords: ['haridwar', 'uttarakhand'] },
      { id: 'rishikesh', name: 'Rishikesh', subtitle: 'Yoga & Riverfront Real Estate', keywords: ['rishikesh', 'tapovan', 'uttarakhand'] },
      { id: 'nainital', name: 'Nainital', subtitle: 'Hill Real Estate & Tourism', keywords: ['nainital', 'bhimtal', 'uttarakhand'] },
    ],
  },
  {
    id: 'himachal-pradesh',
    name: 'Himachal Pradesh',
    region: 'India',
    cities: [
      { id: 'shimla', name: 'Shimla', subtitle: 'Capital — Colonial Charm', keywords: ['shimla', 'mall road', 'himachal pradesh'] },
      { id: 'manali', name: 'Manali', subtitle: 'Alpine Resort Living', keywords: ['manali', 'himachal pradesh'] },
      { id: 'dharamshala', name: 'Dharamshala', subtitle: 'Kangra Valley Hub', keywords: ['dharamshala', 'mcleodganj', 'himachal pradesh'] },
    ],
  },
  {
    id: 'jammu-kashmir',
    name: 'Jammu & Kashmir',
    region: 'India',
    cities: [
      { id: 'srinagar', name: 'Srinagar', subtitle: 'Summer Capital & Kashmir Valley', keywords: ['srinagar', 'dal lake', 'jammu and kashmir', 'kashmir'] },
      { id: 'jammu', name: 'Jammu', subtitle: 'Winter Capital & Tawi City', keywords: ['jammu', 'gandhi nagar', 'jammu and kashmir'] },
    ],
  },
  {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    region: 'India',
    cities: [
      { id: 'bhopal', name: 'Bhopal', subtitle: 'Capital — City of Lakes', keywords: ['bhopal', 'kolar road', 'mp nagar', 'arera colony', 'hoshangabad road', 'madhya pradesh'] },
      { id: 'indore', name: 'Indore', subtitle: 'Top Real Estate Growth City', keywords: ['indore', 'vijay nagar', 'super corridor', 'ab road', 'palasia', 'saket', 'rau', 'madhya pradesh'] },
      { id: 'gwalior', name: 'Gwalior', subtitle: 'Historic Smart City', keywords: ['gwalior', 'city centre', 'madhya pradesh'] },
      { id: 'jabalpur', name: 'Jabalpur', subtitle: 'Cultural Capital of MP', keywords: ['jabalpur', 'civil lines', 'madhya pradesh'] },
    ],
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    region: 'India',
    cities: [
      { id: 'kolkata', name: 'Kolkata', subtitle: 'Capital — Metro & Commercial Hub', keywords: ['kolkata', 'new town', 'salt lake', 'rajarhat', 'alipore', 'ballygunge', 'west bengal'] },
      { id: 'howrah', name: 'Howrah', subtitle: 'Twin City', keywords: ['howrah', 'west bengal'] },
      { id: 'durgapur', name: 'Durgapur', subtitle: 'Steel City & IT Corridor', keywords: ['durgapur', 'west bengal'] },
      { id: 'siliguri', name: 'Siliguri', subtitle: 'Gateway to Northeast', keywords: ['siliguri', 'sevoke road', 'west bengal'] },
      { id: 'asansol', name: 'Asansol', subtitle: 'Industrial Hub', keywords: ['asansol', 'west bengal'] },
    ],
  },
  {
    id: 'bihar',
    name: 'Bihar',
    region: 'India',
    cities: [
      { id: 'patna', name: 'Patna', subtitle: 'Capital — Fast Growing Urban Hub', keywords: ['patna', 'boring road', 'bailey road', 'kankarbagh', 'bihar'] },
      { id: 'gaya', name: 'Gaya', subtitle: 'Heritage & Pilgrimage Hub', keywords: ['gaya', 'bodhgaya', 'bihar'] },
      { id: 'bhagalpur', name: 'Bhagalpur', subtitle: 'Silk City', keywords: ['bhagalpur', 'bihar'] },
      { id: 'muzaffarpur', name: 'Muzaffarpur', subtitle: 'North Bihar Commercial Capital', keywords: ['muzaffarpur', 'bihar'] },
    ],
  },
  {
    id: 'odisha',
    name: 'Odisha',
    region: 'India',
    cities: [
      { id: 'bhubaneswar', name: 'Bhubaneswar', subtitle: 'Capital — Growing IT Hub', keywords: ['bhubaneswar', 'patia', 'jaydev vihar', 'chandrasekharpur', 'odisha'] },
      { id: 'cuttack', name: 'Cuttack', subtitle: 'Millennium City', keywords: ['cuttack', 'odisha'] },
      { id: 'rourkela', name: 'Rourkela', subtitle: 'Steel City', keywords: ['rourkela', 'odisha'] },
      { id: 'puri', name: 'Puri', subtitle: 'Coastal Tourism Destination', keywords: ['puri', 'marine drive', 'odisha'] },
    ],
  },
  {
    id: 'jharkhand',
    name: 'Jharkhand',
    region: 'India',
    cities: [
      { id: 'ranchi', name: 'Ranchi', subtitle: 'Capital', keywords: ['ranchi', 'kanke road', 'morabadi', 'jharkhand'] },
      { id: 'jamshedpur', name: 'Jamshedpur', subtitle: 'Industrial Hub (Tata City)', keywords: ['jamshedpur', 'bistupur', 'sakchi', 'jharkhand'] },
      { id: 'dhanbad', name: 'Dhanbad', subtitle: 'Coal Capital', keywords: ['dhanbad', 'jharkhand'] },
      { id: 'bokaro', name: 'Bokaro', subtitle: 'Steel City', keywords: ['bokaro', 'jharkhand'] },
    ],
  },
  {
    id: 'northeast',
    name: 'Northeast States',
    region: 'India',
    cities: [
      { id: 'guwahati', name: 'Guwahati (Assam)', subtitle: 'Largest City & Gateway to NE', keywords: ['guwahati', 'gs road', 'zoo road', 'assam', 'northeast'] },
      { id: 'dibrugarh', name: 'Dibrugarh (Assam)', subtitle: 'Tea City', keywords: ['dibrugarh', 'assam', 'northeast'] },
      { id: 'silchar', name: 'Silchar (Assam)', subtitle: 'Barak Valley Hub', keywords: ['silchar', 'assam', 'northeast'] },
      { id: 'shillong', name: 'Shillong (Meghalaya)', subtitle: 'Scotland of the East', keywords: ['shillong', 'meghalaya', 'northeast'] },
      { id: 'imphal', name: 'Imphal (Manipur)', subtitle: 'Manipur Capital', keywords: ['imphal', 'manipur', 'northeast'] },
      { id: 'agartala', name: 'Agartala (Tripura)', subtitle: 'Tripura Capital', keywords: ['agartala', 'tripura', 'northeast'] },
      { id: 'kohima', name: 'Kohima (Nagaland)', subtitle: 'Nagaland Capital', keywords: ['kohima', 'nagaland', 'northeast'] },
      { id: 'aizawl', name: 'Aizawl (Mizoram)', subtitle: 'Mizoram Capital', keywords: ['aizawl', 'mizoram', 'northeast'] },
      { id: 'itanagar', name: 'Itanagar (Arunachal Pradesh)', subtitle: 'Arunachal Capital', keywords: ['itanagar', 'arunachal', 'northeast'] },
      { id: 'gangtok', name: 'Gangtok (Sikkim)', subtitle: 'Sikkim Capital & Tourism Hub', keywords: ['gangtok', 'sikkim', 'northeast'] },
    ],
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    region: 'India',
    cities: [
      { id: 'mumbai', name: 'Mumbai', subtitle: 'Financial Capital & Top Market', keywords: ['mumbai', 'bandra', 'worli', 'andheri', 'juhu', 'powai', 'bkc', 'maharashtra'] },
      { id: 'pune', name: 'Pune', subtitle: 'Major IT & Real Estate Growth Hub', keywords: ['pune', 'hinjewadi', 'baner', 'wakad', 'kharadi', 'koregaon park', 'viman nagar', 'maharashtra'] },
      { id: 'nagpur', name: 'Nagpur', subtitle: 'Orange City & MIHAN Hub', keywords: ['nagpur', 'wardha road', 'dharampeth', 'maharashtra'] },
      { id: 'nashik', name: 'Nashik', subtitle: 'Wine Capital & Industrial Hub', keywords: ['nashik', 'gangapur road', 'maharashtra'] },
      { id: 'thane-navi-mumbai', name: 'Thane & Navi Mumbai', subtitle: 'MMR Prime Growth Corridors', keywords: ['thane', 'navi mumbai', 'ghodbunder road', 'vashi', 'kharghar', 'panvel', 'maharashtra'] },
      { id: 'aurangabad', name: 'Aurangabad (Chhatrapati Sambhajinagar)', subtitle: 'Industrial & Tourism Centre', keywords: ['aurangabad', 'sambhajinagar', 'maharashtra'] },
    ],
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    region: 'India',
    cities: [
      { id: 'ahmedabad', name: 'Ahmedabad', subtitle: 'Largest City & GIFT City Corridor', keywords: ['ahmedabad', 'sg highway', 'bopal', 'satellite', 'prahlad nagar', 'gujarat'] },
      { id: 'surat', name: 'Surat', subtitle: 'Diamond & Textile Hub', keywords: ['surat', 'vesu', 'adajan', 'gujarat'] },
      { id: 'vadodara', name: 'Vadodara', subtitle: 'Cultural & Chemical Hub', keywords: ['vadodara', 'alkapuri', 'gujarat'] },
      { id: 'rajkot', name: 'Rajkot', subtitle: 'Engineering & Industrial Capital', keywords: ['rajkot', 'kalawad road', 'gujarat'] },
      { id: 'gandhinagar', name: 'Gandhinagar', subtitle: 'Capital & GIFT City', keywords: ['gandhinagar', 'gift city', 'gujarat'] },
    ],
  },
  {
    id: 'goa',
    name: 'Goa',
    region: 'India',
    cities: [
      { id: 'panaji', name: 'Panaji', subtitle: 'State Capital & Waterfront Living', keywords: ['panaji', 'panjim', 'miramar', 'dona paula', 'goa'] },
      { id: 'margao', name: 'Margao', subtitle: 'Commercial Capital of South Goa', keywords: ['margao', 'south goa', 'goa'] },
      { id: 'vasco-da-gama', name: 'Vasco da Gama', subtitle: 'Port Town', keywords: ['vasco', 'vasco da gama', 'goa'] },
      { id: 'mapusa', name: 'Mapusa', subtitle: 'North Goa Market Hub', keywords: ['mapusa', 'north goa', 'anjuna', 'calangute', 'goa'] },
    ],
  },
];

export const INTERNATIONAL_LOCATION_DATA: StateRegionItem[] = [
  {
    id: 'uae-middle-east',
    name: 'United Arab Emirates & Gulf',
    region: 'International',
    flag: '🇦🇪',
    cities: [
      { id: 'dubai', name: 'Dubai', subtitle: 'Downtown, Palm Jumeirah & Marina', keywords: ['dubai', 'uae', 'palm jumeirah', 'downtown dubai', 'business bay', 'dubai marina'] },
      { id: 'abu-dhabi', name: 'Abu Dhabi', subtitle: 'Capital & Saadiyat Island', keywords: ['abu dhabi', 'saadiyat', 'yas island', 'uae'] },
      { id: 'sharjah', name: 'Sharjah', subtitle: 'Cultural & Freezone Hub', keywords: ['sharjah', 'al majaz', 'uae'] },
      { id: 'riyadh', name: 'Riyadh (Saudi Arabia)', subtitle: 'Kingdom Capital', keywords: ['riyadh', 'saudi arabia', 'middle east'] },
      { id: 'doha', name: 'Doha (Qatar)', subtitle: 'Lusail & West Bay', keywords: ['doha', 'qatar', 'west bay', 'lusail'] },
    ],
  },
  {
    id: 'united-states',
    name: 'United States',
    region: 'International',
    flag: '🇺🇸',
    cities: [
      { id: 'new-york', name: 'New York', subtitle: 'Manhattan, Brooklyn & Financial District', keywords: ['new york', 'manhattan', 'brooklyn', 'usa'] },
      { id: 'san-francisco', name: 'San Francisco & Silicon Valley', subtitle: 'Bay Area & Tech Hub', keywords: ['san francisco', 'silicon valley', 'bay area', 'san jose', 'california', 'usa'] },
      { id: 'los-angeles', name: 'Los Angeles', subtitle: 'Beverly Hills & Hollywood', keywords: ['los angeles', 'beverly hills', 'california', 'usa'] },
      { id: 'miami', name: 'Miami', subtitle: 'Brickell & South Beach Waterfronts', keywords: ['miami', 'brickell', 'florida', 'usa'] },
      { id: 'austin-dallas', name: 'Austin & Dallas (Texas)', subtitle: 'Corporate Expansion Hubs', keywords: ['austin', 'dallas', 'texas', 'usa'] },
    ],
  },
  {
    id: 'united-kingdom-europe',
    name: 'United Kingdom & Europe',
    region: 'International',
    flag: '🇬🇧',
    cities: [
      { id: 'london', name: 'London', subtitle: 'Mayfair, Canary Wharf & Kensington', keywords: ['london', 'canary wharf', 'mayfair', 'kensington', 'uk', 'england'] },
      { id: 'manchester', name: 'Manchester', subtitle: 'Northern Powerhouse Hub', keywords: ['manchester', 'uk'] },
      { id: 'paris', name: 'Paris (France)', subtitle: 'Luxury Residences & Haussmann Estates', keywords: ['paris', 'france', 'europe'] },
      { id: 'frankfurt-berlin', name: 'Berlin & Frankfurt (Germany)', subtitle: 'Financial & Tech Corridors', keywords: ['berlin', 'frankfurt', 'germany', 'europe'] },
      { id: 'amsterdam', name: 'Amsterdam (Netherlands)', subtitle: 'Canal District & Zuidas', keywords: ['amsterdam', 'netherlands', 'europe'] },
    ],
  },
  {
    id: 'asia-pacific',
    name: 'Asia Pacific & Canada',
    region: 'International',
    flag: '🌏',
    cities: [
      { id: 'singapore', name: 'Singapore', subtitle: 'Marina Bay & Orchard Luxury Estates', keywords: ['singapore', 'marina bay', 'orchard road', 'asia'] },
      { id: 'sydney', name: 'Sydney (Australia)', subtitle: 'Harbour Frontage & CBD', keywords: ['sydney', 'australia'] },
      { id: 'melbourne', name: 'Melbourne (Australia)', subtitle: 'Southbank & Docklands', keywords: ['melbourne', 'australia'] },
      { id: 'toronto', name: 'Toronto (Canada)', subtitle: 'Financial District & Yorkville', keywords: ['toronto', 'canada', 'ontario'] },
      { id: 'vancouver', name: 'Vancouver (Canada)', subtitle: 'Coal Harbour & Downtown', keywords: ['vancouver', 'canada', 'british columbia'] },
    ],
  },
];

/**
 * Utility matching function for properties and news against selected region, state, and city.
 */
export function checkLocationMatch(
  item: {
    city?: string;
    location?: string;
    title?: string;
    description?: string;
    region?: string;
    category?: string;
    content?: string;
    excerpt?: string;
  },
  selectedRegion: 'ALL' | 'India' | 'International',
  selectedStateId: string | null,
  selectedCityId: string | null
): boolean {
  // 1. Region check
  if (selectedRegion !== 'ALL') {
    const itemRegion = item.region || (
      (item.category || '').includes('International') ||
      (item.title || '').toLowerCase().includes('dubai') ||
      (item.title || '').toLowerCase().includes('london') ||
      (item.title || '').toLowerCase().includes('singapore') ||
      (item.title || '').toLowerCase().includes('new york') ||
      (item.city || '').toLowerCase().includes('dubai') ||
      (item.city || '').toLowerCase().includes('london')
        ? 'International'
        : 'India'
    );

    if (itemRegion.toLowerCase() !== selectedRegion.toLowerCase()) {
      return false;
    }
  }

  // If no specific city or state is picked, region filter alone is enough
  if (!selectedCityId && !selectedStateId) {
    return true;
  }

  // Combine full text corpus for comprehensive search
  const textCorpus = [
    item.city || '',
    item.location || '',
    item.title || '',
    item.description || '',
    item.excerpt || '',
    item.content || '',
    item.category || ''
  ].join(' ').toLowerCase();

  // Find targeted city or state
  const dataset = selectedRegion === 'International' ? INTERNATIONAL_LOCATION_DATA : INDIA_LOCATION_DATA;

  if (selectedCityId) {
    let matchedCityObj: CityItem | undefined;
    for (const state of dataset) {
      const found = state.cities.find((c) => c.id === selectedCityId);
      if (found) {
        matchedCityObj = found;
        break;
      }
    }

    if (matchedCityObj) {
      // Check if any keyword or city name matches the text corpus
      const matches = matchedCityObj.keywords.some((kw) => textCorpus.includes(kw.toLowerCase()));
      return matches;
    }
  }

  if (selectedStateId) {
    const stateObj = dataset.find((s) => s.id === selectedStateId);
    if (stateObj) {
      // Matches state name OR any city under this state
      if (textCorpus.includes(stateObj.name.toLowerCase())) return true;
      for (const city of stateObj.cities) {
        if (city.keywords.some((kw) => textCorpus.includes(kw.toLowerCase()))) {
          return true;
        }
      }
      return false;
    }
  }

  return true;
}
