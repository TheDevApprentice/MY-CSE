// components/dashboards/SASS/admin/constants/mockDataAdmin.ts

import { StatsCardConfig } from "@/components/common/ui/charts";
import { TableItem } from "@/components/common/ui/tables";
import type {
  AdminUser,
  AdminNotification,
  AdminNotificationSettings,
} from "@/components/dashboards/SASS/admin/types";
import { User } from "@/services/api";

export const mockAdminCurrentUser: AdminUser = {
  id: "admin-1",
  name: "Marie Dubois",
  email: "marie.dubois@admin.com",
  roles: ["Super Administrateur"],
  permissions: [],
  // status: "Active",
  lastLogin: new Date(),
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
};

// Paramètres de notification
export const mockAdminNotificationSettings: AdminNotificationSettings[] = [
  {
    key: "email",
    label: "Notifications par email",
    description: "Recevoir des notifications par email",
    enabled: true,
  },
  {
    key: "updates",
    label: "Mises à jour du système",
    description: "Être informé des mises à jour importantes",
    enabled: true,
  },
  {
    key: "newsletter",
    label: "Newsletter",
    description: "Recevoir notre newsletter mensuelle",
    enabled: false,
  },
  {
    key: "marketing",
    label: "Offres promotionnelles",
    description: "Recevoir des offres spéciales et promotions",
    enabled: false,
  },
];

export const mockAdminNotifications: AdminNotification[] = [
  {
    id: "1",
    title: "Nouvel utilisateur inscrit",
    message: "Jean Martin vient de créer un compte",
    type: "info",
    time: new Date(),
    read: false,
  },
  {
    id: "2",
    title: "Mise à jour système",
    message: "La mise à jour v2.1.0 est disponible",
    type: "success",
    time: new Date(Date.now() - 1800000),
    read: false,
  },
  {
    id: "3",
    title: "Alerte sécurité",
    message: "Tentative de connexion suspecte détectée",
    type: "warning",
    time: new Date(Date.now() - 3600000),
    read: true,
  },
];

// Données pour AnalyticsView
export const mockAnalyticsViewStatsCards: StatsCardConfig[] = [
  {
    title: "Visiteurs",
    value: 2847,
    change: {
      value: 12,
      type: "increase" as const,
      period: "vs mois dernier",
    },
    chart: {},
    color: "green" as const,
    iconType: "users" as const,
    animated: true,
  },
  {
    title: "Taux de rebond",
    value: "32.5",
    chart: {},
    suffix: "%",
    change: {
      value: 2.4,
      type: "decrease" as const,
      period: "vs mois dernier",
    },
    color: "orange" as const,
    iconType: "analytics" as const,
    animated: true,
  },
  {
    title: "Durée moyenne",
    value: "4:32",
    chart: {},
    change: {
      value: 0.5,
      type: "increase" as const,
      period: "vs mois dernier",
    },
    color: "green" as const,
    iconType: "clock" as const,
    animated: true,
  },
  {
    title: "Pages/vues",
    value: 3.2,
    chart: {},
    change: {
      value: 0,
      type: "neutral" as const,
      period: "Stable",
    },
    color: "gray" as const,
    iconType: "document" as const,
    animated: true,
  },
];

export const mockAnalyticsViewTopPages: TableItem[] = [
  { page: "/accueil", visits: 1245, avgDuration: "2:45", bounceRate: "32%" },
  { page: "/produits", visits: 987, avgDuration: "3:12", bounceRate: "28%" },
  { page: "/contact", visits: 756, avgDuration: "1:45", bounceRate: "45%" },
  { page: "/blog", visits: 654, avgDuration: "4:32", bounceRate: "38%" },
  { page: "/a-propos", visits: 543, avgDuration: "2:10", bounceRate: "50%" },
];

export const mockAnalyticsViewLineChartData = [
  {
    label: "Visiteurs",
    data: [65, 59, 80, 81, 56, 55, 40, 65, 78, 90],
    borderColor: "#3B82F6",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  {
    label: "Pages vues",
    data: [28, 48, 40, 19, 86, 27, 90, 45, 60, 75],
    borderColor: "#10B981",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
];

export const mockAnalyticsViewBarChartData = [
  {
    label: 'Appareils',
    data: [45, 40, 15],
    backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
  },
]
// Données pour BillingsView
export const mockBillingViewStats: StatsCardConfig[] = [
  {
    title: "Chiffre d'affaires",
    value: "2 450,00 €",
    chart: {},
    change: { value: 12, type: "increase" as const, period: "ce mois-ci" },
    color: "green" as const,
    iconType: "revenue" as const,
    animated: true,
  },
  {
    title: "Factures payées",
    value: "24",
    chart: {},
    change: { value: 3, type: "increase" as const, period: "en attente" },
    color: "yellow" as const,
    iconType: "receipt" as const,
    animated: true,
  },
  {
    title: "Factures impayées",
    value: "1",
    chart: {},
    change: { value: 0, type: "neutral" as const, period: "stable" },
    color: "gray" as const,
    iconType: "exclamation-circle" as const,
    animated: true,
  },
  {
    title: "Clients actifs",
    value: "18",
    chart: {},
    change: { value: 2, type: "increase" as const, period: "nouveaux ce mois" },
    color: "green" as const,
    iconType: "users" as const,
    animated: true,
  },
];

// Données pour la facturation
export const mockClients: TableItem[] = [
  {
    id: 1,
    civility: "M.",
    firstName: "John",
    lastName: "Doe",
    companyId: 1,
    companyName: "Acme Corp",
    email: "contact@acme.com",
    phones: ["123-456-7890"],
    address: {
      street: "123 Main St",
      zip: "12345",
      city: "Anytown",
      country: "USA",
    },
    facturationAddresse: {
      street: "123 Main St",
      zip: "12345",
      city: "Anytown",
      country: "USA",
    },
    businessSector: "Technology",
    companySize: "Small",
    status: "Actif",
    plan: "Pro",
    price: 49.99,
    users: 24,
    nextPayment: "15/07/2023",
    registrationDate: "15/01/2023",
    firstContactDate: new Date(Date.now() - 86400000),
    lastActivity: new Date(Date.now() - 86400000),
  },
  {
    id: 2,
    civility: "Mme",
    firstName: "Jane",
    lastName: "Doe",
    companyId: 2,
    companyName: "Entreprise B",
    email: "contact@entreprise-b.com",
    phones: ["123-456-7890"],
    address: {
      street: "8 Boulevard Voltaire",
      zip: "75011",
      city: "Paris",
      country: "France",
    },
    facturationAddresse: {
      street: "123 Main St",
      zip: "12345",
      city: "Anytown",
      country: "USA",
    },
    businessSector: "Technology",
    companySize: "Small",
    status: "Actif",
    plan: "Pro",
    price: 99.99,
    users: 24,
    nextPayment: "20/07/2023",
    registrationDate: "10/02/2023",
    firstContactDate: new Date(Date.now() - 86400000),
    lastActivity: new Date(Date.now() - 86400000),
  },
  {
    id: 3,
    civility: "Mme",
    firstName: "Sophie",
    lastName: "Doe",
    companyId: 3,
    companyName: "Startup C",
    email: "contact@startup-c.com",
    phones: ["123-456-7890"],
    address: {
      street: "32 Rue du Faubourg Saint-Honoré",
      zip: "75008",
      city: "Paris",
      country: "France",
    },
    facturationAddresse: {
      street: "123 Main St",
      zip: "12345",
      city: "Anytown",
      country: "USA",
    },
    businessSector: "Technology",
    companySize: "Small",
    status: "En retard",
    plan: "Standard",
    price: 29.99,
    users: 24,
    nextPayment: "01/08/2023",
    registrationDate: "05/03/2023",
    lastActivity: new Date(Date.now() - 86400000),
    firstContactDate: new Date(Date.now() - 86400000),
  },
  {
    id: 4,
    civility: "M.",
    firstName: "Alice",
    lastName: "Johnson",
    companyId: 4,
    companyName: "Example Ltd",
    email: "hello@example.com",
    phones: ["901-234-5678"],
    address: {
      street: "321 Pine St",
      zip: "90123",
      city: "Thatown",
      country: "Australia",
    },
    facturationAddresse: {
      street: "123 Main St",
      zip: "12345",
      city: "Anytown",
      country: "USA",
    },
    businessSector: "Healthcare",
    companySize: "Small",
    status: "Actif",
    plan: "Pro",
    users: 42,
    nextPayment: "15/07/2023",
    registrationDate: "15/01/2023",
    firstContactDate: new Date(Date.now() - 432000000),
    lastActivity: new Date(Date.now() - 432000000),
  },
  {
    id: 5,
    civility: "M.",
    firstName: "Mike",
    lastName: "Williams",
    companyId: 5,
    companyName: "Sample Inc",
    email: "contact@sample.com",
    phones: ["111-222-3333"],
    address: {
      street: "444 Cedar St",
      zip: "11111",
      city: "Thisotherown",
      country: "Germany",
    },
    facturationAddresse: {
      street: "123 Main St",
      zip: "12345",
      city: "Anytown",
      country: "USA",
    },
    businessSector: "Retail",
    companySize: "Medium",
    status: "Inactif",
    plan: "Standard",
    users: 8,
    nextPayment: "15/07/2023",
    registrationDate: "15/01/2023",
    firstContactDate: new Date(Date.now() - 604800000),
    lastActivity: new Date(Date.now() - 604800000),
  },
];
export const mockCompanies = [
  {
    id: 1,
    name: "Tech Solutions SARL",
    clientId: 1,
    address: "45 Avenue des Champs-Élysées",
    zip: "75008",
    city: "Paris",
    siret: "852 369 147 00025",
    vat: "FR75852369147",
    phone: "01 45 62 78 95",
    email: "contact@techsolutions.fr",
  },
  {
    id: 2,
    name: "Tech Solutions SARL",
    clientId: 2,
    address: "45 Avenue des Champs-Élysées",
    zip: "75008",
    city: "Paris",
    siret: "852 369 147 00025",
    vat: "FR75852369147",
    phone: "01 45 62 78 95",
    email: "contact@techsolutions.fr",
  },
  {
    id: 3,
    name: "Tech Solutions SARL",
    clientId: 3,
    address: "45 Avenue des Champs-Élysées",
    zip: "75008",
    city: "Paris",
    siret: "852 369 147 00025",
    vat: "FR75852369147",
    phone: "01 45 62 78 95",
    email: "contact@techsolutions.fr",
  },
  {
    id: 4,
    name: "Tech Solutions SARL",
    clientId: 4,
    address: "45 Avenue des Champs-Élysées",
    zip: "75008",
    city: "Paris",
    siret: "852 369 147 00025",
    vat: "FR75852369147",
    phone: "01 45 62 78 95",
    email: "contact@techsolutions.fr",
  },
  {
    id: 5,
    name: "Tech Solutions SARL",
    clientId: 5,
    address: "45 Avenue des Champs-Élysées",
    zip: "75008",
    city: "Paris",
    siret: "852 369 147 00025",
    vat: "FR75852369147",
    phone: "01 45 62 78 95",
    email: "contact@techsolutions.fr",
  },
];

export const mockInvoices = [
  {
    id: 1,
    companyId: 1,
    date: "15/06/2023",
    dueDate: "30/06/2023",
    clientId: 1,
    number: "INV-2023-06-001",
    amount: "49,99",
    amountHT: "41,66",
    tax: "8,33",
    status: "Payée",
    paymentDate: "20/06/2023",
    items: [
      {
        description: "Abonnement PRO - Juin 2023",
        amountHT: "41,66",
        unitPrice: 49.99,
        quantity: 1,
      },
    ],
  },
  {
    id: 2,
    companyId: 1,
    date: "15/05/2023",
    dueDate: "30/05/2023",
    clientId: 2,
    number: "INV-2023-05-001",
    amount: "99,99",
    amountHT: "83,33",
    tax: "16,66",
    status: "Payée",
    paymentDate: "25/05/2023",
    items: [
      {
        description: "Abonnement ENTERPRISE - Mai 2023",
        amountHT: "83,33",
        unitPrice: 99.99,
        quantity: 1,
      },
    ],
  },
  {
    id: 3,
    companyId: 2,
    date: "15/04/2023",
    dueDate: "30/04/2023",
    clientId: 3,
    number: "INV-2023-04-001",
    amount: "29,99",
    amountHT: "24,99",
    tax: "5,00",
    status: "En retard",
    paymentDate: null,
    items: [
      {
        description: "Abonnement STARTER - Avril 2023",
        amountHT: "24,99",
        unitPrice: 29.99,
        quantity: 1,
      },
    ],
  },
  {
    id: 4,
    companyId: 5,
    date: "10/06/2023",
    dueDate: "25/06/2023",
    clientId: 3,
    number: "INV-2023-06-004",
    amount: "29,99",
    amountHT: "24,99",
    tax: "5,00",
    status: "Non payée",
    paymentDate: null,
    items: [
      {
        description: "Abonnement STARTER - Juin 2023",
        amountHT: "24,99",
        unitPrice: 29.99,
        quantity: 1,
      },
    ],
  },
];

// Données pour HomeView
export const mockHomeViewStatsCards: StatsCardConfig[] = [
  {
    title: "Utilisateurs actifs",
    value: 2847,
    change: {
      value: 12,
      type: "increase" as const,
      period: "vs mois dernier",
    },
    color: "green" as const,
    chart: {
      type: "line" as const,
      data: [65, 59, 80, 81, 56, 55, 40, 65, 78, 90],
      color: "rgb(34, 197, 94)",
      showTooltip: true,
    },
    iconType: "users" as const,
    animated: true,
  },
  {
    title: "Revenus mensuels",
    value: 45672,
    prefix: "€",
    change: {
      value: 8,
      type: "increase" as const,
      period: "vs mois dernier",
    },
    color: "green" as const,
    chart: {
      type: "line" as const,
      data: [45, 52, 48, 61, 72, 58, 65, 70, 75, 78],
      color: "rgb(34, 197, 94)",
      showTooltip: true,
    },
    iconType: "revenue" as const,
    animated: true,
  },
  {
    title: "Commandes",
    value: 1247,
    change: {
      value: 3,
      type: "decrease" as const,
      period: "vs mois dernier",
    },
    color: "orange" as const,
    chart: {
      type: "line" as const,
      data: [25, 32, 28, 35, 42, 38, 35, 40, 45, 42],
      color: "rgb(251, 146, 60)",
      showTooltip: true,
    },
    iconType: "orders" as const,
    animated: true,
  },
  {
    title: "Taux de conversion",
    value: "3.47",
    suffix: "%",
    change: {
      value: 0,
      type: "neutral" as const,
      period: "Stable", //
    },
    color: "gray" as const,
    chart: {
      type: "line" as const,
      data: [3.2, 3.5, 3.4, 3.6, 3.5, 3.4, 3.5, 3.4, 3.5, 3.47],
      color: "rgb(107, 114, 128)",
      showTooltip: true,
    },
    iconType: "analytics" as const,
    animated: true,
  },
];

// Données pour les utilisateurs récents
export const mockHomeViewRecentUsers: User[] = [
  {
    id: "1",
    name: "Alice Martin",
    email: "alice.martin@example.com",
    roles: ["Utilisateur"],
    status: "Active",
    lastLogin: new Date(),
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "Thomas Dubois",
    email: "thomas.dubois@example.com",
    roles: ["Modérateur"],
    status: "Active",
    lastLogin: new Date(Date.now() - 3600000),
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "Sophie Leroy",
    email: "sophie.leroy@example.com",
    roles: ["Utilisateur"],
    status: "Inactive",
    lastLogin: new Date(Date.now() - 86400000),
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
  },
];

// Données pour les activités récentes
export const mockHomeViewRecentActivities = [
  {
    id: 1,
    type: "user",
    message: "Nouvel utilisateur inscrit: Pierre Moreau",
    time: new Date(),
  },
  {
    id: 2,
    type: "order",
    message: "Commande #1247 traitée avec succès",
    time: new Date(Date.now() - 1800000),
  },
  {
    id: 3,
    type: "system",
    message: "Sauvegarde automatique effectuée",
    time: new Date(Date.now() - 3600000),
  },
  {
    id: 4,
    type: "security",
    message: "Connexion admin détectée depuis Paris",
    time: new Date(Date.now() - 7200000),
  },
];

export const mockSupportViewStatsCards: StatsCardConfig[] = [
  {
    title: "Tickets ouverts",
    value: 24,
    chart: {},
    change: {
      value: 2,
      type: "increase" as const,
      period: "vs semaine dernière",
    },
    color: "red" as const,
    iconType: "exclamation-circle" as const,
    animated: true,
  },
  {
    title: "En cours",
    value: 15,
    chart: {},
    change: {
      value: -3,
      type: "decrease" as const,
      period: "vs semaine dernière",
    },
    color: "blue" as const,
    iconType: "clock" as const,
    animated: true,
  },
  {
    title: "Résolus (7j)",
    value: 42,
    chart: {},
    change: {
      value: 8,
      type: "increase" as const,
      period: "vs semaine dernière",
    },
    color: "green" as const,
    iconType: "check-circle" as const,
    animated: true,
  },
  {
    title: "Temps moyen",
    value: "4:32",
    chart: {},
    change: {
      value: -1.2,
      type: "decrease" as const,
      period: "vs semaine dernière",
    },
    color: "purple" as const,
    iconType: "clock" as const,
    animated: true,
  },
];

export const mockSupportViewLineChart = [
  {
    label: "Tickets",
    data: [5, 8, 6, 9, 7, 10, 8, 12, 9, 11],
    borderColor: "#3B82F6",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    fill: true,
    tension: 0.4,
  },
]
export const mockSupportViewBarChart = [
  {
    label: "Tickets",
    data: [15, 35, 30, 20],
    backgroundColor: ['#10B981', '#F59E0B', '#F97316', '#EF4444'],
  },
];
// Données pour les tickets
export const mockSupportViewTickets = [
  {
    subject: "Problème de connexion",
    client: "John Doe",
    status: "Ouvert",
    priority: "Haute",
    date: "15/06/2023",
  },
  {
    subject: "Question facturation",
    client: "Jane Smith",
    status: "En cours",
    priority: "Moyenne",
    date: "14/06/2023",
  },
  {
    subject: "Demande fonctionnalité",
    client: "Acme Corp",
    status: "Résolu",
    priority: "Basse",
    date: "12/06/2023",
  },
  {
    subject: "Bug interface",
    client: "XYZ Ltd",
    status: "Ouvert",
    priority: "Critique",
    date: "10/06/2023",
  },
];
