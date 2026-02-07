export interface MenuItem {
  label: string;
  icon?: string;
  route?: string;
  isVisible: boolean;
  children?: MenuItem[];
  collapsed?: boolean;
}

export interface MenuGroup {
  label: string;
  icon: string;
  isVisible: boolean;
  collapsed: boolean;
  children: MenuItem[];
}
