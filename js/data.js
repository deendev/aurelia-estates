/* =========================================================================
   AURELIA ESTATES · Sample data layer
   -------------------------------------------------------------------------
   Everything in this file is local sample data. In production these
   records would come from a CMS or listings API (see js/api.js, where the
   fetch calls are stubbed). Field names mirror a typical listings schema
   so the swap is a one-line change in api.js.
   ========================================================================= */

window.AURELIA_DATA = (function () {
  const interiors = {
    living:  { src: 'img/i-living.jpg',   alt: 'Living room with linen sofa and steel-framed garden doors' },
    kitchen: { src: 'img/i-kitchen.jpg',  alt: 'Kitchen with Calacatta marble island and smoked oak cabinetry' },
    bedroom: { src: 'img/i-bedroom.jpg',  alt: 'Principal bedroom opening onto a sea-view terrace' },
    bath:    { src: 'img/i-bath.jpg',     alt: 'Bathroom with a carved stone bath facing olive trees' },
    dining:  { src: 'img/i-dining.jpg',   alt: 'Candlelit dining room with walnut table and terrace view' },
    terrace: { src: 'img/i-terrace.jpg',  alt: 'Terrace lounge beside a lit infinity pool at dusk' },
    library: { src: 'img/life-library.jpg', alt: 'Walnut-panelled library with leather armchair and fireplace' }
  };

  const locations = [
    { id: 'milan',     name: 'Milan',     country: 'Italy',  image: 'img/loc-milan.jpg',   portfolio: 38, line: 'Brera, Quadrilatero, CityLife' },
    { id: 'lake-como', name: 'Lake Como', country: 'Italy',  image: 'img/loc-como.jpg',    portfolio: 24, line: 'Tremezzo, Bellagio, Cernobbio' },
    { id: 'dubai',     name: 'Dubai',     country: 'UAE',    image: 'img/loc-dubai.jpg',   portfolio: 51, line: 'Palm Jumeirah, Emirates Hills' },
    { id: 'london',    name: 'London',    country: 'UK',     image: 'img/loc-london.jpg',  portfolio: 46, line: 'Kensington, Belgravia, Mayfair' },
    { id: 'monaco',    name: 'Monaco',    country: 'Monaco', image: 'img/loc-monaco.jpg',  portfolio: 19, line: 'Larvotto, Monte Carlo, Fontvieille' },
    { id: 'tuscany',   name: 'Tuscany',   country: 'Italy',  image: 'img/loc-tuscany.jpg', portfolio: 31, line: "Val d'Orcia, Chianti, Montalcino" }
  ];

  const properties = [
    {
      id: 'lake-como-villa',
      name: 'Modern Mediterranean Villa',
      house: 'Villa Serena',
      status: 'sale',
      type: 'Villa',
      location: 'lake-como',
      area: 'Tremezzo, Lake Como, Italy',
      price: 3850000,
      beds: 5, baths: 5, size: 620, plot: '3,200 m² terraced grounds',
      year: 2021,
      image: 'img/p-como.jpg', imageSm: 'img/p-como-sm.jpg',
      alt: 'White stucco villa with terraced gardens and a private boat dock on Lake Como',
      summary: 'A lakeside villa of stone and pale stucco, with terraced gardens that step down to its own jetty.',
      description: [
        'Villa Serena sits on the western shore between Tremezzo and Lenno, where the lake is at its widest and the light lasts longest. The house was rebuilt in 2021 by a Milanese studio that kept the original stone base and opened the upper floors to the water with full-height glazing.',
        'Reception rooms run the length of the ground floor and open onto a limestone terrace and a 16-metre pool. Five bedroom suites sit above, each with a lake view. A stone stair winds through the gardens of cypress, oleander and lavender to a private dock moored for a classic Riva.'
      ],
      features: ['Private boat dock and mooring', '16 m heated infinity pool', 'Terraced Italian gardens', 'Internal lift to all floors', 'Temperature-controlled wine cellar', 'Separate guest apartment', 'Garage for three cars', 'Home automation throughout'],
      gallery: ['main', 'living', 'kitchen', 'bedroom', 'bath', 'loc'],
      nearby: [['Tremezzo village', '5 min'], ['Bellagio ferry', '8 min'], ['Como city centre', '35 min'], ['Milan Malpensa Airport', '75 min']],
      coords: 'Western shore, Lake Como'
    },
    {
      id: 'milan-penthouse',
      name: 'Contemporary Penthouse',
      house: 'Attico Manzoni',
      status: 'sale',
      type: 'Penthouse',
      location: 'milan',
      area: 'Quadrilatero, Milan, Italy',
      price: 2400000,
      beds: 3, baths: 3, size: 285, plot: '90 m² roof terrace',
      year: 2019,
      image: 'img/p-milan.jpg', imageSm: 'img/p-milan-sm.jpg',
      alt: 'Double-height penthouse living room with views of the Duomo at dusk',
      summary: 'A double-height penthouse in walnut and travertine, looking straight across the rooftops to the Duomo.',
      description: [
        'Attico Manzoni occupies the top two floors of a restored 1930s palazzo, a short walk from La Scala and the fashion houses of Via Montenapoleone. The architects removed the old attic floor to create a double-height living room with glazing on two sides.',
        'Walnut floors, travertine walls and a long gas fireplace keep the rooms warm in tone. A gallery level holds the principal suite and study, and the roof terrace has an outdoor kitchen with an uninterrupted view of the cathedral spires.'
      ],
      features: ['Double-height living room', 'Direct Duomo views', '90 m² roof terrace with outdoor kitchen', 'Travertine fireplace wall', '24-hour concierge', 'Two secure parking spaces', 'Underfloor heating and cooling', 'Private lift lobby'],
      gallery: ['main', 'dining', 'kitchen', 'bedroom', 'bath', 'loc'],
      nearby: [['Teatro alla Scala', '5 min walk'], ['Piazza del Duomo', '8 min walk'], ['Brera district', '10 min walk'], ['Milan Linate Airport', '20 min']],
      coords: 'Quadrilatero della Moda, Milan'
    },
    {
      id: 'dubai-waterfront-villa',
      name: 'Luxury Waterfront Villa',
      house: 'Villa Al Noor',
      status: 'sale',
      type: 'Villa',
      location: 'dubai',
      area: 'Palm Jumeirah, Dubai, UAE',
      price: 5900000,
      beds: 6, baths: 7, size: 890, plot: '70 m private beach frontage',
      year: 2023,
      image: 'img/p-dubai.jpg', imageSm: 'img/p-dubai-sm.jpg',
      alt: 'Contemporary white villa with pool and private beach facing the Dubai Marina skyline',
      summary: 'A frond-tip villa on the Palm with its own beach, a long pool and the Marina skyline across the water.',
      description: [
        'Villa Al Noor sits near the tip of its frond, so the beach faces west and catches the sunset over Dubai Marina. The house is arranged in three white volumes around a central courtyard, with shaded terraces on every level.',
        'The ground floor opens entirely to the pool deck. There is a cinema, a gym and spa, staff quarters with a separate entrance, and a rooftop majlis for evenings outside. Finishes include Italian stone, oak joinery and a Lutron lighting system.'
      ],
      features: ['70 m private beach', '25 m infinity-edge pool', 'Rooftop majlis and terrace', 'Private cinema', 'Gym, steam room and spa', 'Staff quarters with separate access', 'Four-car garage', 'Full smart-home control'],
      gallery: ['main', 'terrace', 'living', 'kitchen', 'bedroom', 'loc'],
      nearby: [['Dubai Marina', '10 min'], ['Downtown Dubai', '25 min'], ['Dubai International Airport', '30 min'], ['Al Maktoum Airport', '35 min']],
      coords: 'Palm Jumeirah, Dubai'
    },
    {
      id: 'london-townhouse',
      name: 'Classic Townhouse',
      house: 'No. 14 Pembroke Square',
      status: 'sale',
      type: 'Townhouse',
      location: 'london',
      area: 'Kensington, London, UK',
      price: 4200000,
      beds: 5, baths: 4, size: 410, plot: '120 m² walled garden',
      year: 1846,
      image: 'img/p-london.jpg', imageSm: 'img/p-london-sm.jpg',
      alt: 'White stucco Georgian townhouse with black front door and iron railings in Kensington',
      summary: 'A white stucco Georgian townhouse on a quiet square, restored with care and a lateral ground floor.',
      description: [
        'Built in 1846 and Grade II listed, the house keeps its cornicing, sash windows and original stone stair. A two-year restoration added a lower ground floor with a family kitchen that opens onto a walled garden.',
        'The first floor drawing room runs front to back with three tall windows over the square. Five bedrooms sit above, including a principal suite with a dressing room and a bathroom lined in honed marble.'
      ],
      features: ['Grade II listed, fully restored', 'Lateral first-floor drawing room', 'Guest suite on the lower ground floor', 'Family kitchen with garden access', 'Wine cellar under the pavement vaults', 'Residents’ garden square access', 'Integrated audio-visual system', 'Sash windows with secondary glazing'],
      gallery: ['main', 'living', 'dining', 'library', 'bedroom', 'loc'],
      nearby: [['Kensington Gardens', '6 min walk'], ['High Street Kensington station', '4 min walk'], ['Harrods', '12 min'], ['Heathrow Airport', '40 min']],
      coords: 'Kensington, Royal Borough of Kensington and Chelsea'
    },
    {
      id: 'monaco-seaside-residence',
      name: 'Seaside Luxury Residence',
      house: 'Les Terrasses du Port',
      status: 'sale',
      type: 'Residence',
      location: 'monaco',
      area: 'Monte Carlo, Monaco',
      price: 8500000,
      beds: 4, baths: 5, size: 460, plot: '180 m² of terraces',
      year: 2022,
      image: 'img/p-monaco.jpg', imageSm: 'img/p-monaco-sm.jpg',
      alt: 'Glass-fronted residence with terraces and a pool above Port Hercule in Monaco',
      summary: 'A residence of glass and stone above Port Hercule, with deep terraces and a pool on the cliff edge.',
      description: [
        'Les Terrasses du Port is one of four residences in a 2022 building cut into the cliff above the harbour. This is the largest, set over two floors with its own entrance and a pool that seems to run straight into the sea.',
        'Every room faces south. The living floor opens to a 120 m² terrace with an outdoor kitchen, and the bedroom floor has its own terraces planted with bougainvillea. Residents share a concierge, a spa and secure parking.'
      ],
      features: ['Private cliff-edge pool', '180 m² of south-facing terraces', 'Panoramic harbour and sea views', 'Own street entrance', 'Building concierge and spa', 'Four secure parking spaces', 'Wine room and cellar storage', 'Five minutes from the heliport'],
      gallery: ['main', 'terrace', 'living', 'dining', 'bedroom', 'loc'],
      nearby: [['Casino Square', '7 min'], ['Port Hercule', '3 min'], ['Monaco Heliport', '5 min'], ['Nice Côte d’Azur Airport', '30 min']],
      coords: 'Monte Carlo, Principality of Monaco'
    },
    {
      id: 'tuscany-estate',
      name: 'Tuscan Countryside Estate',
      house: 'Tenuta delle Querce',
      status: 'sale',
      type: 'Estate',
      location: 'tuscany',
      area: "Val d'Orcia, Tuscany, Italy",
      price: 2950000,
      beds: 7, baths: 6, size: 780, plot: '12 hectares with vineyard',
      year: 1780,
      image: 'img/p-tuscany.jpg', imageSm: 'img/p-tuscany-sm.jpg',
      alt: 'Stone Tuscan estate with pool, vineyards and cypress-lined drive at sunset',
      summary: 'An 18th-century stone estate with its own vineyard, olive grove and a cypress-lined drive.',
      description: [
        "Tenuta delle Querce stands on a ridge between Montalcino and Pienza, with views across the Val d'Orcia to Monte Amiata. The main house dates from 1780 and was restored in local stone, chestnut beams and cotto floors.",
        'Twelve hectares include three hectares of Sangiovese vines, four hundred olive trees and a stone-edged pool on the lower lawn. Two former farm buildings are now guest houses, and the old barn holds a tasting room and cellar.'
      ],
      features: ['12 hectares of land', '3 ha Sangiovese vineyard', '400 olive trees', 'Stone-edged infinity pool', 'Two guest houses', 'Cellar and tasting room', 'Cypress-lined private drive', 'Agricultural income potential'],
      gallery: ['main', 'kitchen', 'dining', 'bath', 'library', 'loc'],
      nearby: [['Montalcino', '10 min'], ['Pienza', '20 min'], ['Siena', '45 min'], ['Florence Airport', '1 h 40 min']],
      coords: "Val d'Orcia, Province of Siena"
    },
    {
      id: 'monaco-sea-terrace',
      name: 'Sea Terrace Apartment',
      house: 'Résidence Larvotto',
      status: 'rent',
      type: 'Apartment',
      location: 'monaco',
      area: 'Larvotto, Monaco',
      price: 42000,
      beds: 3, baths: 3, size: 240, plot: '95 m² terrace',
      year: 2018,
      image: 'img/i-terrace.jpg', imageSm: 'img/i-terrace.jpg',
      alt: 'Terrace lounge beside a lit pool overlooking the sea at dusk',
      summary: 'A furnished apartment above Larvotto beach, with a wide terrace and use of a shared pool.',
      description: [
        'A fully furnished apartment on the eighth floor of a 2018 building, two minutes from Larvotto beach. The living room, kitchen and principal suite all open onto one long terrace over the sea.',
        'Available for twelve-month lets. Rent includes building charges, concierge, pool and one parking space.'
      ],
      features: ['Fully furnished', '95 m² sea-view terrace', 'Shared pool and gym', 'Concierge', 'One parking space', 'Twelve-month lease'],
      gallery: ['main', 'living', 'bedroom', 'bath', 'loc'],
      nearby: [['Larvotto beach', '2 min walk'], ['Casino Square', '10 min walk'], ['Nice Côte d’Azur Airport', '30 min']],
      coords: 'Larvotto, Monaco'
    },
    {
      id: 'london-mayfair-apartment',
      name: 'Mayfair Garden Apartment',
      house: 'Mount Street Residence',
      status: 'rent',
      type: 'Apartment',
      location: 'london',
      area: 'Mayfair, London, UK',
      price: 24000,
      beds: 3, baths: 2, size: 210, plot: 'Private garden terrace',
      year: 1898,
      image: 'img/i-dining.jpg', imageSm: 'img/i-dining.jpg',
      alt: 'Candlelit dining room opening onto a garden terrace',
      summary: 'A lateral apartment in a red-brick Mayfair mansion block, opening onto its own garden terrace.',
      description: [
        'The apartment covers the whole raised ground floor of a 1898 mansion block, with a dining room that opens through steel doors to a planted terrace.',
        'Offered furnished or unfurnished on a long let. Porterage and building insurance are included.'
      ],
      features: ['Lateral layout', 'Private garden terrace', 'Porterage', 'Furnished or unfurnished', 'Long let available'],
      gallery: ['main', 'living', 'kitchen', 'bedroom', 'loc'],
      nearby: [['Hyde Park', '5 min walk'], ['Bond Street station', '8 min walk'], ['Heathrow Airport', '45 min']],
      coords: 'Mayfair, City of Westminster'
    },
    {
      id: 'milan-brera-residence',
      name: 'Brera Library Residence',
      house: 'Palazzo Fiori Chiari',
      status: 'rent',
      type: 'Apartment',
      location: 'milan',
      area: 'Brera, Milan, Italy',
      price: 14500,
      beds: 2, baths: 2, size: 180, plot: 'Courtyard garden view',
      year: 1760,
      image: 'img/life-library.jpg', imageSm: 'img/life-library.jpg',
      alt: 'Walnut-panelled library with a leather armchair and arched garden window',
      summary: 'A piano nobile apartment in an 18th-century palazzo, with a two-storey walnut library.',
      description: [
        'On the first floor of a palazzo in the Brera district, this apartment keeps its walnut library, frescoed ceilings and arched windows over the courtyard garden.',
        'Let fully furnished, for a minimum of six months.'
      ],
      features: ['Two-storey library', 'Frescoed ceilings', 'Courtyard garden views', 'Fully furnished', 'Six-month minimum'],
      gallery: ['main', 'dining', 'bedroom', 'bath', 'loc'],
      nearby: [['Pinacoteca di Brera', '3 min walk'], ['Piazza del Duomo', '15 min walk'], ['Milan Linate Airport', '25 min']],
      coords: 'Brera, Milan'
    }
  ];

  const developments = [
    {
      id: 'aurelia-tower',
      name: 'The Aurelia Tower',
      place: 'Dubai Marina, Dubai',
      image: 'img/dev-tower.jpg',
      from: 2100000,
      completion: 'Q4 2028',
      units: '64 residences',
      text: 'Twenty-two floors of curved terraces with hanging gardens, designed so every residence has open sky on three sides.'
    },
    {
      id: 'uliveti-pavilions',
      name: 'Uliveti Pavilions',
      place: "Val d'Orcia, Tuscany",
      image: 'img/dev-pavilions.jpg',
      from: 1650000,
      completion: 'Q2 2027',
      units: '9 pavilion homes',
      text: 'Nine single-storey stone pavilions around a long reflecting pool, set among old olive trees.'
    }
  ];

  const testimonials = [
    { quote: 'They found us a house on Lake Como that never went to market. Two viewings, one weekend, and the whole purchase handled in English and Italian without a single delay.', name: 'Eleanor and James W.', place: 'Buyers, Lake Como' },
    { quote: 'Our advisor priced the Monaco apartment within two percent of the final sale and kept the process completely private. We would not sell anywhere else.', name: 'Karim A.', place: 'Seller, Monaco' },
    { quote: 'Relocating from Singapore to London with three children, we needed a townhouse near the park in six weeks. Aurelia had the shortlist ready in four days.', name: 'Mei-Lin C.', place: 'Buyer, Kensington' }
  ];

  const offices = [
    { city: 'London', address: '14 Mount Street, Mayfair, London W1K 2RE', phone: '+44 20 7946 0958' },
    { city: 'Milan', address: 'Via Manzoni 12, 20121 Milano', phone: '+39 02 8088 4410' },
    { city: 'Dubai', address: 'Gate Village 5, DIFC, Dubai', phone: '+971 4 555 0172' },
    { city: 'Monaco', address: '7 Avenue Princesse Grace, 98000 Monaco', phone: '+377 97 98 0123' }
  ];

  return { interiors, locations, properties, developments, testimonials, offices };
})();
