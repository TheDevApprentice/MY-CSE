// components/dashboards/SASS/admin/types/admin.ts

import { NavigationItem } from "@/components/common/layouts/dashboard/types/types";
import { User } from "@/services/api";
import { Ref, ComputedRef } from "vue";

// Types de base pour le dashboard admin

// Export à la fois comme type et comme valeur
export const enum AdminView {
  HOME = "home",
  ANALYTICS = "analytics",
  CLIENTS = "clients",
  BILLING = "billing",
  SUPPORT = "support",
  CONFIGURATION = "configuration",
}

export interface AdminViewConfig {
  name: AdminView;
  label: string;
  path: string;
  icon?: string;
  component: string;
}

export type UseAdminViewReturn = {
  currentView: Ref<AdminView>;
  activeView: ComputedRef<AdminView | undefined>;
  loading: Ref<boolean>;
  isAnimating: Ref<boolean>;
  navigationItems: Ref<AdminNavigationItem[]>;
  setView: (viewName: AdminView) => Promise<void>;
  isActiveView: (viewName: AdminView) => boolean;
  animateViewEnter: (el: HTMLElement) => void;
  animateViewExit: (el: HTMLElement, onComplete?: () => void) => void;
  animateModalEnter: (el: HTMLElement) => void;
  animateModalExit: (el: HTMLElement) => void;
};

export interface AdminNavigationItem extends NavigationItem {
  name: string;
  label: string;
  path: string;
  icon: string;
  children?: AdminNavigationItem[];
}

export interface AdminUser extends User {}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  time: Date;
  read: boolean;
}

export interface AdminNotificationSettings {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface AdminDashboardState {
  currentView: AdminView;
  isLoading: boolean;
  loadingText: string;
  breadcrumbs: Array<{ label: string; path: string }>;
  notifications: AdminNotification[];
}

// Types pour les données métier
export interface Client {
  id: string;
  name: string;
  email: string;
  subscriptionPlan: string;
  status: "active" | "pending" | "suspended" | "cancelled";
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
}

export interface Invoice {
  id: string;
  clientId: string;
  amount: number;
  date: Date;
  dueDate: Date;
  status: "paid" | "pending" | "overdue" | "cancelled";
  pdfUrl?: string;
}

export interface SupportTicket {
  id: string;
  title: string;
  status: "open" | "pending" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
}

export type ClientData = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  lastActive: string;
  plan: string;
};

export type InvoiceData = {
  id: string;
  clientId: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "overdue";
  downloadUrl?: string;
};

export type SupportTicketData = {
  id: string;
  subject: string;
  clientId: string;
  priority: "low" | "medium" | "high";
  status: "open" | "pending" | "closed";
  createdAt: string;
  updatedAt: string;
};
