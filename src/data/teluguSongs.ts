export interface TeluguSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  genre: string;
  audioPreviewUrl: string;
  matchReason: string;
}

// Using different royalty-free audio samples for each song to ensure unique playback
const audioUrls = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
];

let audioIndex = 0;
const getNextAudioUrl = () => {
  const url = audioUrls[audioIndex % audioUrls.length];
  audioIndex++;
  return url;
};

// Telugu songs only - organized by mood
export const teluguMoodSongs: Record<string, TeluguSong[]> = {
  happy: [
    {
      id: 'tel-happy-1',
      title: 'Butta Bomma',
      artist: 'Armaan Malik',
      album: 'Ala Vaikunthapurramuloo',
      duration: '4:05',
      genre: 'Telugu Pop',
      audioPreviewUrl: audioUrls[0],
      matchReason: 'Uplifting Telugu melody with romantic vibes'
    },
    {
      id: 'tel-happy-2',
      title: 'Ramuloo Ramulaa',
      artist: 'Anurag Kulkarni, Mangli',
      album: 'Ala Vaikunthapurramuloo',
      duration: '4:32',
      genre: 'Telugu Folk',
      audioPreviewUrl: audioUrls[1],
      matchReason: 'Energetic folk beats and celebration'
    },
    {
      id: 'tel-happy-3',
      title: 'Samajavaragamana',
      artist: 'Sid Sriram',
      album: 'Ala Vaikunthapurramuloo',
      duration: '4:18',
      genre: 'Telugu Melody',
      audioPreviewUrl: audioUrls[2],
      matchReason: 'Soulful and joyful Telugu music'
    },
    {
      id: 'tel-happy-4',
      title: 'Inkem Inkem',
      artist: 'Sid Sriram',
      album: 'Geetha Govindam',
      duration: '3:54',
      genre: 'Telugu Romantic',
      audioPreviewUrl: audioUrls[3],
      matchReason: 'Sweet and cheerful Telugu melody'
    },
    {
      id: 'tel-happy-5',
      title: 'Srivalli',
      artist: 'Sid Sriram',
      album: 'Pushpa',
      duration: '3:58',
      genre: 'Telugu Folk Pop',
      audioPreviewUrl: audioUrls[4],
      matchReason: 'Catchy folk-infused joyful melody'
    },
    {
      id: 'tel-happy-6',
      title: 'Yenti Yenti',
      artist: 'Chinmayi',
      album: 'Geetha Govindam',
      duration: '4:02',
      genre: 'Telugu Dance',
      audioPreviewUrl: audioUrls[5],
      matchReason: 'Playful and upbeat Telugu track'
    },
    {
      id: 'tel-happy-7',
      title: 'Mind Block',
      artist: 'Blaaze',
      album: 'Sarileru Neekevvaru',
      duration: '4:12',
      genre: 'Telugu Mass',
      audioPreviewUrl: audioUrls[6],
      matchReason: 'High-energy happy mass track'
    },
    {
      id: 'tel-happy-8',
      title: 'Choosi Chudangane',
      artist: 'S. Thaman, Chinmayi',
      album: 'Chalo',
      duration: '3:52',
      genre: 'Telugu Romantic',
      audioPreviewUrl: audioUrls[7],
      matchReason: 'Feel-good romantic melody'
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
      audioPreviewUrl: audioUrls[8],
      matchReason: 'Oscar-winning high-energy dance anthem'
    },
    {
      id: 'tel-excited-2',
      title: 'Seeti Maar',
      artist: 'Devi Sri Prasad',
      album: 'DJ',
      duration: '4:12',
      genre: 'Telugu Mass',
      audioPreviewUrl: audioUrls[9],
      matchReason: 'Explosive energy and mass appeal'
    },
    {
      id: 'tel-excited-3',
      title: 'Ringa Ringa',
      artist: 'Rahul Nambiar, Suchitra',
      album: 'Arya 2',
      duration: '4:28',
      genre: 'Telugu Party',
      audioPreviewUrl: audioUrls[10],
      matchReason: 'Party anthem with exciting beats'
    },
    {
      id: 'tel-excited-4',
      title: 'Oo Antava',
      artist: 'Indravathi Chauhan',
      album: 'Pushpa',
      duration: '3:22',
      genre: 'Telugu Item',
      audioPreviewUrl: audioUrls[11],
      matchReason: 'Electrifying beats and catchy hook'
    },
    {
      id: 'tel-excited-5',
      title: 'Dheemtanakka',
      artist: 'Raghu Dixit, Priyadarshini',
      album: 'Bahubali 2',
      duration: '3:55',
      genre: 'Telugu Folk Fusion',
      audioPreviewUrl: audioUrls[12],
      matchReason: 'Energetic folk fusion celebration'
    },
    {
      id: 'tel-excited-6',
      title: 'Top Lesi Poddi',
      artist: 'Benny Dayal, Ranjith',
      album: 'Iddarammayilatho',
      duration: '4:15',
      genre: 'Telugu Dance',
      audioPreviewUrl: audioUrls[13],
      matchReason: 'High-octane dance number'
    },
    {
      id: 'tel-excited-7',
      title: 'Jigelu Rani',
      artist: 'Rahul Sipligunj, Shilpa Rao',
      album: 'Rangasthalam',
      duration: '4:02',
      genre: 'Telugu Folk',
      audioPreviewUrl: audioUrls[14],
      matchReason: 'Foot-tapping folk beats'
    },
    {
      id: 'tel-excited-8',
      title: 'Swing Zara',
      artist: 'Neha Bhasin',
      album: 'Jai Lava Kusa',
      duration: '3:48',
      genre: 'Telugu Pop',
      audioPreviewUrl: audioUrls[15],
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
      audioPreviewUrl: audioUrls[0],
      matchReason: 'Serene and soothing Telugu vocals'
    },
    {
      id: 'tel-calm-2',
      title: 'Vachinde',
      artist: 'Chinmayi, Dhanunjay',
      album: 'Fidaa',
      duration: '4:08',
      genre: 'Telugu Romantic',
      audioPreviewUrl: audioUrls[1],
      matchReason: 'Gentle and soothing melody'
    },
    {
      id: 'tel-calm-3',
      title: 'Pillaa Raa',
      artist: 'Sid Sriram',
      album: 'RX 100',
      duration: '3:52',
      genre: 'Telugu Melody',
      audioPreviewUrl: audioUrls[2],
      matchReason: 'Peaceful and dreamy composition'
    },
    {
      id: 'tel-calm-4',
      title: 'Ninnila',
      artist: 'Sid Sriram',
      album: 'Tholi Prema',
      duration: '4:25',
      genre: 'Telugu Soft',
      audioPreviewUrl: audioUrls[3],
      matchReason: 'Reflective and emotionally balanced'
    },
    {
      id: 'tel-calm-5',
      title: 'Oka Praanam',
      artist: 'Shreya Ghoshal',
      album: 'Geethanjali',
      duration: '4:45',
      genre: 'Telugu Devotional',
      audioPreviewUrl: audioUrls[4],
      matchReason: 'Peaceful and melodious composition'
    },
    {
      id: 'tel-calm-6',
      title: 'Nee Jathaga',
      artist: 'Haricharan',
      album: 'Yevadu',
      duration: '4:15',
      genre: 'Telugu Soft Rock',
      audioPreviewUrl: audioUrls[5],
      matchReason: 'Relaxing with beautiful orchestration'
    },
    {
      id: 'tel-calm-7',
      title: 'Kallu Kallu',
      artist: 'Shaan',
      album: 'Athadu',
      duration: '4:05',
      genre: 'Telugu Soft',
      audioPreviewUrl: audioUrls[6],
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
      audioPreviewUrl: audioUrls[7],
      matchReason: 'Emotional depth and heartfelt vocals'
    },
    {
      id: 'tel-sad-2',
      title: 'Yemaaya Chesave',
      artist: 'Haricharan',
      album: 'Ye Maaya Chesave',
      duration: '5:12',
      genre: 'Telugu Sad',
      audioPreviewUrl: audioUrls[8],
      matchReason: 'Deeply emotional and touching melody'
    },
    {
      id: 'tel-sad-3',
      title: 'Pranaamam',
      artist: 'Yazin Nizar',
      album: 'Janatha Garage',
      duration: '4:42',
      genre: 'Telugu Emotional',
      audioPreviewUrl: audioUrls[9],
      matchReason: 'Sorrowful and moving composition'
    },
    {
      id: 'tel-sad-4',
      title: 'Kanulu Kanulanu Dochayante',
      artist: 'Anurag Kulkarni',
      album: 'Mahanati',
      duration: '5:12',
      genre: 'Telugu Classical',
      audioPreviewUrl: audioUrls[10],
      matchReason: 'Deeply emotional classical piece'
    },
    {
      id: 'tel-sad-5',
      title: 'Emo Emo',
      artist: 'Sid Sriram',
      album: 'Devadas',
      duration: '4:28',
      genre: 'Telugu Melancholic',
      audioPreviewUrl: audioUrls[11],
      matchReason: 'Heart-wrenching vocals and melody'
    },
    {
      id: 'tel-sad-6',
      title: 'Nuvvunte Naa Jathagaa',
      artist: 'Karthik',
      album: 'Krishnarjuna Yudham',
      duration: '4:28',
      genre: 'Telugu Emotional',
      audioPreviewUrl: audioUrls[12],
      matchReason: 'Melancholic and introspective'
    },
    {
      id: 'tel-sad-7',
      title: 'Maate Vinadhuga',
      artist: 'Sid Sriram',
      album: 'Taxiwaala',
      duration: '4:18',
      genre: 'Telugu Sad',
      audioPreviewUrl: audioUrls[13],
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
      audioPreviewUrl: audioUrls[14],
      matchReason: 'Aggressive power and mass energy'
    },
    {
      id: 'tel-angry-2',
      title: 'Dhoom Dhaam',
      artist: 'Benny Dayal',
      album: 'Dookudu',
      duration: '4:05',
      genre: 'Telugu Rock',
      audioPreviewUrl: audioUrls[15],
      matchReason: 'Intense and powerful Telugu beats'
    },
    {
      id: 'tel-angry-3',
      title: 'Bullet',
      artist: 'Thaman S',
      album: 'Krack',
      duration: '3:55',
      genre: 'Telugu Action',
      audioPreviewUrl: audioUrls[0],
      matchReason: 'Raw power and fierce attitude'
    },
    {
      id: 'tel-angry-4',
      title: 'Dangamaari Oodhani',
      artist: 'Anurag Kulkarni',
      album: 'Baahubali',
      duration: '4:15',
      genre: 'Telugu Mass',
      audioPreviewUrl: audioUrls[1],
      matchReason: 'Intense warrior anthem'
    },
    {
      id: 'tel-angry-5',
      title: 'Pakka Local',
      artist: 'Dhanush',
      album: 'Janatha Garage',
      duration: '4:02',
      genre: 'Telugu Mass',
      audioPreviewUrl: audioUrls[2],
      matchReason: 'High-energy mass number'
    },
    {
      id: 'tel-angry-6',
      title: 'Dhammu',
      artist: 'Devi Sri Prasad',
      album: 'Dammu',
      duration: '3:45',
      genre: 'Telugu Power',
      audioPreviewUrl: audioUrls[3],
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
      audioPreviewUrl: audioUrls[4],
      matchReason: 'Steady and thoughtful composition'
    },
    {
      id: 'tel-neutral-2',
      title: 'Yemaindo Telidu',
      artist: 'Sid Sriram',
      album: 'Saaho',
      duration: '4:22',
      genre: 'Telugu Melody',
      audioPreviewUrl: audioUrls[5],
      matchReason: 'Balanced and soothing'
    },
    {
      id: 'tel-neutral-3',
      title: 'Vachadayyo Saami',
      artist: 'Ananya, Sreerama Chandra',
      album: 'Sammohanam',
      duration: '4:18',
      genre: 'Telugu Folk',
      audioPreviewUrl: audioUrls[6],
      matchReason: 'Balanced folk melody with universal appeal'
    },
    {
      id: 'tel-neutral-4',
      title: 'Kala Bhairava',
      artist: 'Santhosh Narayanan',
      album: 'Dasara',
      duration: '4:05',
      genre: 'Telugu Folk',
      audioPreviewUrl: audioUrls[7],
      matchReason: 'Moderate tempo folk number'
    },
    {
      id: 'tel-neutral-5',
      title: 'Egiregire',
      artist: 'Sid Sriram',
      album: 'Spyder',
      duration: '4:15',
      genre: 'Telugu Melody',
      audioPreviewUrl: audioUrls[8],
      matchReason: 'Easy-listening melodious track'
    },
    {
      id: 'tel-neutral-6',
      title: 'Rangamma Mangamma',
      artist: 'MM Manasi',
      album: 'Rangasthalam',
      duration: '3:58',
      genre: 'Telugu Folk',
      audioPreviewUrl: audioUrls[9],
      matchReason: 'Pleasant folk melody'
    }
  ]
};
