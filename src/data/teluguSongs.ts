export interface TeluguSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  genre: string;
  audioPreviewUrl: string;
  matchReason: string;
  lyrics?: string;
}

// Using Internet Archive public domain audio - highly reliable CORS-enabled sources
const reliableAudioUrls = [
  'https://archive.org/download/Classical_Music_Box/Classical_Music_Box_01.mp3',
  'https://archive.org/download/Classical_Music_Box/Classical_Music_Box_02.mp3',
  'https://archive.org/download/Classical_Music_Box/Classical_Music_Box_03.mp3',
  'https://archive.org/download/Classical_Music_Box/Classical_Music_Box_04.mp3',
  'https://archive.org/download/Classical_Music_Box/Classical_Music_Box_05.mp3',
  'https://archive.org/download/Classical_Music_Box/Classical_Music_Box_06.mp3',
  'https://archive.org/download/Classical_Music_Box/Classical_Music_Box_07.mp3',
  'https://archive.org/download/Classical_Music_Box/Classical_Music_Box_08.mp3',
];

// Telugu songs organized by mood
export const teluguMoodSongs: Record<string, TeluguSong[]> = {
  happy: [
    {
      id: 'tel-happy-1',
      title: 'Butta Bomma',
      artist: 'Armaan Malik',
      album: 'Ala Vaikunthapurramuloo',
      duration: '4:05',
      genre: 'Telugu Pop',
      audioPreviewUrl: reliableAudioUrls[0],
      matchReason: 'Uplifting Telugu melody with romantic vibes'
    },
    {
      id: 'tel-happy-2',
      title: 'Ramuloo Ramulaa',
      artist: 'Anurag Kulkarni, Mangli',
      album: 'Ala Vaikunthapurramuloo',
      duration: '4:32',
      genre: 'Telugu Folk',
      audioPreviewUrl: reliableAudioUrls[1],
      matchReason: 'Energetic folk beats and celebration'
    },
    {
      id: 'tel-happy-3',
      title: 'Samajavaragamana',
      artist: 'Sid Sriram',
      album: 'Ala Vaikunthapurramuloo',
      duration: '4:18',
      genre: 'Telugu Classical',
      audioPreviewUrl: reliableAudioUrls[2],
      matchReason: 'Soulful and joyful Telugu classical music'
    },
    {
      id: 'tel-happy-4',
      title: 'Inkem Inkem',
      artist: 'Sid Sriram',
      album: 'Geetha Govindam',
      duration: '3:54',
      genre: 'Telugu Romantic',
      audioPreviewUrl: reliableAudioUrls[3],
      matchReason: 'Sweet and cheerful Telugu melody'
    },
    {
      id: 'tel-happy-5',
      title: 'Srivalli',
      artist: 'Sid Sriram',
      album: 'Pushpa',
      duration: '3:58',
      genre: 'Telugu Folk Pop',
      audioPreviewUrl: reliableAudioUrls[4],
      matchReason: 'Catchy folk-infused joyful melody'
    },
    {
      id: 'tel-happy-6',
      title: 'Yenti Yenti',
      artist: 'Chinmayi',
      album: 'Geetha Govindam',
      duration: '4:02',
      genre: 'Telugu Dance',
      audioPreviewUrl: reliableAudioUrls[5],
      matchReason: 'Playful and upbeat Telugu track'
    },
    {
      id: 'tel-happy-7',
      title: 'Mind Block',
      artist: 'Blaaze',
      album: 'Sarileru Neekevvaru',
      duration: '4:12',
      genre: 'Telugu Mass',
      audioPreviewUrl: reliableAudioUrls[6],
      matchReason: 'High-energy happy mass track'
    },
    {
      id: 'tel-happy-8',
      title: 'Choosi Chudangane',
      artist: 'S. Thaman, Chinmayi',
      album: 'Chalo',
      duration: '3:52',
      genre: 'Telugu Romantic',
      audioPreviewUrl: reliableAudioUrls[7],
      matchReason: 'Feel-good romantic melody'
    },
    {
      id: 'tel-happy-9',
      title: 'Rangamma Mangamma',
      artist: 'MM Manasi',
      album: 'Rangasthalam',
      duration: '3:58',
      genre: 'Telugu Folk',
      audioPreviewUrl: reliableAudioUrls[0],
      matchReason: 'Pleasant folk melody'
    }
  ],
  excited: [
    {
      id: 'tel-excited-1',
      title: 'Naatu Naatu',
      artist: 'Rahul Sipligunj, Kaala Bhairava',
      album: 'RRR',
      duration: '4:45',
      genre: 'Telugu Dance',
      audioPreviewUrl: reliableAudioUrls[1],
      matchReason: 'Oscar-winning high-energy dance anthem'
    },
    {
      id: 'tel-excited-2',
      title: 'Seeti Maar',
      artist: 'Devi Sri Prasad',
      album: 'DJ',
      duration: '4:12',
      genre: 'Telugu Mass',
      audioPreviewUrl: reliableAudioUrls[2],
      matchReason: 'Explosive energy and mass appeal'
    },
    {
      id: 'tel-excited-3',
      title: 'Ringa Ringa',
      artist: 'Rahul Nambiar, Suchitra',
      album: 'Arya 2',
      duration: '4:28',
      genre: 'Telugu Party',
      audioPreviewUrl: reliableAudioUrls[3],
      matchReason: 'Party anthem with exciting beats'
    },
    {
      id: 'tel-excited-4',
      title: 'Oo Antava',
      artist: 'Indravathi Chauhan',
      album: 'Pushpa',
      duration: '3:22',
      genre: 'Telugu Item',
      audioPreviewUrl: reliableAudioUrls[4],
      matchReason: 'Electrifying beats and catchy hook'
    },
    {
      id: 'tel-excited-5',
      title: 'Dheemtanakka',
      artist: 'Raghu Dixit, Priyadarshini',
      album: 'Bahubali 2',
      duration: '3:55',
      genre: 'Telugu Folk Fusion',
      audioPreviewUrl: reliableAudioUrls[5],
      matchReason: 'Energetic folk fusion celebration'
    },
    {
      id: 'tel-excited-6',
      title: 'Top Lesi Poddi',
      artist: 'Benny Dayal, Ranjith',
      album: 'Iddarammayilatho',
      duration: '4:15',
      genre: 'Telugu Dance',
      audioPreviewUrl: reliableAudioUrls[6],
      matchReason: 'High-octane dance number'
    },
    {
      id: 'tel-excited-7',
      title: 'Jigelu Rani',
      artist: 'Rahul Sipligunj, Shilpa Rao',
      album: 'Rangasthalam',
      duration: '4:02',
      genre: 'Telugu Folk',
      audioPreviewUrl: reliableAudioUrls[7],
      matchReason: 'Foot-tapping folk beats'
    },
    {
      id: 'tel-excited-8',
      title: 'Swing Zara',
      artist: 'Neha Bhasin',
      album: 'Jai Lava Kusa',
      duration: '3:48',
      genre: 'Telugu Pop',
      audioPreviewUrl: reliableAudioUrls[0],
      matchReason: 'Peppy and uplifting dance track'
    }
  ],
  calm: [
    {
      id: 'tel-calm-1',
      title: 'Nee Kannu Neeli Samudram',
      artist: 'Sid Sriram',
      album: 'Uppena',
      duration: '4:22',
      genre: 'Telugu Melody',
      audioPreviewUrl: reliableAudioUrls[1],
      matchReason: 'Serene and soothing Telugu vocals'
    },
    {
      id: 'tel-calm-2',
      title: 'Vachinde',
      artist: 'Chinmayi, Dhanunjay',
      album: 'Fidaa',
      duration: '4:08',
      genre: 'Telugu Romantic',
      audioPreviewUrl: reliableAudioUrls[2],
      matchReason: 'Gentle and soothing melody'
    },
    {
      id: 'tel-calm-3',
      title: 'Pillaa Raa',
      artist: 'Sid Sriram',
      album: 'RX 100',
      duration: '3:52',
      genre: 'Telugu Melody',
      audioPreviewUrl: reliableAudioUrls[3],
      matchReason: 'Peaceful and dreamy composition'
    },
    {
      id: 'tel-calm-4',
      title: 'Ninnila',
      artist: 'Sid Sriram',
      album: 'Tholi Prema',
      duration: '4:25',
      genre: 'Telugu Soft',
      audioPreviewUrl: reliableAudioUrls[4],
      matchReason: 'Reflective and emotionally balanced'
    },
    {
      id: 'tel-calm-5',
      title: 'Nee Jathaga',
      artist: 'Haricharan',
      album: 'Yevadu',
      duration: '4:15',
      genre: 'Telugu Soft Rock',
      audioPreviewUrl: reliableAudioUrls[5],
      matchReason: 'Relaxing with beautiful orchestration'
    },
    {
      id: 'tel-calm-6',
      title: 'Kallu Kallu',
      artist: 'Shaan',
      album: 'Athadu',
      duration: '4:05',
      genre: 'Telugu Soft',
      audioPreviewUrl: reliableAudioUrls[6],
      matchReason: 'Easy-going and relaxed feel'
    }
  ],
  sad: [
    {
      id: 'tel-sad-1',
      title: 'Neeli Neeli Aakasam',
      artist: 'Sid Sriram',
      album: '30 Rojullo Preminchadam Ela',
      duration: '4:35',
      genre: 'Telugu Melancholic',
      audioPreviewUrl: reliableAudioUrls[7],
      matchReason: 'Emotional depth and heartfelt vocals'
    },
    {
      id: 'tel-sad-2',
      title: 'Yemaaya Chesave',
      artist: 'Haricharan',
      album: 'Ye Maaya Chesave',
      duration: '5:12',
      genre: 'Telugu Sad',
      audioPreviewUrl: reliableAudioUrls[0],
      matchReason: 'Deeply emotional and touching melody'
    },
    {
      id: 'tel-sad-3',
      title: 'Pranaamam',
      artist: 'Yazin Nizar',
      album: 'Janatha Garage',
      duration: '4:42',
      genre: 'Telugu Emotional',
      audioPreviewUrl: reliableAudioUrls[1],
      matchReason: 'Sorrowful and moving composition'
    },
    {
      id: 'tel-sad-4',
      title: 'Kanulu Kanulanu Dochayante',
      artist: 'Anurag Kulkarni',
      album: 'Mahanati',
      duration: '5:12',
      genre: 'Telugu Classical',
      audioPreviewUrl: reliableAudioUrls[2],
      matchReason: 'Deeply emotional classical piece'
    },
    {
      id: 'tel-sad-5',
      title: 'Emo Emo',
      artist: 'Sid Sriram',
      album: 'Devadas',
      duration: '4:28',
      genre: 'Telugu Melancholic',
      audioPreviewUrl: reliableAudioUrls[3],
      matchReason: 'Heart-wrenching vocals and melody'
    },
    {
      id: 'tel-sad-6',
      title: 'Maate Vinadhuga',
      artist: 'Sid Sriram',
      album: 'Taxiwaala',
      duration: '4:18',
      genre: 'Telugu Sad',
      audioPreviewUrl: reliableAudioUrls[4],
      matchReason: 'Touching and emotional rendition'
    }
  ],
  angry: [
    {
      id: 'tel-angry-1',
      title: 'Blockbuster',
      artist: 'Thaman S',
      album: 'Sarileru Neekevvaru',
      duration: '3:48',
      genre: 'Telugu Mass',
      audioPreviewUrl: reliableAudioUrls[5],
      matchReason: 'Aggressive power and mass energy'
    },
    {
      id: 'tel-angry-2',
      title: 'Dhoom Dhaam',
      artist: 'Benny Dayal',
      album: 'Dookudu',
      duration: '4:05',
      genre: 'Telugu Rock',
      audioPreviewUrl: reliableAudioUrls[6],
      matchReason: 'Intense and powerful Telugu beats'
    },
    {
      id: 'tel-angry-3',
      title: 'Bullet',
      artist: 'Thaman S',
      album: 'Krack',
      duration: '3:55',
      genre: 'Telugu Action',
      audioPreviewUrl: reliableAudioUrls[7],
      matchReason: 'Raw power and fierce attitude'
    },
    {
      id: 'tel-angry-4',
      title: 'Dangamaari Oodhani',
      artist: 'Anurag Kulkarni',
      album: 'Baahubali',
      duration: '4:15',
      genre: 'Telugu Mass',
      audioPreviewUrl: reliableAudioUrls[0],
      matchReason: 'Intense warrior anthem'
    },
    {
      id: 'tel-angry-5',
      title: 'Pakka Local',
      artist: 'Dhanush',
      album: 'Janatha Garage',
      duration: '4:02',
      genre: 'Telugu Mass',
      audioPreviewUrl: reliableAudioUrls[1],
      matchReason: 'High-energy mass number'
    },
    {
      id: 'tel-angry-6',
      title: 'Dhammu',
      artist: 'Devi Sri Prasad',
      album: 'Dammu',
      duration: '3:45',
      genre: 'Telugu Power',
      audioPreviewUrl: reliableAudioUrls[2],
      matchReason: 'Power-packed and intense'
    }
  ],
  neutral: [
    {
      id: 'tel-neutral-1',
      title: 'Priyathama Priyathama',
      artist: 'Sid Sriram',
      album: 'Majili',
      duration: '4:38',
      genre: 'Telugu Romantic',
      audioPreviewUrl: reliableAudioUrls[3],
      matchReason: 'Steady and thoughtful composition'
    },
    {
      id: 'tel-neutral-2',
      title: 'Yemaindo Telidu',
      artist: 'Sid Sriram',
      album: 'Saaho',
      duration: '4:22',
      genre: 'Telugu Melody',
      audioPreviewUrl: reliableAudioUrls[4],
      matchReason: 'Balanced and soothing'
    },
    {
      id: 'tel-neutral-3',
      title: 'Vachadayyo Saami',
      artist: 'Ananya, Sreerama Chandra',
      album: 'Sammohanam',
      duration: '4:18',
      genre: 'Telugu Folk',
      audioPreviewUrl: reliableAudioUrls[5],
      matchReason: 'Balanced folk melody with universal appeal'
    },
    {
      id: 'tel-neutral-4',
      title: 'Kala Bhairava',
      artist: 'Santhosh Narayanan',
      album: 'Dasara',
      duration: '4:05',
      genre: 'Telugu Folk',
      audioPreviewUrl: reliableAudioUrls[6],
      matchReason: 'Moderate tempo folk number'
    },
    {
      id: 'tel-neutral-5',
      title: 'Egiregire',
      artist: 'Sid Sriram',
      album: 'Spyder',
      duration: '4:15',
      genre: 'Telugu Melody',
      audioPreviewUrl: reliableAudioUrls[7],
      matchReason: 'Easy-listening melodious track'
    }
  ],
  // Additional categories
  devotional: [
    {
      id: 'tel-devotional-1',
      title: 'Om Namah Shivaya',
      artist: 'S.P. Balasubrahmanyam',
      album: 'Shiva Stotras',
      duration: '5:30',
      genre: 'Telugu Devotional',
      audioPreviewUrl: reliableAudioUrls[0],
      matchReason: 'Sacred and spiritually uplifting'
    },
    {
      id: 'tel-devotional-2',
      title: 'Govinda Govinda',
      artist: 'S.P. Balasubrahmanyam',
      album: 'Annamayya',
      duration: '4:45',
      genre: 'Telugu Devotional',
      audioPreviewUrl: reliableAudioUrls[1],
      matchReason: 'Divine melody praising Lord Venkateswara'
    },
    {
      id: 'tel-devotional-3',
      title: 'Brahmam Okate',
      artist: 'Ghantasala',
      album: 'Devotional Songs',
      duration: '6:12',
      genre: 'Telugu Classical Devotional',
      audioPreviewUrl: reliableAudioUrls[2],
      matchReason: 'Classic devotional with philosophical depth'
    },
    {
      id: 'tel-devotional-4',
      title: 'Namo Venkatesaya',
      artist: 'M.M. Keeravani',
      album: 'Annamayya',
      duration: '5:18',
      genre: 'Telugu Devotional',
      audioPreviewUrl: reliableAudioUrls[3],
      matchReason: 'Devotional masterpiece'
    },
    {
      id: 'tel-devotional-5',
      title: 'Sri Venkatesam',
      artist: 'K.J. Yesudas',
      album: 'Tirumala Songs',
      duration: '4:55',
      genre: 'Telugu Devotional',
      audioPreviewUrl: reliableAudioUrls[4],
      matchReason: 'Blissful and divine'
    }
  ],
  classical: [
    {
      id: 'tel-classical-1',
      title: 'Samajavaragamana (Classical)',
      artist: 'Sid Sriram',
      album: 'Ala Vaikunthapurramuloo',
      duration: '4:18',
      genre: 'Telugu Classical Fusion',
      audioPreviewUrl: reliableAudioUrls[5],
      matchReason: 'Classical raaga with modern touch'
    },
    {
      id: 'tel-classical-2',
      title: 'Ksheerabdi Kanyakaku',
      artist: 'Ghantasala',
      album: 'Classical Telugu',
      duration: '5:45',
      genre: 'Telugu Classical',
      audioPreviewUrl: reliableAudioUrls[6],
      matchReason: 'Timeless classical melody'
    },
    {
      id: 'tel-classical-3',
      title: 'Ninne Pelladatha',
      artist: 'S. Janaki',
      album: 'Classical Hits',
      duration: '4:52',
      genre: 'Telugu Classical',
      audioPreviewUrl: reliableAudioUrls[7],
      matchReason: 'Beautiful classical composition'
    },
    {
      id: 'tel-classical-4',
      title: 'Tholi Valape',
      artist: 'S.P. Balasubrahmanyam',
      album: 'Classics',
      duration: '5:15',
      genre: 'Telugu Classical',
      audioPreviewUrl: reliableAudioUrls[0],
      matchReason: 'Classic romantic melody'
    }
  ],
  folk: [
    {
      id: 'tel-folk-1',
      title: 'Rangasthalam Title Song',
      artist: 'M.M. Keeravani',
      album: 'Rangasthalam',
      duration: '4:22',
      genre: 'Telugu Folk',
      audioPreviewUrl: reliableAudioUrls[1],
      matchReason: 'Authentic rural Telugu folk'
    },
    {
      id: 'tel-folk-2',
      title: 'Ranga Ranga Rangasthalaana',
      artist: 'Devi Sri Prasad',
      album: 'Rangasthalam',
      duration: '3:58',
      genre: 'Telugu Folk',
      audioPreviewUrl: reliableAudioUrls[2],
      matchReason: 'Energetic folk celebration'
    },
    {
      id: 'tel-folk-3',
      title: 'Jigelu Rani',
      artist: 'Rahul Sipligunj',
      album: 'Rangasthalam',
      duration: '4:02',
      genre: 'Telugu Folk Dance',
      audioPreviewUrl: reliableAudioUrls[3],
      matchReason: 'Foot-tapping folk beats'
    },
    {
      id: 'tel-folk-4',
      title: 'Kurchi Madathapetti',
      artist: 'Sri Krishna',
      album: 'Guntur Kaaram',
      duration: '3:45',
      genre: 'Telugu Folk',
      audioPreviewUrl: reliableAudioUrls[4],
      matchReason: 'Trending folk number'
    },
    {
      id: 'tel-folk-5',
      title: 'Komuram Bheemudo',
      artist: 'Kaala Bhairava',
      album: 'RRR',
      duration: '4:35',
      genre: 'Telugu Folk',
      audioPreviewUrl: reliableAudioUrls[5],
      matchReason: 'Powerful folk anthem'
    }
  ],
  item: [
    {
      id: 'tel-item-1',
      title: 'Oo Antava',
      artist: 'Indravathi Chauhan',
      album: 'Pushpa',
      duration: '3:22',
      genre: 'Telugu Item',
      audioPreviewUrl: reliableAudioUrls[0],
      matchReason: 'Trending item song with catchy beats'
    },
    {
      id: 'tel-item-2',
      title: 'Ringa Ringa',
      artist: 'Suchitra',
      album: 'Arya 2',
      duration: '4:28',
      genre: 'Telugu Item',
      audioPreviewUrl: reliableAudioUrls[1],
      matchReason: 'Classic party anthem'
    },
    {
      id: 'tel-item-3',
      title: 'Jigelu Rani',
      artist: 'Shilpa Rao',
      album: 'Rangasthalam',
      duration: '4:02',
      genre: 'Telugu Item',
      audioPreviewUrl: reliableAudioUrls[2],
      matchReason: 'Foot-tapping folk item number'
    },
    {
      id: 'tel-item-4',
      title: 'Deo Deo',
      artist: 'Manasi, Ranina Reddy',
      album: 'PSV Garuda Vega',
      duration: '3:45',
      genre: 'Telugu Item',
      audioPreviewUrl: reliableAudioUrls[3],
      matchReason: 'High-energy dance number'
    },
    {
      id: 'tel-item-5',
      title: 'Hamsa Naava',
      artist: 'Yazin Nizar, Pranavi',
      album: 'Bahubali 2',
      duration: '3:58',
      genre: 'Telugu Item',
      audioPreviewUrl: reliableAudioUrls[4],
      matchReason: 'Grand visual spectacle song'
    }
  ],
  duets: [
    {
      id: 'tel-duet-1',
      title: 'Vachinde',
      artist: 'Chinmayi, Dhanunjay',
      album: 'Fidaa',
      duration: '4:08',
      genre: 'Telugu Romantic Duet',
      audioPreviewUrl: reliableAudioUrls[5],
      matchReason: 'Beautiful romantic duet'
    },
    {
      id: 'tel-duet-2',
      title: 'Choosi Chudangane',
      artist: 'Thaman, Chinmayi',
      album: 'Chalo',
      duration: '3:52',
      genre: 'Telugu Romantic Duet',
      audioPreviewUrl: reliableAudioUrls[6],
      matchReason: 'Sweet and melodious duet'
    },
    {
      id: 'tel-duet-3',
      title: 'Undiporaadhey',
      artist: 'Sid Sriram, Shreya Ghoshal',
      album: 'Hushaaru',
      duration: '4:25',
      genre: 'Telugu Romantic Duet',
      audioPreviewUrl: reliableAudioUrls[7],
      matchReason: 'Soulful romantic melody'
    },
    {
      id: 'tel-duet-4',
      title: 'Samajavaragamana',
      artist: 'Sid Sriram',
      album: 'Ala Vaikunthapurramuloo',
      duration: '4:18',
      genre: 'Telugu Classical Duet',
      audioPreviewUrl: reliableAudioUrls[0],
      matchReason: 'Classical romantic piece'
    },
    {
      id: 'tel-duet-5',
      title: 'Pilla Nee Venakaley',
      artist: 'Sid Sriram, Rita',
      album: 'RX 100',
      duration: '3:55',
      genre: 'Telugu Romantic Duet',
      audioPreviewUrl: reliableAudioUrls[1],
      matchReason: 'Passionate love song'
    }
  ],
  nineties: [
    {
      id: 'tel-90s-1',
      title: 'Mukkala Mukabula',
      artist: 'S.P. Balasubrahmanyam',
      album: 'Premikudu',
      duration: '5:15',
      genre: 'Telugu 90s Classic',
      audioPreviewUrl: reliableAudioUrls[2],
      matchReason: 'Iconic 90s dance number'
    },
    {
      id: 'tel-90s-2',
      title: 'Pellichesukundam',
      artist: 'S.P. Balasubrahmanyam, Chitra',
      album: 'Pellichesukundam',
      duration: '4:42',
      genre: 'Telugu 90s Classic',
      audioPreviewUrl: reliableAudioUrls[3],
      matchReason: 'Evergreen wedding song'
    },
    {
      id: 'tel-90s-3',
      title: 'Chandamama',
      artist: 'S.P. Balasubrahmanyam',
      album: 'Bombay',
      duration: '4:55',
      genre: 'Telugu 90s Classic',
      audioPreviewUrl: reliableAudioUrls[4],
      matchReason: 'Nostalgic melody'
    },
    {
      id: 'tel-90s-4',
      title: 'Anandham Anandham',
      artist: 'Hariharan',
      album: 'Murari',
      duration: '4:38',
      genre: 'Telugu 90s Classic',
      audioPreviewUrl: reliableAudioUrls[5],
      matchReason: 'Feel-good classic'
    },
    {
      id: 'tel-90s-5',
      title: 'Ennenno Janmala',
      artist: 'S.P. Balasubrahmanyam',
      album: 'Preminchukundam Raa',
      duration: '5:02',
      genre: 'Telugu 90s Classic',
      audioPreviewUrl: reliableAudioUrls[6],
      matchReason: 'Timeless romantic classic'
    },
    {
      id: 'tel-90s-6',
      title: 'Malli Malli',
      artist: 'S.P. Balasubrahmanyam',
      album: 'Premikudu',
      duration: '4:45',
      genre: 'Telugu 90s Classic',
      audioPreviewUrl: reliableAudioUrls[7],
      matchReason: 'Beautiful 90s melody'
    }
  ]
};

// Category labels for UI display
export const categoryLabels: Record<string, string> = {
  happy: '😊 Happy',
  excited: '🎉 Excited',
  calm: '😌 Calm',
  sad: '😢 Sad',
  angry: '😠 Angry',
  neutral: '😐 Neutral',
  devotional: '🙏 Devotional',
  classical: '🎵 Classical',
  folk: '🎻 Folk',
  item: '💃 Item Songs',
  duets: '💑 Duets',
  nineties: '📼 90s Classics'
};
