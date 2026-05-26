// Sicily Through Time — Era Content Data
// Each era drives the spinning wheel (arcQuotes), right panel content, and marble shader accent color.

export interface Writing {
  originalText: string;
  language: string;
  author: string;
  authorRole: string;
  year: string;
  povContext: string;
  translation: string;
}

export interface Landmark {
  name: string;
  location: string;
  description: string;
  originalLanguageName: string;
}

export interface Era {
  id: string;
  era: string;
  eraLabel: string;
  period: string;
  symbol: string;
  symbolEmoji: string;
  color: string;          // primary accent color
  colorDim: string;       // dimmed version for backgrounds
  eraIndex: string;       // "01" – "06"
  heroImage: string;      // URL to cutout hero image (left lockup)
  placePhotos: { src: string; title: string; location: string; caption: string; objectPosition?: string }[];  // user's photos for the right panel (first is cover)
  whoDescription: string; // 1-2 sentences about the narrator/person
  placeDescription: string; // experiential description of the place
  landmark: Landmark;
  writings: Writing[];
  layerTags: string;           // short keywords summarizing what this era left behind
  quoteSource: string;         // one-liner describing where the quotes come from
  arcQuotes: string[];         // 6 short quote fragments in native language; cycled to fill the 12-slot spinning wheel
  arcTranslations: string[];   // 6 matching English translations, 1:1 with arcQuotes
}

export const ERAS: Era[] = [
  // ── 1. GREEK ──────────────────────────────────────────────────────────────
  {
    id: "greek",
    era: "Ancient Greek era in Sicily",
    eraLabel: "Greek Era",
    period: "734 BCE",
    symbol: "Doric column capital",
    symbolEmoji: "🏛",
    color: "#E8622A",
    colorDim: "#1a0a05",
    eraIndex: "01",
    heroImage: "/photos/hero_greek.png",
    placePhotos: [
      { src: "/photos/1-greek-teater.JPG", title: "Greek Theater", location: "Taormina", caption: "Initially constructed by the Greeks in the 3rd century BC, the theater was later expanded by the Romans. Carved into the hillside above the sea, it frames Mount Etna and the Ionian coastline in a single glance — a stage where drama and landscape become inseparable." },
      { src: "/photos/1-greek-temple.JPG", title: "The Valley of the Temples", location: "Agrigento", caption: "Spanning over 1,300 hectares, this UNESCO World Heritage site preserves some of the finest Greek Doric temples outside of Greece itself. Built in the 5th century BC when Akragas was among the richest cities in the Mediterranean, the temples still crown the ridge like sentinels watching over the valley below." },
    ],
    whoDescription: "A Syracuse fisherman, dreaming of golden catches in the harbor shadow of Apollo's temple — drawn from Theocritus' twenty-first Idyll.",
    placeDescription: "The Greeks left theaters, temples, and the idea of the city itself. The Theater of Taormina still hosts performances. The Valley of the Temples in Agrigento is one of the best-preserved Greek sites outside Greece — you can still see the Doric columns towering on the hilltop, watching over the people as you drive into the city.",
    layerTags: "City · Theater · Temple",
    quoteSource: "Theocritus, Idyll XXI — The Fishermen, c. 270 BCE",
    arcQuotes: [
      "Ἁ πενία, Διόφαντε, μόνα τὰς τέχνας ἐγείρει",
      "δύ᾽ ἁλιέες ἐκοιμάσαντο γέροντες",
      "τὸν χρύσειον ἰχθὺν ἀνεῖλκον",
      "ὤμοσα μηκέτι λοιπὸν ἁλὸς βαθὺ χεῦμα πατῆσαι",
      "ἐν φύκεσσι δ᾽ ἔκειντο παρ᾽ ἀλλήλοισι",
      "τὰ γὰρ ὕπαρ ἐξ ὀνείρων ζάτει",
    ],
    arcTranslations: [
      "Poverty alone, Diophantus, rouses the arts to waking",
      "Two old fishermen lay down to sleep together",
      "He pulled up the golden fish",
      "He swore never again to tread the deep swell of the sea",
      "They lay side by side among the seaweed",
      "Seek the waking world, not the world of dreams",
    ],
    landmark: {
      name: "Temple of Apollo",
      location: "Ortygia, Syracuse",
      description:
        "The oldest Doric temple in Sicily, built around 565 BCE on the island of Ortygia — the first stone monument the Greek colonists raised in their new city.",
      originalLanguageName: "Ναὸς τοῦ Ἀπόλλωνος",
    },
    writings: [
      {
        originalText:
          "Ἁ πενία, Διόφαντε, μόνα τὰς τέχνας ἐγείρει· αὐτὰ τῶ μοχθεῦντος ἔχει μαθήματα φρουρά.",
        language: "Ancient Greek",
        author: "Theocritus",
        authorRole: "Greek bucolic poet, born in Syracuse",
        year: "c. 270 BCE",
        povContext:
          "Two old fishermen lie in their woven hut near the harbor of Syracuse. One dreams of pulling a golden fish from the sea and swears never to go back to the water. The other tells him to wake up: dreams are dreams, and hunger is real. I wrote this for every man who has slept on the shore and imagined a different life.",
        translation:
          "Poverty alone, Diophantus, rouses the arts to waking; poverty, the very teacher of toil.",
      },
      {
        originalText:
          "χρύσειον δ᾽ ἐδόκησε λαβεῖν ἰχθύν· ὁ δ᾽ ἐπ᾽ ὅρκον ἦλθε μηκέτ᾽ ἐπ᾽ οἶδμα θαλάσσιον ἐξαναβαίνειν.",
        language: "Ancient Greek",
        author: "Theocritus",
        authorRole: "Greek bucolic poet, born in Syracuse",
        year: "c. 270 BCE",
        povContext:
          "Asphalion tells his dream: he caught a fish made of gold, and in his joy he swore an oath to the gods that he would never set foot on the sea again. But his companion laughs — you did not swear, you only dreamed you swore. Go back to fishing, or you will starve awake.",
        translation:
          "He dreamed he caught a golden fish; and upon that dream he swore an oath never again to venture onto the swelling sea.",
      },
      {
        originalText:
          "ζάτει τὰ ὕπαρ· ἰχθὺν θήρα τὸν ἐξ ἀλεθείας, μή ποτε λιμῷ θάνῃς, καὶ χρυσὰ ὀνειρώσσων.",
        language: "Ancient Greek",
        author: "Theocritus",
        authorRole: "Greek bucolic poet, born in Syracuse",
        year: "c. 270 BCE",
        povContext:
          "The old friend's reply: seek the waking world, not the dreaming one. Hunt the real fish, or you will die of hunger dreaming of gold. This is the wisdom of the poor — that beauty lives in what is actual, not what is wished for.",
        translation:
          "Seek the waking world; hunt the fish that is real, lest you die of hunger while dreaming of gold.",
      },
    ],
  },

  // ── 2. CARTHAGINIAN ───────────────────────────────────────────────────────
  {
    id: "carthaginian",
    eraIndex: "02",
    heroImage: "/photos/hero_punic.jpg",
    placePhotos: [
      { src: "/photos/2-punic-motya.jpg", title: "Stagnone Lagoon", location: "Motya Island", caption: "Founded as a 7th-century BC Phoenician colony, Motya sits in a shallow lagoon connected to the mainland by a submerged causeway. It became Carthage's most strategic outpost in western Sicily until Dionysius of Syracuse destroyed it in 397 BC. Today the island is an open-air archaeological park." },
      { src: "/photos/2 -punic-Purpledye.jpg", title: "Tyrian Purple", location: "Western Sicily", caption: "The Phoenicians who founded Carthage were named for their most famous export — phoínikes, the purple people. They extracted Tyrian purple from murex sea snails along Sicily's western coast, crushing thousands of shells for a single gram of the ancient world's most precious dye. The salt pans of Trapani and Marsala trace their origins to the same Punic coastal industry." },
    ],
    whoDescription: "Hamilcar Barca, the Carthaginian general who seized western Sicily and waged relentless guerrilla war against Rome from the mountain fortress of Hercte.",
    placeDescription: "The Carthaginians left the salt flats and windmills of Marsala, the submerged causeway to Motya island, and the Tophet, a sacred burial ground for children. The Valley of the Temples stands as silent witness to the wars they fought with the Greeks for control of this island.",
    era: "Carthaginian/Punic era in Sicily",
    eraLabel: "Punic Era",
    period: "247 BCE",
    symbol: "Sign of Tanit",
    symbolEmoji: "🌙",
    color: "#D4467A",
    colorDim: "#150008",
    layerTags: "Salt Flats · Purple Dye · Causeways",
    quoteSource: "Polybius, Histories Book I — The First Punic War, c. 150 BCE",
    arcQuotes: [
      "Ἀμίλκας ὁ Βάρκας διέβη εἰς Σικελίαν",
      "κατελάβετο τὸ καλούμενον Ἑρκτὴν ὄρος",
      "τὴν Μοτύην νῆσον ἐτείχισαν οἱ Φοίνικες",
      "πολεμῶν τοῖς Ῥωμαίοις ἐν Σικελίᾳ διετέλει",
      "ναυμαχίαν συνέστησαν περὶ τὰς Αἰγάτας",
      "Καρχηδόνιοι τὴν θάλατταν ἐκράτουν",
    ],
    arcTranslations: [
      "Hamilcar Barca crossed over to Sicily",
      "He seized the mountain called Hercte",
      "The Phoenicians fortified the island of Motya",
      "He continued waging war against the Romans in Sicily",
      "They joined battle near the Aegates Islands",
      "The Carthaginians held mastery of the sea",
    ],
    landmark: {
      name: "Motya Island Walls",
      location: "San Pantaleo Island, western Sicily",
      description:
        "The fortified island city of Motya in the Stagnone Lagoon — one of the most powerful Carthaginian outposts in Sicily, its massive walls a testament to Phoenician engineering.",
      originalLanguageName: "hmṭwʾ",
    },
    writings: [
      {
        originalText:
          "Ἀμίλκας ὁ Βάρκας, παραλαβὼν τὴν δύναμιν, διέβη εἰς Σικελίαν καὶ κατελάβετο τὸ καλούμενον Ἑρκτὴν ὄρος.",
        language: "Ancient Greek",
        author: "Polybius",
        authorRole: "Greek historian",
        year: "c. 150 BCE",
        povContext:
          "Hamilcar Barca crossed to Sicily with his forces and seized Mount Hercte, the fortress between Eryx and Panormus. From that impregnable height he waged war on the Romans for years, raiding their territory by land and sea, never defeated in the field. I write this so that men may understand the nature of this war and the quality of the man who fought it.",
        translation:
          "Hamilcar Barca, having taken command of the forces, crossed to Sicily and seized the mountain called Hercte.",
      },
      {
        originalText:
          "Καρχηδόνιοι τὴν Μοτύην νῆσον ἐτείχισαν καὶ τῷ τείχει τὴν πόλιν ὠχύρωσαν, ὥστε δυσπρόσιτον εἶναι τοῖς πολεμίοις.",
        language: "Ancient Greek",
        author: "Polybius",
        authorRole: "Greek historian",
        year: "c. 150 BCE",
        povContext:
          "The Carthaginians fortified the island of Motya and strengthened the city with walls, making it nearly impregnable to enemies. The lagoon itself served as a moat, the causeway as a chokepoint. It was the jewel of their Sicilian dominion — until Dionysius of Syracuse brought siege towers across the shallow water and burned it.",
        translation:
          "The Carthaginians fortified the island of Motya and strengthened the city with walls, so that it was nearly impregnable to enemies.",
      },
      {
        originalText:
          "ναυμαχίαν συνέστησαν περὶ τὰς Αἰγάτας νήσους· ἡττηθέντες δὲ Καρχηδόνιοι πρέσβεις ἔπεμψαν περὶ εἰρήνης.",
        language: "Ancient Greek",
        author: "Polybius",
        authorRole: "Greek historian",
        year: "c. 150 BCE",
        povContext:
          "The final sea battle was fought near the Aegates Islands. The Carthaginian fleet, overloaded with supplies for Hamilcar's army, was crushed by the Roman ships. Carthage sued for peace. Sicily — the prize they had fought over for twenty-three years — was lost. This was the end of Carthaginian Sicily.",
        translation:
          "They joined battle near the Aegates Islands; and the Carthaginians, being defeated, sent ambassadors to sue for peace.",
      },
    ],
  },

  // ── 3. ROMAN ──────────────────────────────────────────────────────────────
  {
    id: "roman",
    eraIndex: "03",
    heroImage: "/photos/hero_roman.png",
    placePhotos: [
      { src: "/photos/3-roman-syracusa.jpg", title: "Neapolis Archaeological Park", location: "Syracuse", caption: "Unlike Greek theaters, which were semicircular and built for drama, Roman amphitheaters were fully elliptical arenas designed for spectacle — gladiator combat, animal hunts, and public executions. The amphitheater of Syracuse measures roughly 140 by 119 meters, carved partly from the living rock." },
      { src: "/photos/3-roman-catania.JPG", title: "Roman Amphitheatre", location: "Catania", caption: "Hidden beneath Piazza Stesicoro, Catania's 2nd-century AD amphitheater was built from dark lava stone and brick — earning it the name \"Black Colosseum.\" Once among the largest in the Roman world with over 15,000 seats, most of it remains buried under the modern city, a reminder that the ground you walk on holds more history than you can see." },
    ],
    whoDescription: "Cicero, the Roman orator who prosecuted the corrupt governor Verres for plundering Sicily's temples and art — his speeches remain the most vivid account of the island under Rome.",
    placeDescription: "The Romans left the amphitheaters of Syracuse and Catania, aqueducts, and the road network that still shapes how Sicilians drive today. Every hilltop town with a view was once a Roman lookout.",
    era: "Roman era in Sicily",
    eraLabel: "Roman Era",
    period: "70 BCE",
    symbol: "Mosaic tile",
    symbolEmoji: "🦅",
    color: "#C94040",
    colorDim: "#150000",
    layerTags: "Roads · Arena · Grain",
    quoteSource: "Cicero, In Verrem — The Prosecution of Verres, 70 BCE",
    arcQuotes: [
      "Recepi causam Siciliae",
      "Verres omnia signa atque ornamenta sustulit",
      "Cellam penariam rei publicae nostrae",
      "Nutricem plebis Romanae Siciliam nominabat",
      "Sicilia prima omnium provincia est appellata",
      "Hic est locus ex quo omnia sustulit",
    ],
    arcTranslations: [
      "I have taken up the cause of Sicily",
      "Verres removed all the statues and ornaments",
      "The storehouse of our republic",
      "He called Sicily the nurse of the Roman people",
      "Sicily was the first of all to be called a province",
      "This is the place from which he took everything",
    ],
    landmark: {
      name: "Valley of the Temples",
      location: "Agrigento, Sicily",
      description:
        "The monumental sacred ridge of ancient Akragas — seven Greek temples that Cicero visited during his prosecution of Verres, who had plundered their treasures.",
      originalLanguageName: "Vallis Templorum",
    },
    writings: [
      {
        originalText:
          "Recepi enim causam Siciliae: ea me ad hoc negotium provincia attraxit.",
        language: "Latin",
        author: "Marcus Tullius Cicero",
        authorRole: "Roman orator and statesman",
        year: "70 BCE",
        povContext:
          "The sun beats down on the forum. I have taken up the cause of Sicily — this province that Rome calls its own but treats as a possession to be plundered. Verres has stripped the temples, stolen the statues, taxed the farmers into ruin. I have walked through Syracuse and seen the empty plinths where great works once stood. I will be their voice.",
        translation:
          "For I have taken up the cause of Sicily: that province drew me to this business.",
      },
      {
        originalText:
          "Itaque ille M. Cato Sapiens cellam penariam rei publicae nostrae, nutricem plebis Romanae Siciliam nominabat.",
        language: "Latin",
        author: "Marcus Tullius Cicero",
        authorRole: "Roman orator and statesman",
        year: "70 BCE",
        povContext:
          "I walk through the markets of Syracuse. The grain is everywhere — sacks of it, carts of it, ships loaded with it in the harbor. Rome eats because Sicily grows. Cato called this island the storehouse of the republic, the nurse of the Roman people. And yet we send governors here who treat it like a private treasury.",
        translation:
          "And so the wise Marcus Cato used to call Sicily the storehouse of our republic, the nurse of the Roman people.",
      },
      {
        originalText:
          "Hic est locus, iudices, ex quo Verres omnia signa atque ornamenta sustulit.",
        language: "Latin",
        author: "Marcus Tullius Cicero",
        authorRole: "Roman orator and statesman",
        year: "70 BCE",
        povContext:
          "I stand in the empty hall and point to where the statues were. The marks on the floor are still visible — the bases, the pedestals, the shadows of things that are gone. The Sicilians remember every piece. They told me the names, the artists, the ages. Memory is the only thing Verres could not steal.",
        translation:
          "This is the place, judges, from which Verres removed all the statues and ornaments.",
      },
    ],
  },

  // ── 4. ARAB ───────────────────────────────────────────────────────────────
  {
    id: "arab",
    eraIndex: "04",
    heroImage: "/photos/hero_arab.png",
    placePhotos: [
      { src: "/photos/4-arab-orange trees.JPG", title: "Orange Trees", location: "Caltagirone", caption: "Arab settlers transformed Sicily's landscape by introducing citrus — oranges, lemons, and the irrigation systems to sustain them. Today citrus is woven into everything Sicilian: limoncello, blood orange juice from the slopes of Etna, candied peel in cassata, orange blossom water in pastries. Every spring the air fills with zagara — orange blossom scent — and every ceramic, tile, and tablecloth seems to carry a painted lemon." },
      { src: "/photos/4-arab-grantia.JPG", title: "Granita Siciliana", location: "Taormina", caption: "Arab settlers brought sherbet-making traditions to Sicily, mixing snow from Mount Etna with fruit juices and sugar cane they introduced to the island. Over centuries this evolved into granita — still served today with brioche for breakfast, a frozen echo of Arab ingenuity.", objectPosition: "center 70%" },
      { src: "/photos/4-arab-testi di moro.JPG", title: "Moor's Heads", location: "Palermo", caption: "Iconic Sicilian ceramic vases representing a legend of forbidden love, jealousy, and revenge from the Arab period. Displayed in pairs to protect homes from bad luck and bring prosperity, often adorned with fruit and flowers to signify abundance.", objectPosition: "center bottom" },
      { src: "/photos/4-arab-seafood couscous.jpg", title: "Seafood Couscous", location: "Agrigento", caption: "Berber and Arab settlers brought couscous to western Sicily, where locals adapted it with Mediterranean fish and seafood. Trapanese fish couscous remains a signature dish, celebrated annually at the Cous Cous Fest in San Vito Lo Capo — a living bridge between North Africa and Sicily." },
    ],
    whoDescription: "Ibn Hamdis, the great Sicilian Arab poet exiled from Syracuse after the Norman conquest — his verse aches with longing for the island he could never return to.",
    placeDescription: "The Arabs left the gardens, the irrigation channels, and the food. Cassata, granita, couscous, oranges, lemons — all Arab introductions. The Teste di Moro ceramics on every balcony tell a legend of Moorish love.",
    era: "Arab/Islamic era in Sicily",
    eraLabel: "Arab Era",
    period: "1056 CE",
    symbol: "Geometric star pattern",
    symbolEmoji: "⭐",
    color: "#4CAF50",
    colorDim: "#010f01",
    layerTags: "Citrus · Sugar · Love & Revenge",
    quoteSource: "Ibn Hamdis al-Siqilli — Exile poetry from Syracuse, c. 1090 CE",
    arcQuotes: [
      "ذَكَرتُ صِقِلِّيَةَ وَالأَسى يَهيجُ بِنَفسي",
      "دارٌ لَهَوتُ بِها زَماناً طَويلاً",
      "فَإِذا تَمَثَّلَها الفُؤادُ تَأَوَّها",
      "جَنَّةُ الدُنيا الَّتي قَد أُخرِجتُ مِنها",
      "نَزَحَت بِنا عَنها الخُطوبُ فَأَصبَحَت",
      "وَقَد كانَ فيها لِلشَبابِ رَبيعُ",
    ],
    arcTranslations: [
      "I remembered Sicily, and longing stirs in my soul",
      "A home where I reveled for a long, long time",
      "When the heart pictures her, it sighs deeply",
      "The paradise of this world, from which I have been expelled",
      "Misfortune carried us far from her",
      "There was a springtime of youth in that land",
    ],
    landmark: {
      name: "Zisa Palace",
      location: "Palermo, Sicily",
      description:
        "A magnificent Arab-Norman palace, its name from Arabic al-ʿAzīza — 'the magnificent.' Built by Arab craftsmen as a summer residence, it embodies the cultural splendor Ibn Hamdis mourned from exile.",
      originalLanguageName: "قصر العزيزة",
    },
    writings: [
      {
        originalText:
          "ذَكَرتُ صِقِلِّيَةَ وَالأَسى يَهيجُ بِنَفسي تَذَكُّرَها وَمَن عَهدي بِهِ طِفلا",
        language: "Classical Arabic",
        author: "Ibn Hamdis",
        authorRole: "Sicilian Arab poet, born in Syracuse",
        year: "c. 1056–1133 CE",
        povContext:
          "I remember Sicily and grief stirs in my soul — the memory of it, and of the one I knew there as a child. I left Syracuse when the Normans came. I have wandered from court to court in al-Andalus and North Africa, and every orange grove reminds me of the one I lost. I write so that the island I loved does not disappear entirely into silence.",
        translation:
          "I remembered Sicily, and longing stirs in my soul — the memory of her, and of those I knew there as a child.",
      },
      {
        originalText:
          "جَنَّةُ الدُنيا الَّتي قَد أُخرِجتُ مِنها، فَلَيتَ شِعري هَل لي مِن عَودَةٍ إِلَيها؟",
        language: "Classical Arabic",
        author: "Ibn Hamdis",
        authorRole: "Sicilian Arab poet, born in Syracuse",
        year: "c. 1056–1133 CE",
        povContext:
          "Sicily was the paradise of this world, and I was expelled from it. Will I ever return? I ask this question of every sea I cross, every ship I board. The answer is always the same. The island I left no longer exists — it has been remade by others. But in my verse, it lives as it was.",
        translation:
          "The paradise of this world, from which I have been expelled — will I ever, I wonder, be granted return?",
      },
      {
        originalText:
          "وَقَد كانَ فيها لِلشَبابِ رَبيعُ، وَلِلعَيشِ فيها نَضرَةٌ وَبَهاءُ",
        language: "Classical Arabic",
        author: "Ibn Hamdis",
        authorRole: "Sicilian Arab poet, born in Syracuse",
        year: "c. 1056–1133 CE",
        povContext:
          "There was a springtime of youth in Sicily, and life there had a freshness and a splendor. I remember the gardens, the water running through marble channels, the sound of the adhan at dawn over Palermo. All of it is gone now, or changed beyond recognition. But poetry is the only exile-proof thing I own.",
        translation:
          "There was a springtime of youth in that land, and life there had a freshness and a splendor.",
      },
    ],
  },

  // ── 5. NORMAN ─────────────────────────────────────────────────────────────
  {
    id: "norman",
    eraIndex: "05",
    heroImage: "/photos/hero_norman.png",
    placePhotos: [
      { src: "/photos/5-norman-palermo.jpg", title: "Palatine Chapel", location: "Palermo", caption: "The royal chapel of the Norman kings, consecrated in 1140 inside the Palazzo dei Normanni. Byzantine gold mosaics cover the walls, an Arab muqarnas ceiling floats overhead like a honeycomb of stars, and Norman arches hold it all together — three civilizations fused into one room." },
      { src: "/photos/5-norman-cefalu.JPG", title: "Cathedral of Cefalu", location: "Cefalu", caption: "Built by Roger II beginning in 1131, the cathedral dominates the coastal town from its clifftop perch, visible from miles out at sea. Its golden apse mosaic of Christ Pantocrator — enormous, serene, inescapable — is one of the finest in Sicily." },
    ],
    whoDescription: "Roger II, the Norman king crowned in 1130, who built the Cappella Palatina and wore a mantle embroidered with Arabic script — ruler of the most cosmopolitan court in medieval Europe.",
    placeDescription: "The Normans left the cathedrals — Monreale, Cefalù, the Cappella Palatina — where Byzantine gold mosaics meet Arab muqarnas ceilings under Norman arches. Every town with a castle on a cliff is probably Norman.",
    era: "Norman era in Sicily",
    eraLabel: "Norman Era",
    period: "1130 CE",
    symbol: "Lion and camel from Roger II's Royal Mantle",
    symbolEmoji: "👑",
    color: "#B8860B",
    colorDim: "#130d00",
    layerTags: "Castles · Fusion · Crown",
    quoteSource: "Roger II's Royal Mantle & Cappella Palatina inscriptions, c. 1134 CE",
    arcQuotes: [
      "عُمِلَ في الطِراز المَلَكي المَعمور",
      "المَملوء بِالإجلال وَالجَلالة وَالكَمال",
      "في مَدينة صِقِلِّية سَنة ٥٢٨",
      "المُبارَكة بِالحَظّ وَالسَعادة",
      "أَمَرَ بِعِمارَتِهِ المَلِك رُوجار",
      "كَنيسة القَصر المُقَدَّسة الفَخيمة",
    ],
    arcTranslations: [
      "Made in the princely treasury, filled with prosperity",
      "Filled with glory, majesty, and perfection",
      "In the capital of Sicily, in the year 528",
      "Blessed with fortune and happiness",
      "King Roger ordered its construction",
      "The sacred and magnificent chapel of the palace",
    ],
    landmark: {
      name: "Cappella Palatina",
      location: "Palazzo dei Normanni, Palermo",
      description:
        "The royal chapel of the Norman kings, consecrated in 1140 — its Arabic dedicatory inscription and muqarnas ceiling alongside Byzantine mosaics make it the supreme monument of Sicily's cultural synthesis.",
      originalLanguageName: "الكنيسة الفلاطينية",
    },
    writings: [
      {
        originalText:
          "عُمِلَ في الطِراز المَلَكي المَعمور بِالسَعد وَالإجلال وَالجَلال وَالكَمال وَالطَول وَالإفضال... في مَدينة صِقِلِّية سَنة ٥٢٨ هـ.",
        language: "Classical Arabic",
        author: "Roger II's Royal Mantle inscription",
        authorRole: "Arabic inscription embroidered on the coronation mantle",
        year: "1133–1134 CE",
        povContext:
          "I am an Arab craftsman in the workshop of a Norman king. My hands have embroidered this silk with Arabic script — lions seizing camels, the circle of hours, and a blessing in Kufic. The king will wear it at his coronation. He does not read Arabic, but he understands its beauty. The mantle I am making will outlast all of us.",
        translation:
          "Made in the princely treasury, filled with fortune, glory, majesty, perfection, generosity, and munificence... in the capital of Sicily, in the year 528 H.",
      },
      {
        originalText:
          "أَمَرَ بِعِمارَة هَذِهِ الكَنيسة المُقَدَّسة المُبارَكة عَبد اللَه المُعتَزّ بِاللَه المُستَنصِر بِقُدرَتِه، رُوجار المَلِك",
        language: "Classical Arabic",
        author: "Cappella Palatina dedicatory inscription",
        authorRole: "Arabic inscription in the Palatine Chapel",
        year: "c. 1140 CE",
        povContext:
          "The chapel is finished. The gold mosaics blaze in the candlelight, the muqarnas ceiling rises like a honeycomb of stars, and the Arabic inscription runs along the walls recording that Roger, king and servant of God, ordered this sacred chapel built. Three languages, three traditions, one room. Nothing like this has ever existed before.",
        translation:
          "The construction of this holy, blessed chapel was ordered by the servant of God, who glories in God, who triumphs through His power — Roger the King.",
      },
      {
        originalText:
          "المُبارَكة بِالحَظّ وَالسَعادة وَحُسن المُلك، في حِراسَة اللَه وَحِفظِه",
        language: "Classical Arabic",
        author: "Cappella Palatina dedicatory inscription",
        authorRole: "Arabic inscription in the Palatine Chapel",
        year: "c. 1140 CE",
        povContext:
          "The inscription continues around the chapel walls, invoking blessings of fortune, happiness, and good governance under God's protection. A Norman king chose Arabic — the language of his Muslim subjects — to dedicate a Christian chapel. This is not tolerance in the modern sense. It is something stranger and more interesting: a king who understood that beauty belongs to no single faith.",
        translation:
          "Blessed with fortune and happiness and good governance, under the protection and preservation of God.",
      },
    ],
  },

  // ── 6. MODERN ─────────────────────────────────────────────────────────────
  {
    id: "modern",
    eraIndex: "06",
    heroImage: "/photos/hero_modern.JPG",
    placePhotos: [
      { src: "/photos/6-modern.mp4", title: "On the Road", location: "Agrigento", caption: "Driving down the highway, columns that have stood for twenty-five centuries blur past the window. For a dizzying moment, the ancient and the modern collide — as if a thousand years could fold into the space between one heartbeat and the next." },
      { src: "/photos/6-modern-layers-of-us.mp4", title: "Layers of Us", location: "Taormina", caption: "Sicily is shaped by every civilization that passed through — Greek, Punic, Roman, Arab, Norman — each leaving traces that make it what it is. People are like that too. We carry the eras that shaped us. Travel is how you discover each other's layers, see what left its mark, and add a beautiful new one together." },
    ],
    whoDescription: "A tourist on the highway, glimpsing the temples through the windshield — the shape of the rental car framing two and a half thousand years of ruins.",
    placeDescription: "The modern age gave us cars, planes, highways, and the internet. We don't speak the local language, but with technology we can travel Sicily on our own — and find ourselves overwhelmed by the civilizations that came before us.",
    era: "Modern era in Sicily",
    eraLabel: "Modern Era",
    period: "2026",
    symbol: "Car on a highway passing ancient temples",
    symbolEmoji: "🚗",
    color: "#607D8B",
    colorDim: "#050a0d",
    layerTags: "Diaspora · Ruins · Concrete",
    quoteSource: "Yueran's diary in Sicily, 2026",
    arcQuotes: [
      "从没吃过这么好吃的冰沙，口感细腻，层次丰富",
      "能够看到大海的酒店房间",
      "四月的空气中都是橙花的香气",
      "开车心惊胆战，两道的公路经常要开出三道",
      "夕阳下的希腊神庙，一瞬间有不真实感",
      "街上春游的意大利小朋友会用中文给我们打招呼",
    ],
    arcTranslations: [
      "Never had a granita this good — silky smooth, with layers of flavor",
      "A hotel room overlooking the sea",
      "April air filled with the scent of orange blossoms",
      "White-knuckle driving — two-lane roads constantly driven as three",
      "Greek temples in the sunset — for a moment, unreal",
      "Italian kids on a school trip greeted us in Chinese on the street",
    ],
    landmark: {
      name: "The Highway Past the Temples",
      location: "SS115, near Agrigento",
      description:
        "The modern road that runs past the Valley of the Temples — where thousands of travelers glimpse 2,500-year-old ruins through a car window at 90 km/h, a collision of timescales.",
      originalLanguageName: "Valle dei Templi",
    },
    writings: [
      {
        originalText:
          "从没吃过这么好吃的冰沙，口感细腻，层次丰富，配上热热的brioche，是西西里最美妙的早餐",
        language: "Chinese",
        author: "Yueran's diary in Sicily",
        authorRole: "Contemporary traveler",
        year: "2026",
        povContext:
          "The best granita we ever had — smooth, layered, served with warm brioche on the side.",
        translation:
          "Never had a granita this good — silky smooth, with layers of flavor. Paired with a warm brioche, it was the most wonderful breakfast in Sicily.",
      },
      {
        originalText:
          "我们在syracuse住了一个能够看到大海的酒店房间，今天去取车，开始开车穿越南部",
        language: "Chinese",
        author: "Yueran's diary in Sicily",
        authorRole: "Contemporary traveler",
        year: "2026",
        povContext:
          "A room by the sea in Syracuse, the beginning of a road trip south through the island.",
        translation:
          "We stayed in a room overlooking the sea in Syracuse. Today we picked up the car and started driving across the south.",
      },
      {
        originalText:
          "美丽的taormina，四月的空气中都是橙花的香气，我们坐在院子里面对着mount etna，山顶还有积雪",
        language: "Chinese",
        author: "Yueran's diary in Sicily",
        authorRole: "Contemporary traveler",
        year: "2026",
        povContext:
          "A courtyard in Taormina, orange blossoms and a snow-capped volcano.",
        translation:
          "Beautiful Taormina — the April air was filled with the scent of orange blossoms. We sat in the courtyard facing Mount Etna, its peak still capped with snow.",
      },
      {
        originalText:
          "公路旅行一路有弯弯曲曲的海岸线和狭窄的街道，开车心惊胆战，两道的公路经常要开出三道",
        language: "Chinese",
        author: "Yueran's diary in Sicily",
        authorRole: "Contemporary traveler",
        year: "2026",
        povContext:
          "Winding coastal roads, narrow streets, and white-knuckle driving.",
        translation:
          "The road trip was all winding coastline and narrow streets. White-knuckle driving — two-lane roads constantly driven as three.",
      },
      {
        originalText:
          "下午回来在民宿看完天堂电影院，窗外日落了，和huilin在阳台上看到远方夕阳下的希腊神庙，一瞬间有不真实感",
        language: "Chinese",
        author: "Yueran's diary in Sicily",
        authorRole: "Contemporary traveler",
        year: "2026",
        povContext:
          "Cinema Paradiso on the screen, Greek temples in the sunset outside the window.",
        translation:
          "Back at the guesthouse we finished watching Cinema Paradiso. Outside, the sun was setting. Huilin and I stood on the balcony and saw the Greek temples glowing in the distance. For a moment it felt unreal.",
      },
      {
        originalText:
          "街上春游的意大利小朋友会用中文给我们打招呼",
        language: "Chinese",
        author: "Yueran's diary in Sicily",
        authorRole: "Contemporary traveler",
        year: "2026",
        povContext:
          "Italian schoolchildren on a field trip, surprising us with a greeting in Chinese.",
        translation:
          "Italian kids on a school trip greeted us in Chinese on the street.",
      },
    ],
  },
];

// Total eras: 6
// Each era has exactly 3 writings
// Hour hand completes one revolution = 6 eras (each era = 2 hours on a 12h clock)
// Minute hand completes one revolution = 1 landmark per era (decorative, shows current era's landmark)
// Second hand completes one revolution = cycles through writings (each writing = 20 seconds)
