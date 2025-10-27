import { defineAsyncComponent } from "vue";
import { ref } from "vue";

// Import des icônes
const TicketIcon = defineAsyncComponent(() => import("@icons/TicketIcon.vue"));
const GiftIcon = defineAsyncComponent(() => import("@icons/GiftIcon.vue"));
const CalendarIcon = defineAsyncComponent(
  () => import("@icons/CalendarIcon.vue")
);
const HeartIcon = defineAsyncComponent(() => import("@icons/HeartIcon.vue"));
const BuildingOfficeIcon = defineAsyncComponent(
  () => import("@icons/BuildingOfficeIcon.vue")
);

// Types améliorés
type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  price: number;
  discountPrice: number;
  image: string;
  category: string;
  tags: string[]; // Ajout des tags pour un filtrage plus fin
  eventType: string; // Type spécifique d'événement
};

type GiftOffer = {
  id: number;
  brand: string;
  discount: string;
  minAmount: number;
  categories: string[];
  tags: string[]; // Tags pour filtrage
  sector: string; // Secteur d'activité
};

type ServiceContent = {
  events?: Event[] | null;
  offers?: GiftOffer[] | null;
  filterCategories?: string[]; // Catégories de filtres disponibles pour ce service
};

// Données des événements pour la billetterie avec tags améliorés
const ticketEvents: Event[] = [
  {
    id: 1,
    title: "Festival d'Été",
    date: "15/07/2023",
    location: "Parc des Expositions, Paris",
    price: 89,
    discountPrice: 59,
    image: "/images/events/festival-ete.jpg",
    category: "Concert",
    eventType: "Festival",
    tags: ["Musique", "Festival", "Été", "Outdoor", "Pop-Rock"],
  },
  {
    id: 2,
    title: "Exposition Impressionniste",
    date: "22/08/2023",
    location: "Musée d'Orsay, Paris",
    price: 16,
    discountPrice: 12,
    image: "/images/events/expo-impressionniste.jpg",
    category: "Exposition",
    eventType: "Culture",
    tags: ["Art", "Peinture", "Culture", "Musée", "Histoire"],
  },
  {
    id: 3,
    title: "Comédie Musicale - Le Roi Lion",
    date: "05/09/2023",
    location: "Théâtre Mogador, Paris",
    price: 120,
    discountPrice: 85,
    image: "/images/events/roi-lion.jpg",
    category: "Théâtre",
    eventType: "Spectacle Vivant",
    tags: ["Théâtre", "Comédie Musicale", "Famille", "Disney", "Spectacle"],
  },
  {
    id: 4,
    title: "Match de Football - PSG vs OM",
    date: "12/09/2023",
    location: "Parc des Princes, Paris",
    price: 150,
    discountPrice: 110,
    image: "/images/events/psg-om.jpg",
    category: "Sport",
    eventType: "Sport",
    tags: ["Football", "Sport", "Ligue 1", "PSG", "OM"],
  },
  {
    id: 5,
    title: "Concert Jazz au New Morning",
    date: "20/09/2023",
    location: "New Morning, Paris",
    price: 45,
    discountPrice: 35,
    image: "/images/events/jazz-concert.jpg",
    category: "Concert",
    eventType: "Concert",
    tags: ["Jazz", "Musique", "Concert", "Soirée", "Live"],
  },
  {
    id: 6,
    title: "Opéra - Carmen",
    date: "28/09/2023",
    location: "Opéra Bastille, Paris",
    price: 200,
    discountPrice: 150,
    image: "/images/events/carmen-opera.jpg",
    category: "Opéra",
    eventType: "Spectacle Vivant",
    tags: ["Opéra", "Classique", "Bizet", "Chant", "Spectacle"],
  },
];

// Données pour les chèques cadeaux avec tags améliorés
const giftOffers: GiftOffer[] = [
  {
    id: 1,
    brand: "FNAC",
    discount: "-20%",
    minAmount: 30,
    categories: ["Culture", "High-Tech", "Loisirs"],
    sector: "Retail",
    tags: ["Livres", "Musique", "Électronique", "Jeux", "Culture"],
  },
  {
    id: 2,
    brand: "Sephora",
    discount: "-15%",
    minAmount: 50,
    categories: ["Beauté", "Parfumerie"],
    sector: "Beauté",
    tags: ["Maquillage", "Parfum", "Soins", "Beauté", "Cosmétiques"],
  },
  {
    id: 3,
    brand: "Decathlon",
    discount: "-25%",
    minAmount: 100,
    categories: ["Sport", "Loisirs"],
    sector: "Sport",
    tags: ["Sport", "Outdoor", "Fitness", "Équipement", "Vêtements"],
  },
  {
    id: 4,
    brand: "Amazon",
    discount: "-10%",
    minAmount: 75,
    categories: ["High-Tech", "Maison", "Mode"],
    sector: "E-commerce",
    tags: ["Électronique", "Livraison", "Variété", "En ligne"],
  },
  {
    id: 5,
    brand: "Zara",
    discount: "-30%",
    minAmount: 80,
    categories: ["Mode", "Vêtements"],
    sector: "Mode",
    tags: ["Mode", "Vêtements", "Tendance", "Style", "Fashion"],
  },
];

// Configuration des filtres par service
const serviceFilterConfig: Record<
  number,
  {
    filterTypes: Array<{
      key: string;
      label: string;
      options: string[];
    }>;
  }
> = {
  1: {
    // Billetterie
    filterTypes: [
      {
        key: "eventType",
        label: "Type d'événement",
        options: [
          "Concert",
          "Festival",
          "Sport",
          "Spectacle Vivant",
          "Culture",
          "Opéra",
        ],
      },
      {
        key: "category",
        label: "Catégorie",
        options: ["Concert", "Théâtre", "Sport", "Exposition", "Opéra"],
      },
      {
        key: "tags",
        label: "Tags",
        options: [
          "Musique",
          "Art",
          "Football",
          "Jazz",
          "Classique",
          "Famille",
          "Outdoor",
        ],
      },
    ],
  },
  2: {
    // Chèques cadeaux
    filterTypes: [
      {
        key: "sector",
        label: "Secteur",
        options: ["Retail", "Beauté", "Sport", "E-commerce", "Mode"],
      },
      {
        key: "categories",
        label: "Catégories",
        options: [
          "Culture",
          "High-Tech",
          "Beauté",
          "Sport",
          "Mode",
          "Maison",
          "Loisirs",
        ],
      },
      {
        key: "tags",
        label: "Spécialités",
        options: ["Électronique", "Cosmétiques", "Fashion", "Outdoor", "Soins"],
      },
    ],
  },
};

// Données des services avec configuration des filtres
export const servicesData: Array<{
  popular: boolean;
  id: number;
  name: string;
  icon: any;
  category: string;
  description: string;
  fullDescription: string;
  details: string[];
  gradient: string;
  content?: ServiceContent;
}> = [
  {
    id: 1,
    popular: true,
    name: "Billetterie & Spectacles",
    icon: TicketIcon,
    category: "Culture & Loisirs",
    description:
      "Accédez à des places de spectacles, concerts et événements sportifs à des tarifs préférentiels.",
    fullDescription:
      "Notre service de billetterie exclusive vous permet d'accéder à des places de spectacles, concerts, pièces de théâtre et événements sportifs à des tarifs négociés spécialement pour vous. Profitez de réductions allant jusqu'à -50% sur le prix public et bénéficiez d'un accès prioritaire aux avant-premières et aux ventes exclusives.",
    details: [
      "Jusqu'à -50% sur le prix public",
      "Réservation simple et sécurisée",
      "Billets électroniques ou retrait sur place",
      "Accès aux avant-premières",
      "Paiement en plusieurs fois sans frais",
      "Service client dédié",
    ],
    gradient: "bg-gradient-to-r from-purple-600 to-indigo-600",
    content: {
      events: ticketEvents,
      filterCategories: ["eventType", "category", "tags"],
    },
  },
  {
    id: 2,
    popular: true,
    name: "Chèques Cadeaux",
    icon: GiftIcon,
    category: "Shopping",
    description:
      "Bénéficiez de réductions sur une large sélection de chèques cadeaux pour tous vos achats.",
    fullDescription:
      "Notre sélection de chèques cadeaux vous permet d'offrir ou de vous faire plaisir avec des centaines d'enseignes partenaires. Que ce soit pour des achats en ligne ou en magasin, des loisirs, des voyages ou des restaurants, trouvez le cadeau idéal pour toutes les occasions. Les chèques sont disponibles en montant libre et sont valables un an.",
    details: [
      "Plus de 200 enseignes partenaires",
      "Montant libre à partir de 10€",
      "Livraison express disponible",
      "Valable 1 an",
      "Utilisation en ligne et en magasin",
      "Cadeau idéal pour toutes les occasions",
    ],
    gradient: "bg-gradient-to-r from-pink-500 to-rose-500",
    content: {
      offers: giftOffers,
      filterCategories: ["sector", "categories", "tags"],
    },
  },
  // ... autres services restent identiques
  {
    id: 3,
    popular: true,
    name: "Activités Culturelles & Événements",
    icon: CalendarIcon,
    category: "Culture",
    description:
      "Participez à des sorties culturelles et des visites exclusives réservées aux membres du CE.",
    fullDescription:
      "Découvrez notre programme d'activités culturelles spécialement conçu pour les membres du comité d'entreprise. Visites guidées de musées, expositions, ateliers créatifs, rencontres avec des artistes... Des expériences uniques pour enrichir votre vie culturelle à des tarifs préférentiels. Nos activités sont accessibles à tous, que vous soyez novice ou passionné.",
    details: [
      "Visites guidées exclusives",
      "Ateliers créatifs",
      "Rencontres avec des artistes",
      "Tarifs réduits jusqu'à -40%",
      "Groupes limités pour plus de confort",
      "Accès à des événements privés",
    ],
    gradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
    content: {
      events: null,
    },
  },
  {
    id: 4,
    popular: true,
    name: "Bien-être au Travail",
    icon: HeartIcon,
    category: "Santé & Bien-être",
    description:
      "Découvrez nos offres de bien-être et de prévention santé pour vous et vos proches.",
    fullDescription:
      "Prenez soin de vous avec nos offres dédiées au bien-être et à la santé. Massages relaxants, séances de sophrologie, ateliers de gestion du stress, bilans de santé... Des professionnels qualifiés vous accompagnent pour améliorer votre qualité de vie au travail et à la maison. Ces prestations sont accessibles sur votre lieu de travail ou en ligne, selon vos préférences.",
    details: [
      "Massages en entreprise",
      "Ateliers de gestion du stress",
      "Bilans de santé",
      "Séances de sophrologie",
      "Cours de yoga et méditation",
      "Conseils en nutrition",
    ],
    gradient: "bg-gradient-to-r from-red-500 to-pink-500",
    content: {
      events: null,
    },
  },
  {
    id: 5,
    popular: true,
    name: "Vacances & Loisirs",
    icon: BuildingOfficeIcon,
    category: "Voyages",
    description:
      "Profitez de réductions sur les séjours, hôtels et locations de vacances.",
    fullDescription:
      "Partez en vacances l'esprit léger grâce à nos offres exclusives sur les séjours, hôtels, locations de vacances et activités de loisirs. Que vous préfériez la montagne, la mer ou la campagne, nos partenaires vous proposent des réductions allant jusqu'à -30% sur vos réservations. Profitez également de nos offres flash tout au long de l'année pour des escapades improvisées.",
    details: [
      "Jusqu'à -30% sur les hébergements",
      "Activités de loisirs à tarifs réduits",
      "Réservation en ligne sécurisée",
      "Offres flash exclusives",
      "Destinations en France et à l'étranger",
      "Service client 7j/7",
    ],
    gradient: "bg-gradient-to-r from-yellow-500 to-amber-500",
    content: {
      events: null,
    },
  },
  {
    id: 6,
    popular: true,
    name: "Solidarité & Entraide",
    icon: HeartIcon,
    category: "Shopping",
    description:
      "Bénéficiez de réductions exclusives chez nos partenaires e-commerce et boutiques.",
    fullDescription:
      "Faites des économies sur vos achats du quotidien grâce à nos partenariats exclusifs avec les plus grandes enseignes. High-tech, mode, équipement de la maison, loisirs créatifs... Profitez de réductions allant jusqu'à -40% sur une large sélection de produits. Nos offres sont régulièrement mises à jour pour vous proposer les meilleurs plans toute l'année.",
    details: [
      "Jusqu'à -40% sur vos achats",
      "Codes promo exclusifs",
      "Cashback sur vos commandes",
      "Livraison offerte dès 50€ d'achat",
      "Garantie satisfait ou remboursé",
      "Service client dédié",
    ],
    gradient: "bg-gradient-to-r from-green-500 to-emerald-500",
    content: {
      events: null,
    },
  },
  {
    id: 7,
    popular: true,
    name: "Activités Sportives",
    icon: HeartIcon,
    category: "Sport",
    description:
      "Pratiquez des activités sportives à tarifs réduits grâce à nos partenariats.",
    fullDescription:
      "Gardez la forme avec nos offres spéciales sur les activités sportives. Accédez à plus de 1000 salles de sport en France, participez à des cours collectifs, des stages ou des événements sportifs à des tarifs préférentiels. Que vous soyez débutant ou sportif confirmé, nos partenaires s'adaptent à votre niveau et à vos objectifs pour vous accompagner dans votre pratique sportive.",
    details: [
      "Accès à +1000 salles de sport",
      "-30% en moyenne sur les abonnements",
      "Cours d'essai gratuit",
      "Activités pour tous les niveaux",
      "Coaching personnalisé disponible",
      "Équipements haut de gamme",
    ],
    gradient: "bg-gradient-to-r from-indigo-500 to-blue-500",
    content: {
      events: null,
    },
  },
];

// Export de la configuration des filtres
export { serviceFilterConfig };
