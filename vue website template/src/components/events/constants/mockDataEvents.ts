import { Event } from "../composables";

export const mockDataEvents : Event[] = [
  {
    id: 1,
    title: "Sortie Parc d'Attractions",
    description:
      "Une journée magique en famille à Disneyland Paris avec transport organisé et repas inclus.",
    date: new Date(2025, 5, 15),
    time: "08:00 - 20:00",
    location: "Disneyland Paris",
    category: "sortie",
    participants: 45,
    maxParticipants: 60,
    image:
      "https://www.more4floors.com/wp-content/uploads/2021/01/FRENCH-SIGNS-CAD-241.jpg",
    price: 75,
    participantsList: [
      {
        id: 1,
        name: "Marie Dupont",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=40&h=40&fit=crop&crop=face",
      },
      {
        id: 2,
        name: "Jean Martin",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      },
      {
        id: 3,
        name: "Sophie Bernard",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      },
    ],
  },
  {
    id: 2,
    title: "Visite Musée de Grenoble",
    description:
      "Découverte des collections d'art moderne et contemporain du musée de Grenoble.",
    date: new Date(2025, 5, 18),
    time: "14:00 - 17:00",
    location: "Musée de Grenoble",
    category: "culture",
    participants: 25,
    maxParticipants: 30,
    image:
      "https://www.more4floors.com/wp-content/uploads/2021/01/FRENCH-SIGNS-CAD-241.jpg",
    price: 15,
  },
  {
    id: 3,
    title: "Tournoi de Tennis",
    description:
      "Tournoi de tennis amical entre collègues, tous niveaux acceptés.",
    date: new Date(2025, 5, 22),
    time: "09:00 - 17:00",
    location: "Club de Tennis Municipal",
    category: "sport",
    participants: 16,
    maxParticipants: 32,
    image:
      "https://www.more4floors.com/wp-content/uploads/2021/01/FRENCH-SIGNS-CAD-241.jpg",
  },
  {
    id: 4,
    title: "Formation Premiers Secours",
    description:
      "Formation aux gestes de premiers secours dispensée par la Croix-Rouge.",
    date: new Date(2025, 5, 25),
    time: "09:00 - 17:00",
    location: "Salle de formation CE",
    category: "formation",
    participants: 12,
    maxParticipants: 15,
    image:
      "https://www.more4floors.com/wp-content/uploads/2021/01/FRENCH-SIGNS-CAD-241.jpg",
  },
  {
    id: 5,
    title: "Barbecue d'été",
    description:
      "Grand barbecue annuel du CE avec animations et jeux pour toute la famille.",
    date: new Date(2025, 6, 12),
    time: "12:00 - 18:00",
    location: "Parc de l'entreprise",
    category: "social",
    participants: 85,
    maxParticipants: 120,
    image:
      "https://www.more4floors.com/wp-content/uploads/2021/01/FRENCH-SIGNS-CAD-241.jpg",
  },
  {
    id: 6,
    title: "Soirée théâtre",
    description:
      'Représentation théâtrale "Le Malade Imaginaire" au Théâtre Municipal.',
    date: new Date(2025, 6, 8),
    time: "20:30 - 22:30",
    location: "Théâtre Municipal",
    category: "culture",
    participants: 35,
    maxParticipants: 40,
    image:
      "https://www.more4floors.com/wp-content/uploads/2021/01/FRENCH-SIGNS-CAD-241.jpg",
    price: 25,
  },
];
