export interface DateRange {
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
}

export interface BookingsSummary {
  total: number;
  byStatus: Record<string, number>;
}

export interface UnitsSummary {
  total: number;
  byStatus: Record<string, number>;
  byPropertyType: Record<string, number>;
}

export interface RevenueSummary {
  acceptedContractValue: number;
  pipelineContractValue: number;
  collectedToDate: number;
  outstanding: number;
  overdueAmount: number;
}

export interface RecentAction {
  action: string;
  itemType: string;
  actorUsername: string;
  occurredAt: string;
}

export interface TeamSummary {
  activeUsers: number;
  recentActions: RecentAction[];
}

export interface DashboardData {
  generatedAt: string;
  range: DateRange;
  bookings: BookingsSummary;
  units: UnitsSummary;
  revenue: RevenueSummary;
  team: TeamSummary;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

export type ReportExportType = 'bookings' | 'installments' | 'revenue-by-booking';

export const REPORT_EXPORT_LABELS: Record<ReportExportType, string> = {
  'bookings': 'Bookings',
  'installments': 'Installments ledger',
  'revenue-by-booking': 'Revenue by booking',
};