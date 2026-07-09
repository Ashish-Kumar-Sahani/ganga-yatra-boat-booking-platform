import type { LucideIcon } from "lucide-react";

export interface SidebarMenuItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badgeCount?: number;
  subItems?: SidebarMenuItem[];
}

export interface SidebarSection {
  title: string;
  items: SidebarMenuItem[];
}

export interface PlatformStatus {
  online: boolean;
  message: string;
  latency?: string;
}
