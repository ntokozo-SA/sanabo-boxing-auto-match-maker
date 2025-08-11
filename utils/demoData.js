// Demo data for testing without MongoDB - 110 Gauteng Boxers
let demoBoxers = [
  // Elite Boxers (20)
  {
    _id: '1',
    name: 'Thabo "The Lion" Maseko',
    weightKg: 75,
    experienceLevel: 'Elite',
    age: 25,
    location: 'Soweto, Johannesburg',
    contactInfo: { phone: '+27-82-123-4567', email: 'thabo.maseko@email.com' },
    photoUrl: 'https://via.placeholder.com/150/ff6b6b/ffffff?text=TM',
    boutsCount: 28,
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: '2',
    name: 'Lerato "Queen" Ndlovu',
    weightKg: 60,
    experienceLevel: 'Elite',
    age: 23,
    location: 'Sandton, Johannesburg',
    contactInfo: { phone: '+27-82-234-5678', email: 'lerato.ndlovu@email.com' },
    photoUrl: 'https://via.placeholder.com/150/4ecdc4/ffffff?text=LN',
    boutsCount: 22,
    isActive: true,
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2024-01-20')
  },
  {
    _id: '3',
    name: 'Sipho "The Destroyer" Khumalo',
    weightKg: 85,
    experienceLevel: 'Elite',
    age: 26,
    location: 'Pretoria Central',
    contactInfo: { phone: '+27-82-345-6789', email: 'sipho.khumalo@email.com' },
    photoUrl: 'https://via.placeholder.com/150/45b7d1/ffffff?text=SK',
    boutsCount: 31,
    isActive: true,
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2024-01-25')
  },
  {
    _id: '4',
    name: 'Nokuthula "Thunder" Dlamini',
    weightKg: 65,
    experienceLevel: 'Elite',
    age: 24,
    location: 'Randburg, Johannesburg',
    contactInfo: { phone: '+27-82-456-7890', email: 'nokuthula.dlamini@email.com' },
    photoUrl: 'https://via.placeholder.com/150/96ceb4/ffffff?text=ND',
    boutsCount: 25,
    isActive: true,
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date('2024-01-30')
  },
  {
    _id: '5',
    name: 'Mandla "Iron Fist" Zulu',
    weightKg: 70,
    experienceLevel: 'Elite',
    age: 27,
    location: 'Centurion, Pretoria',
    contactInfo: { phone: '+27-82-567-8901', email: 'mandla.zulu@email.com' },
    photoUrl: 'https://via.placeholder.com/150/ffeaa7/666666?text=MZ',
    boutsCount: 29,
    isActive: true,
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2024-02-01')
  },
  {
    _id: '6',
    name: 'Zanele "The Viper" Mokoena',
    weightKg: 55,
    experienceLevel: 'Elite',
    age: 22,
    location: 'Rosebank, Johannesburg',
    contactInfo: { phone: '+27-82-678-9012', email: 'zanele.mokoena@email.com' },
    photoUrl: 'https://via.placeholder.com/150/dda0dd/ffffff?text=ZM',
    boutsCount: 20,
    isActive: true,
    createdAt: new Date('2023-04-10'),
    updatedAt: new Date('2024-02-05')
  },
  {
    _id: '7',
    name: 'Kagiso "The Storm" Molefe',
    weightKg: 78,
    experienceLevel: 'Elite',
    age: 25,
    location: 'Mamelodi, Pretoria',
    contactInfo: { phone: '+27-82-789-0123', email: 'kagiso.molefe@email.com' },
    photoUrl: 'https://via.placeholder.com/150/98d8c8/ffffff?text=KM',
    boutsCount: 26,
    isActive: true,
    createdAt: new Date('2023-01-30'),
    updatedAt: new Date('2024-02-10')
  },
  {
    _id: '8',
    name: 'Amahle "Golden Girl" Nkosi',
    weightKg: 58,
    experienceLevel: 'Elite',
    age: 21,
    location: 'Fourways, Johannesburg',
    contactInfo: { phone: '+27-82-890-1234', email: 'amahle.nkosi@email.com' },
    photoUrl: 'https://via.placeholder.com/150/f7dc6f/666666?text=AN',
    boutsCount: 18,
    isActive: true,
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2024-02-15')
  },
  {
    _id: '9',
    name: 'Tshepo "The Machine" Modise',
    weightKg: 82,
    experienceLevel: 'Elite',
    age: 28,
    location: 'Soshanguve, Pretoria',
    contactInfo: { phone: '+27-82-901-2345', email: 'tshepo.modise@email.com' },
    photoUrl: 'https://via.placeholder.com/150/bb8fce/ffffff?text=TM',
    boutsCount: 33,
    isActive: true,
    createdAt: new Date('2023-02-25'),
    updatedAt: new Date('2024-02-20')
  },
  {
    _id: '10',
    name: 'Refilwe "Diamond" Sebego',
    weightKg: 62,
    experienceLevel: 'Elite',
    age: 23,
    location: 'Bryanston, Johannesburg',
    contactInfo: { phone: '+27-82-012-3456', email: 'refilwe.sebego@email.com' },
    photoUrl: 'https://via.placeholder.com/150/ea9c77/ffffff?text=RS',
    boutsCount: 21,
    isActive: true,
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2024-02-25')
  },
  {
    _id: '11',
    name: 'Bongani "The Hammer" Nkabinde',
    weightKg: 76,
    experienceLevel: 'Elite',
    age: 26,
    location: 'Atteridgeville, Pretoria',
    contactInfo: { phone: '+27-82-123-4568', email: 'bongani.nkabinde@email.com' },
    photoUrl: 'https://via.placeholder.com/150/85c1e9/ffffff?text=BN',
    boutsCount: 27,
    isActive: true,
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2024-03-01')
  },
  {
    _id: '12',
    name: 'Nthabiseng "Lightning" Mabaso',
    weightKg: 57,
    experienceLevel: 'Elite',
    age: 20,
    location: 'Melville, Johannesburg',
    contactInfo: { phone: '+27-82-234-5679', email: 'nthabiseng.mabaso@email.com' },
    photoUrl: 'https://via.placeholder.com/150/f8c471/666666?text=NM',
    boutsCount: 16,
    isActive: true,
    createdAt: new Date('2023-06-05'),
    updatedAt: new Date('2024-03-05')
  },
  {
    _id: '13',
    name: 'Sibusiso "The Cobra" Dlamini',
    weightKg: 73,
    experienceLevel: 'Elite',
    age: 24,
    location: 'Hatfield, Pretoria',
    contactInfo: { phone: '+27-82-345-6780', email: 'sibusiso.dlamini@email.com' },
    photoUrl: 'https://via.placeholder.com/150/82e0aa/ffffff?text=SD',
    boutsCount: 24,
    isActive: true,
    createdAt: new Date('2023-02-28'),
    updatedAt: new Date('2024-03-10')
  },
  {
    _id: '14',
    name: 'Lungile "Queen Bee" Zulu',
    weightKg: 64,
    experienceLevel: 'Elite',
    age: 22,
    location: 'Parktown, Johannesburg',
    contactInfo: { phone: '+27-82-456-7891', email: 'lungile.zulu@email.com' },
    photoUrl: 'https://via.placeholder.com/150/f1948a/ffffff?text=LZ',
    boutsCount: 19,
    isActive: true,
    createdAt: new Date('2023-04-15'),
    updatedAt: new Date('2024-03-15')
  },
  {
    _id: '15',
    name: 'Mpho "The Warrior" Maseko',
    weightKg: 79,
    experienceLevel: 'Elite',
    age: 27,
    location: 'Lynnwood, Pretoria',
    contactInfo: { phone: '+27-82-567-8902', email: 'mpho.maseko@email.com' },
    photoUrl: 'https://via.placeholder.com/150/85c1e9/ffffff?text=MM',
    boutsCount: 30,
    isActive: true,
    createdAt: new Date('2023-01-25'),
    updatedAt: new Date('2024-03-20')
  },
  {
    _id: '16',
    name: 'Thandeka "The Phoenix" Ndlovu',
    weightKg: 59,
    experienceLevel: 'Elite',
    age: 21,
    location: 'Greenside, Johannesburg',
    contactInfo: { phone: '+27-82-678-9013', email: 'thandeka.ndlovu@email.com' },
    photoUrl: 'https://via.placeholder.com/150/f7dc6f/666666?text=TN',
    boutsCount: 17,
    isActive: true,
    createdAt: new Date('2023-05-20'),
    updatedAt: new Date('2024-03-25')
  },
  {
    _id: '17',
    name: 'Kabelo "The Beast" Moloi',
    weightKg: 87,
    experienceLevel: 'Elite',
    age: 29,
    location: 'Arcadia, Pretoria',
    contactInfo: { phone: '+27-82-789-0124', email: 'kabelo.moloi@email.com' },
    photoUrl: 'https://via.placeholder.com/150/bb8fce/ffffff?text=KM',
    boutsCount: 34,
    isActive: true,
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2024-03-30')
  },
  {
    _id: '18',
    name: 'Nokwanda "Silver Star" Khumalo',
    weightKg: 61,
    experienceLevel: 'Elite',
    age: 23,
    location: 'Illovo, Johannesburg',
    contactInfo: { phone: '+27-82-890-1235', email: 'nokwanda.khumalo@email.com' },
    photoUrl: 'https://via.placeholder.com/150/ea9c77/ffffff?text=NK',
    boutsCount: 20,
    isActive: true,
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2024-04-01')
  },
  {
    _id: '19',
    name: 'Tumelo "The Eagle" Mokwena',
    weightKg: 71,
    experienceLevel: 'Elite',
    age: 25,
    location: 'Brooklyn, Pretoria',
    contactInfo: { phone: '+27-82-901-2346', email: 'tumelo.mokwena@email.com' },
    photoUrl: 'https://via.placeholder.com/150/82e0aa/ffffff?text=TM',
    boutsCount: 25,
    isActive: true,
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2024-04-05')
  },
  {
    _id: '20',
    name: 'Palesa "The Diamond" Mokoena',
    weightKg: 56,
    experienceLevel: 'Elite',
    age: 20,
    location: 'Houghton, Johannesburg',
    contactInfo: { phone: '+27-82-012-3457', email: 'palesa.mokoena@email.com' },
    photoUrl: 'https://via.placeholder.com/150/f1948a/ffffff?text=PM',
    boutsCount: 15,
    isActive: true,
    createdAt: new Date('2023-06-10'),
    updatedAt: new Date('2024-04-10')
  }
];

let demoMatches = [
  {
    _id: '1',
    boxer1: demoBoxers[0],
    boxer2: demoBoxers[1],
    scheduledDate: new Date('2024-03-15T18:00:00Z'),
    venue: 'Central Boxing Arena',
    weightClass: 'Welterweight',
    experienceLevel: 'Elite',
    rounds: 4,
    roundDuration: 3,
    matchId: 'MATCH-20240315-001',
    status: 'Scheduled',
    result: null,
    officials: {
      referee: { name: 'Robert Johnson', license: 'REF-001' },
      judges: [
        { name: 'Alice Davis', license: 'JUD-001' },
        { name: 'Bob Wilson', license: 'JUD-002' },
        { name: 'Carol Martinez', license: 'JUD-003' }
      ],
      timekeeper: { name: 'Dave Thompson', license: 'TIM-001' }
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    _id: '2',
    boxer1: demoBoxers[2],
    boxer2: demoBoxers[3],
    scheduledDate: new Date('2024-03-15T19:00:00Z'),
    venue: 'Central Boxing Arena',
    weightClass: 'Featherweight',
    experienceLevel: 'Elite',
    rounds: 4,
    roundDuration: 3,
    matchId: 'MATCH-20240315-002',
    status: 'Completed',
    result: {
      winner: demoBoxers[3],
      loser: demoBoxers[2],
      method: 'Decision',
      rounds: 4,
      notes: 'Close match, split decision',
      recordedAt: new Date('2024-03-15T20:30:00Z')
    },
    officials: {
      referee: { name: 'Frank Miller', license: 'REF-002' },
      judges: [
        { name: 'Grace Lee', license: 'JUD-004' },
        { name: 'Henry Chen', license: 'JUD-005' },
        { name: 'Ivy Rodriguez', license: 'JUD-006' }
      ],
      timekeeper: { name: 'Jack Anderson', license: 'TIM-002' }
    },
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-03-15T20:30:00Z')
  },
  {
    _id: '3',
    boxer1: demoBoxers[4],
    boxer2: demoBoxers[5],
    scheduledDate: new Date('2024-03-15T20:00:00Z'),
    venue: 'Central Boxing Arena',
    weightClass: 'Lightweight',
    experienceLevel: 'Elite',
    rounds: 4,
    roundDuration: 3,
    matchId: 'MATCH-20240315-003',
    status: 'Scheduled',
    result: null,
    officials: {
      referee: { name: 'Sarah Wilson', license: 'REF-003' },
      judges: [
        { name: 'Tom Davis', license: 'JUD-007' },
        { name: 'Emma Brown', license: 'JUD-008' },
        { name: 'Chris Garcia', license: 'JUD-009' }
      ],
      timekeeper: { name: 'Mike Johnson', license: 'TIM-003' }
    },
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  }
];

// Generate additional boxers to reach 110 total
// Cache for generated boxers to ensure consistency
let cachedAdditionalBoxers = null;

const generateAdditionalBoxers = () => {
  // Return cached boxers if already generated
  if (cachedAdditionalBoxers) {
    return cachedAdditionalBoxers;
  }

  const locations = [
    'Soweto, Johannesburg', 'Sandton, Johannesburg', 'Pretoria Central', 'Randburg, Johannesburg',
    'Centurion, Pretoria', 'Rosebank, Johannesburg', 'Mamelodi, Pretoria', 'Fourways, Johannesburg',
    'Soshanguve, Pretoria', 'Bryanston, Johannesburg', 'Atteridgeville, Pretoria', 'Melville, Johannesburg',
    'Hatfield, Pretoria', 'Parktown, Johannesburg', 'Lynnwood, Pretoria', 'Greenside, Johannesburg',
    'Arcadia, Pretoria', 'Illovo, Johannesburg', 'Brooklyn, Pretoria', 'Houghton, Johannesburg',
    'Diepsloot, Johannesburg', 'Tembisa, Johannesburg', 'Alexandra, Johannesburg', 'Katlehong, Johannesburg',
    'Midrand, Johannesburg', 'Roodepoort, Johannesburg', 'Krugersdorp, Johannesburg', 'Benoni, Johannesburg',
    'Boksburg, Johannesburg', 'Germiston, Johannesburg', 'Alberton, Johannesburg', 'Kempton Park, Johannesburg',
    'Edenvale, Johannesburg', 'Brakpan, Johannesburg', 'Springs, Johannesburg', 'Nigel, Johannesburg'
  ];

  const firstNames = [
    'Thabo', 'Lerato', 'Sipho', 'Nokuthula', 'Mandla', 'Zanele', 'Kagiso', 'Amahle', 'Tshepo', 'Refilwe',
    'Bongani', 'Nthabiseng', 'Sibusiso', 'Lungile', 'Mpho', 'Thandeka', 'Kabelo', 'Nokwanda', 'Tumelo', 'Palesa',
    'Kgothatso', 'Amanda', 'Tshegofatso', 'Lerato', 'Sipho', 'Nokuthula', 'Mandla', 'Refilwe', 'Kagiso', 'Amahle',
    'Tumelo', 'Palesa', 'Bongani', 'Nthabiseng', 'Sibusiso', 'Lungile', 'Mpho', 'Thandeka', 'Kabelo', 'Nokwanda',
    'David', 'Sarah', 'Mike', 'John', 'Maria', 'James', 'Lisa', 'Robert', 'Jennifer', 'Michael',
    'Linda', 'William', 'Elizabeth', 'Richard', 'Barbara', 'Joseph', 'Susan', 'Thomas', 'Jessica', 'Christopher',
    'Sarah', 'Daniel', 'Karen', 'Matthew', 'Nancy', 'Anthony', 'Betty', 'Mark', 'Helen', 'Donald',
    'Sandra', 'Steven', 'Donna', 'Paul', 'Carol', 'Andrew', 'Ruth', 'Joshua', 'Sharon', 'Kenneth',
    'Michelle', 'Kevin', 'Laura', 'Brian', 'Emily', 'George', 'Deborah', 'Edward', 'Dorothy', 'Ronald',
    'Lisa', 'Timothy', 'Nancy', 'Jason', 'Karen', 'Jeffrey', 'Betty', 'Ryan', 'Helen', 'Jacob'
  ];

  const lastNames = [
    'Maseko', 'Ndlovu', 'Khumalo', 'Dlamini', 'Zulu', 'Mokoena', 'Molefe', 'Nkosi', 'Modise', 'Sebego',
    'Nkabinde', 'Mabaso', 'Dlamini', 'Zulu', 'Maseko', 'Ndlovu', 'Moloi', 'Khumalo', 'Mokwena', 'Mokoena',
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
    'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
  ];

  const nicknames = [
    'The Lion', 'Queen', 'The Destroyer', 'Thunder', 'Iron Fist', 'The Viper', 'The Storm', 'Golden Girl',
    'The Machine', 'Diamond', 'The Hammer', 'Lightning', 'The Cobra', 'Queen Bee', 'The Warrior', 'The Phoenix',
    'The Beast', 'Silver Star', 'The Eagle', 'The Diamond', 'Young Lion', 'Swift', 'The Future', 'Star',
    'Young Warrior', 'Rising Star', 'Young Lion', 'Star Girl', 'Young Eagle', 'Young Beast', 'Young Queen',
    'Young Warrior', 'Young Diamond', 'Young Storm', 'Young Lightning', 'Young Machine', 'Young Viper',
    'Young Eagle', 'Young Star', 'Young Queen', 'The Kid', 'Steel', 'Rookie', 'The Hammer', 'Lightning',
    'The Kid', 'Steel', 'Rookie', 'The Hammer', 'Lightning', 'The Kid', 'Steel', 'Rookie'
  ];

  const additionalBoxers = [];
  let id = 46;

  // Generate Junior boxers (25)
  for (let i = 0; i < 25; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const nickname = nicknames[Math.floor(Math.random() * nicknames.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const age = 13 + Math.floor(Math.random() * 3); // 13-15 years
    const weightKg = 45 + Math.floor(Math.random() * 15); // 45-60kg
    const boutsCount = 3 + Math.floor(Math.random() * 8); // 3-10 bouts

    additionalBoxers.push({
      _id: id.toString(),
      name: `${firstName} "${nickname}" ${lastName}`,
      weightKg,
      experienceLevel: 'Junior',
      age,
      location,
      contactInfo: { 
        phone: `+27-82-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`, 
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com` 
      },
      photoUrl: `https://via.placeholder.com/150/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=${firstName.charAt(0)}${lastName.charAt(0)}`,
      boutsCount,
      isActive: true,
      createdAt: new Date('2023-' + (Math.floor(Math.random() * 12) + 1) + '-' + (Math.floor(Math.random() * 28) + 1)),
      updatedAt: new Date('2024-' + (Math.floor(Math.random() * 12) + 1) + '-' + (Math.floor(Math.random() * 28) + 1))
    });
    id++;
  }

  // Generate Schools boxers (25)
  for (let i = 0; i < 25; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const nickname = nicknames[Math.floor(Math.random() * nicknames.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const age = 10 + Math.floor(Math.random() * 3); // 10-12 years
    const weightKg = 35 + Math.floor(Math.random() * 15); // 35-50kg
    const boutsCount = 1 + Math.floor(Math.random() * 5); // 1-5 bouts

    additionalBoxers.push({
      _id: id.toString(),
      name: `${firstName} "${nickname}" ${lastName}`,
      weightKg,
      experienceLevel: 'Schools',
      age,
      location,
      contactInfo: { 
        phone: `+27-82-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`, 
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com` 
      },
      photoUrl: `https://via.placeholder.com/150/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=${firstName.charAt(0)}${lastName.charAt(0)}`,
      boutsCount,
      isActive: true,
      createdAt: new Date('2023-' + (Math.floor(Math.random() * 12) + 1) + '-' + (Math.floor(Math.random() * 28) + 1)),
      updatedAt: new Date('2024-' + (Math.floor(Math.random() * 12) + 1) + '-' + (Math.floor(Math.random() * 28) + 1))
    });
    id++;
  }

  // Generate Novice boxers (15)
  for (let i = 0; i < 15; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const nickname = nicknames[Math.floor(Math.random() * nicknames.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const age = 18 + Math.floor(Math.random() * 12); // 18-29 years
    const weightKg = 60 + Math.floor(Math.random() * 30); // 60-90kg
    const boutsCount = 0 + Math.floor(Math.random() * 5); // 0-4 bouts

    additionalBoxers.push({
      _id: id.toString(),
      name: `${firstName} "${nickname}" ${lastName}`,
      weightKg,
      experienceLevel: 'Novice',
      age,
      location,
      contactInfo: { 
        phone: `+27-82-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`, 
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com` 
      },
      photoUrl: `https://via.placeholder.com/150/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=${firstName.charAt(0)}${lastName.charAt(0)}`,
      boutsCount,
      isActive: true,
      createdAt: new Date('2023-' + (Math.floor(Math.random() * 12) + 1) + '-' + (Math.floor(Math.random() * 28) + 1)),
      updatedAt: new Date('2024-' + (Math.floor(Math.random() * 12) + 1) + '-' + (Math.floor(Math.random() * 28) + 1))
    });
    id++;
  }

  // Cache the generated boxers
  cachedAdditionalBoxers = additionalBoxers;
  return additionalBoxers;
};

// Demo data API functions
const demoDataAPI = {
  // Boxer functions
  getAllBoxers: (filters = {}) => {
    const allBoxers = [...demoBoxers, ...generateAdditionalBoxers()];
    let filteredBoxers = [...allBoxers];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredBoxers = filteredBoxers.filter(boxer => 
        boxer.name.toLowerCase().includes(search) ||
        boxer.location.toLowerCase().includes(search)
      );
    }
    
    if (filters.experienceLevel) {
      filteredBoxers = filteredBoxers.filter(boxer => 
        boxer.experienceLevel === filters.experienceLevel
      );
    }
    
    if (filters.isActive !== undefined && filters.isActive !== '') {
      const isActive = filters.isActive === 'true';
      filteredBoxers = filteredBoxers.filter(boxer => boxer.isActive === isActive);
    }
    
    return filteredBoxers;
  },
  
  getBoxerById: (id) => {
    const allBoxers = [...demoBoxers, ...generateAdditionalBoxers()];
    return allBoxers.find(boxer => boxer._id === id);
  },
  
  createBoxer: (boxerData) => {
    const newBoxer = {
      _id: Date.now().toString(),
      ...boxerData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    demoBoxers.push(newBoxer);
    return newBoxer;
  },
  
  updateBoxer: (id, updateData) => {
    const index = demoBoxers.findIndex(boxer => boxer._id === id);
    if (index !== -1) {
      demoBoxers[index] = { ...demoBoxers[index], ...updateData, updatedAt: new Date() };
      return demoBoxers[index];
    }
    return null;
  },
  
  deleteBoxer: (id) => {
    const index = demoBoxers.findIndex(boxer => boxer._id === id);
    if (index !== -1) {
      demoBoxers[index].isActive = false;
      return demoBoxers[index];
    }
    return null;
  },
  
  // Match functions
  getAllMatches: (filters = {}) => {
    let filteredMatches = [...demoMatches];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredMatches = filteredMatches.filter(match => 
        match.matchId.toLowerCase().includes(search) ||
        match.venue.toLowerCase().includes(search)
      );
    }
    
    if (filters.status) {
      filteredMatches = filteredMatches.filter(match => 
        match.status === filters.status
      );
    }
    
    if (filters.experienceLevel) {
      filteredMatches = filteredMatches.filter(match => 
        match.experienceLevel === filters.experienceLevel
      );
    }
    
    return filteredMatches;
  },
  
  getMatchById: (id) => {
    return demoMatches.find(match => match._id === id);
  },
  
  getMatchByMatchId: (matchId) => {
    return demoMatches.find(match => match.matchId === matchId);
  },
  
  createMatch: (matchData) => {
    const newMatch = {
      _id: Date.now().toString(),
      ...matchData,
      status: 'Scheduled',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    demoMatches.push(newMatch);
    return newMatch;
  },
  
  updateMatchResult: (id, resultData) => {
    const index = demoMatches.findIndex(match => match._id === id);
    if (index !== -1) {
      demoMatches[index].result = {
        ...resultData,
        recordedAt: new Date()
      };
      demoMatches[index].status = 'Completed';
      demoMatches[index].updatedAt = new Date();
      return demoMatches[index];
    }
    return null;
  }
};

module.exports = { demoDataAPI, demoBoxers, demoMatches }; 