export interface NavigationChild {
  name: string;
  label: string;
  path: string;
}

export interface NavigationItem {
  name: string;
  label: string;
  path?: string;
  icon: string;
  children?: NavigationChild[];
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  time: Date;
  read: boolean;
}
