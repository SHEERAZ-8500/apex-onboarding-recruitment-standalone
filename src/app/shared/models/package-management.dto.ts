export interface PackageData {
  packageName: string;
  price: number;
  locations: string;
  materials: string;
  jobsPerMonth: string;
  maxUsers: string;
  assignedUser: string;
  features: {
    equipmentTracking: boolean;
  };
}

export interface PackageDialogData {
  mode: 'create' | 'edit';
  data?: PackageData;
}

export interface PackageDialogResult {
  action: 'create' | 'edit';
  data: PackageData;
}
