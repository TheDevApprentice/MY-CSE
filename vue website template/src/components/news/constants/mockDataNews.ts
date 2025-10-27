export const mockDataNews = [
  {
    id: 1,
    title: "Nouveaux tarifs préférentiels pour les loisirs",
    excerpt:
      "Découvrez nos nouveaux tarifs négociés pour les parcs d'attractions, cinémas et activités culturelles.",
    content:
      "Nous sommes ravis de vous annoncer que nous avons négocié de nouveaux tarifs préférentiels pour de nombreuses activités de loisirs. Profitez de réductions allant jusqu'à 30% sur les entrées de parcs d'attractions, cinémas, musées et spectacles dans toute la France. Ces avantages sont valables pour vous et votre famille toute l'année 2025. Connectez-vous à votre espace CE pour en profiter !",
    date: new Date("2025-06-01"),
    category: "Avantages",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    isUrgent: false,
    cta: {
      label: "Voir les offres",
      url: "#avantages",
    },
  },
  {
    id: 2,
    title: "Assemblée Générale du CE - 15 Juin 2025",
    excerpt:
      "Participez à notre prochaine assemblée générale pour échanger sur les projets à venir.",
    content:
      "Notre prochaine Assemblée Générale se tiendra le 15 Juin 2025 à 14h dans l'amphithéâtre du siège social. À l'ordre du jour : bilan des actions 2024, présentation du budget 2025, élection des nouveaux membres du bureau et échanges sur les projets à venir. Votre présence est importante ! Inscription obligatoire avant le 10 juin.",
    date: new Date("2025-06-10"),
    category: "Événements",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80",
    isUrgent: true,
    additionalContent:
      "Lieu : Siège social - Amphithéâtre principal\nDate : 15 juin 2025 à 14h\nInscription obligatoire avant le 10 juin",
    cta: {
      label: "S'inscrire",
      url: "#inscription-ag",
    },
  },
  {
    id: 3,
    title: "Atelier bien-être au travail",
    excerpt:
      "Apprenez des techniques de gestion du stress et d'ergonomie pour améliorer votre bien-être au quotidien.",
    content:
      "Notre atelier bien-être revient avec une nouvelle formule enrichie. Au programme : techniques de respiration, exercices d'étirement au bureau, conseils en ergonomie posturale et ateliers de gestion du stress. Animé par des professionnels de la santé au travail, cet atelier de 2h est limité à 15 participants. Trois sessions disponibles : 20 juin, 27 juin et 4 juillet.",
    date: new Date("2025-05-28"),
    category: "Formation",
    image:
      "https://images.unsplash.com/photo-1506126613408-07ca6979470d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1399&q=80",
    isUrgent: false,
    additionalContent:
      "Durée : 2h\nLieu : Salle de formation RDC\nGroupes de 15 personnes maximum\nInscription dans la limite des places disponibles",
    cta: {
      label: "Réserver ma place",
      url: "#inscription-atelier",
    },
  },
  {
    id: 4,
    title: "Nouveaux partenariats vacances été 2025",
    excerpt:
      "Profitez de réductions exceptionnelles sur vos réservations de vacances avec nos nouveaux partenaires.",
    content:
      "C'est officiel ! Nous avons conclu des partenariats exclusifs avec plusieurs acteurs majeurs du tourisme pour vos vacances d'été. Bénéficiez de -15% sur les locations de vacances en France, -20% sur les billets de train et des offres spéciales sur les activités nautiques. Ces avantages sont cumulables avec les offres promotionnelles de nos partenaires. Découvrez toutes les offres sur notre portail CE !",
    date: new Date("2025-05-25"),
    category: "Avantages",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    isUrgent: false,
  },
  {
    id: 5,
    title: "Bilan des actions sociales 2024",
    excerpt:
      "Retour sur les actions menées par le CE en 2024 et perspectives pour l'année à venir.",
    content:
      "L'année 2024 a été riche en actions sociales pour notre comité d'entreprise. Grâce à votre participation, nous avons pu organiser 12 sorties culturelles, 8 ateliers bien-être, 3 sessions de formation et distribuer 150 chèques vacances. Le montant total des aides sociales attribuées s'élève à 45 000€. Pour 2025, nous prévoyons d'élargir nos actions avec de nouveaux ateliers et des partenariats renforcés. Votre avis nous intéresse pour orienter nos futures actions !",
    date: new Date("2025-05-20"),
    category: "Vie du CE",
    image:
      "https://images.unsplash.com/photo-1522071820081-009c5fdc90a4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    isUrgent: false,
  },
  {
    id: 6,
    title: "Formation premiers secours - Session de Juillet",
    excerpt:
      "Inscrivez-vous dès maintenant à la prochaine session de formation aux premiers secours.",
    content:
      "Une formation PSC1 (Prévention et Secours Civiques de niveau 1) est organisée les 10 et 11 juillet 2025. Cette formation de 7 heures vous permettra d'acquérir les gestes qui sauvent : protéger la victime, alerter les secours, réagir face à un étouffement, une hémorragie, un malaise, etc. La formation est gratuite pour les salariés et limitée à 10 participants. Inscription par ordre d'arrivée.",
    date: new Date("2025-05-15"),
    category: "Formation",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    isUrgent: false,
    additionalContent:
      "Durée : 7h (2 x 3h30)\nLieu : Salle de formation RDC\nFormation gratuite - 10 places disponibles",
    cta: {
      label: "S'inscrire à la formation",
      url: "#inscription-formation",
    },
  },
  {
    id: 7,
    title: "Nouveau service : billetterie en ligne",
    excerpt:
      "Réservez désormais vos places de spectacles et événements directement depuis votre espace CE.",
    content:
      "Notre nouveau service de billetterie en ligne est désormais disponible ! Accédez à des centaines de spectacles, concerts et événements sportifs à des tarifs préférentiels. Le paiement est sécurisé et les billets sont envoyés par email. Profitez également de notre service de remboursement jusqu'à 48h avant l'événement en cas d'empêchement. Connectez-vous à votre espace pour découvrir les offres du moment !",
    date: new Date("2025-05-10"),
    category: "Nouveautés",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    isUrgent: false,
    cta: {
      label: "Accéder à la billetterie",
      url: "#billetterie",
    },
  },
  {
    id: 8,
    title: "Bourse aux vêtements de printemps",
    excerpt:
      "Vide-dressing géant organisé par le CE le samedi 7 juin dans les locaux de l'entreprise.",
    content:
      "Le CE organise une grande bourse aux vêtements de printemps le samedi 7 juin de 9h à 17h dans le hall d'accueil. Vous souhaitez vendre des vêtements, chaussures ou accessoires ? Réservez votre stand (5€ la table, reversés à une association) ou venez chiner des bonnes affaires ! Buvette et petite restauration sur place. Inscription obligatoire pour les vendeurs avant le 1er juin.",
    date: new Date("2025-05-05"),
    category: "Événements",
    image:
      "https://images.unsplash.com/photo-1445205170230-0410b4b17a3f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80",
    isUrgent: false,
    additionalContent:
      "Date : Samedi 7 juin 2025 de 9h à 17h\nLieu : Hall d'accueil du siège social\nEntrée gratuite - 5€ la table pour les vendeurs",
    cta: {
      label: "Réserver une table",
      url: "#inscription-bourse",
    },
  },
  {
    id: 9,
    title: "Enquête satisfaction 2025",
    excerpt:
      "Donnez votre avis sur les actions du CE et aidez-nous à améliorer nos services.",
    content:
      "Votre avis compte ! Nous lançons notre enquête de satisfaction annuelle pour évaluer vos attentes et améliorer nos services. Ce questionnaire anonyme de 10 minutes nous permettra de mieux cerner vos besoins en termes d'activités, de réductions et d'avantages. Les résultats seront partagés en septembre et guideront nos actions pour 2025. Les 50 premiers participants recevront un bon d'achat de 10€ à utiliser sur notre plateforme de réductions.",
    date: new Date("2025-05-01"),
    category: "Sondage",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    isUrgent: true,
    cta: {
      label: "Répondre au sondage",
      url: "#sondage-2025",
    },
  },
  {
    id: 10,
    title: "Soirée d'été du personnel - 28 juin",
    excerpt:
      "Inscrivez-vous dès maintenant pour notre grande soirée d'été annuelle !",
    content:
      "Le comité d'entreprise a le plaisir de vous convier à la soirée d'été du personnel qui se tiendra le samedi 28 juin à partir de 19h au parc des Berges. Au programme : DJ, buffet gastronomique, bar à cocktails, animations et feux d'artifice. Les enfants sont les bienvenus avec un espace dédié et des animations prévues pour eux. Inscription obligatoire avant le 20 juin.",
    date: new Date("2025-04-28"),
    category: "Événements",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80",
    isUrgent: false,
    additionalContent:
      "Date : Samedi 28 juin 2025 à partir de 19h\nLieu : Parc des Berges\nTenue estivale élégante\nNavettes gratuites prévues depuis le siège social",
    cta: {
      label: "Réserver ma place",
      url: "#soiree-ete",
    },
  },
  {
    id: 11,
    title: "Nouveaux horaires de la salle de sport",
    excerpt:
      "La salle de sport du CE élargit ses horaires d'ouverture à partir du 1er juin.",
    content:
      "Pour répondre à vos besoins, la salle de sport du CE sera désormais ouverte du lundi au vendredi de 6h à 22h et le week-end de 8h à 20h. De nouveaux équipements ont également été installés : 2 nouveaux tapis de course, des vélos elliptiques dernière génération et une zone de musculation agrandie. N'oubliez pas que l'accès reste gratuit pour tous les salariés sur présentation de leur badge.",
    date: new Date("2025-04-25"),
    category: "Avantages",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    isUrgent: false,
  },
  {
    id: 12,
    title: "Atelier cuisine healthy - Inscriptions ouvertes",
    excerpt:
      "Apprenez à cuisiner des repas sains et équilibrés avec notre chef nutritionniste.",
    content:
      "Le CE organise un atelier cuisine healthy le 15 juin de 10h à 13h. Au menu : préparation de 3 recettes équilibrées, conseils nutrition et dégustation. Les participants repartiront avec leurs préparations et un livret de recettes. Matériel et ingrédients fournis. Atelier limité à 12 personnes. Inscription obligatoire avant le 10 juin.",
    date: new Date("2025-04-20"),
    category: "Formation",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1453&q=80",
    isUrgent: false,
    additionalContent:
      "Date : Dimanche 15 juin 2025 de 10h à 13h\nLieu : Cuisine pédagogique du CE\nTarif : 15€ (matériel et ingrédients inclus)\n12 participants maximum",
    cta: {
      label: "S'inscrire à l'atelier",
      url: "#atelier-cuisine",
    },
  },
  {
    id: 13,
    title: "Réduction exceptionnelle sur les abonnements culturels",
    excerpt:
      "Profitez de -40% sur les abonnements aux théâtres et opéras partenaires.",
    content:
      "Le CE a négocié des réductions exceptionnelles sur les abonnements aux principales salles de spectacles parisiennes. Profitez de -40% sur les formules d'abonnement pour la saison 2025-2026. Au programme : théâtre, opéra, danse et spectacles musicaux. L'offre est valable jusqu'au 30 juin pour une utilisation tout au long de la saison prochaine. Connectez-vous à votre espace CE pour découvrir toutes les offres disponibles.",
    date: new Date("2025-04-15"),
    category: "Avantages",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    isUrgent: true,
    cta: {
      label: "Découvrir les offres",
      url: "#abonnements-culture",
    },
  },
  {
    id: 14,
    title: "Challenge sportif inter-entreprises",
    excerpt:
      "Inscrivez-vous au challenge sportif qui opposera notre entreprise à 5 autres grands groupes !",
    content:
      "Pour la première fois, notre entreprise participera au challenge sportif inter-entreprises le 29 juin prochain. Au programme : course à pied, VTT, natation, tir à l'arc et course d'orientation. Les inscriptions sont ouvertes à tous les salariés, quel que soit leur niveau sportif. Des entraînements collectifs seront organisés chaque semaine jusqu'à l'événement. Les 3 premiers de chaque épreuve se verront offrir des bons d'achat sport d'une valeur de 100€ à 300€.",
    date: new Date("2025-04-10"),
    category: "Événements",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    isUrgent: false,
    additionalContent:
      "Date : Dimanche 29 juin 2025\nLieu : Base de loisirs de Cergy-Pontoise\nInscriptions jusqu'au 15 juin\nMatériel fourni pour les épreuves",
    cta: {
      label: "S'inscrire au challenge",
      url: "#challenge-sportif",
    },
  },
  {
    id: 15,
    title: "Nouveau : prêt de matériel de sport",
    excerpt: "Empruntez du matériel de sport gratuitement auprès du CE !",
    content:
      "Le service prêt de matériel de sport est désormais opérationnel ! Vous pouvez désormais emprunter pour une durée maximale d'une semaine : raquettes de tennis, vélos, équipement de randonnée, matériel de fitness, etc. Le service est gratuit, seule une caution vous sera demandée. Rendez-vous à l'accueil du CE pour plus d'informations et pour consulter la liste complète du matériel disponible.",
    date: new Date("2025-04-05"),
    category: "Nouveautés",
    image:
      "https://images.unsplash.com/photo-1571019614242-cb01c0e043b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    isUrgent: false,
  },
  {
    id: 16,
    title: "Atelier gestion du stress - Session de juin",
    excerpt:
      "Apprenez à gérer votre stress au quotidien grâce à des techniques simples et efficaces.",
    content:
      "Le service prévention du stress au travail organise un atelier de gestion du stress le 12 juin de 14h à 17h. Cet atelier, animé par une sophrologue professionnelle, vous proposera des techniques de respiration, de relaxation et de gestion des émotions. Les places sont limitées à 15 participants. Inscription obligatoire avant le 5 juin.",
    date: new Date("2025-03-30"),
    category: "Formation",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e00?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1520&q=80",
    isUrgent: false,
    additionalContent:
      "Date : Jeudi 12 juin 2025 de 14h à 17h\nLieu : Salle de formation RDC\n15 participants maximum\nMatériel fourni",
    cta: {
      label: "S'inscrire à l'atelier",
      url: "#atelier-stress",
    },
  },
  {
    id: 17,
    title: "Réduction sur les abonnements de transport",
    excerpt:
      "Bénéficiez de -30% sur votre abonnement de transport en commun avec notre partenaire.",
    content:
      "Le CE a renouvelé son partenariat avec Transports & Co pour vous proposer une réduction de 30% sur tous les abonnements de transport en commun. Cette offre est valable pour les abonnements mensuels et annuels, sur présentation de votre badge d'entreprise. Pour en bénéficier, il vous suffit de vous rendre sur le site de notre partenaire et d'utiliser le code CE2025 lors de votre commande. Offre valable jusqu'au 31 décembre 2025.",
    date: new Date("2025-03-25"),
    category: "Avantages",
    image:
      "https://images.unsplash.com/photo-1506152983158-b4a74ae01cbf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1473&q=80",
    isUrgent: false,
    cta: {
      label: "En savoir plus",
      url: "#reduction-transport",
    },
  },
  {
    id: 18,
    title: "Sortie famille : Parc Astérix - 6 juillet",
    excerpt:
      "Venez passer une journée inoubliable en famille au Parc Astérix !",
    content:
      "Le CE organise une sortie familiale au Parc Astérix le dimanche 6 juillet. Au programme : attractions pour tous les âges, spectacles et rencontres avec les personnages. Le prix comprend le transport en car climatisé au départ du siège social, l'entrée au parc et un repas. Tarif préférentiel de 35€ pour les adultes et 25€ pour les enfants de moins de 12 ans. Inscriptions ouvertes jusqu'au 20 juin dans la limite des places disponibles.",
    date: new Date("2025-03-20"),
    category: "Sorties",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    isUrgent: false,
    additionalContent:
      "Date : Dimanche 6 juillet 2025\nDépart : 8h depuis le siège social\nRetour prévu vers 22h\nPrévoir un pique-nique pour le soir",
    cta: {
      label: "Réserver ma place",
      url: "#parc-asterix",
    },
  },
];
