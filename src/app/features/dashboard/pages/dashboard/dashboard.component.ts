import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { finalize } from 'rxjs/operators';
import { Subject, takeUntil } from 'rxjs';

import { DashboardApiService } from '../../service/dashboard.service';
import {
  DashboardData,
  ReportExportType,
  REPORT_EXPORT_LABELS,
} from '../../service/dashboard.model';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

interface ExportButtonState {
  type: ReportExportType;
  label: string;
  loading: boolean;
}

@Component({
  selector: 'app-admin-dashboard',
   imports: [CommonModule,FormsModule,RouterModule],

   standalone:true,
    templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('bookingsStatusChart') bookingsStatusChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('unitsStatusChart') unitsStatusChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('propertyTypeChart') propertyTypeChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;

  loading = true;
  errorMessage: string | null = null;
  data: DashboardData | null = null;

  fromDate: string = this.firstDayOfMonth();
  toDate: string = this.today();

  exportButtons: ExportButtonState[] = [
    { type: 'bookings', label: REPORT_EXPORT_LABELS['bookings'], loading: false },
    { type: 'installments', label: REPORT_EXPORT_LABELS['installments'], loading: false },
    { type: 'revenue-by-booking', label: REPORT_EXPORT_LABELS['revenue-by-booking'], loading: false },
  ];

  private charts: Chart[] = [];
  private viewReady = false;
  private destroy$ = new Subject<void>();

  // Palette tuned for a dark, gold-accented "executive" theme
  private readonly palette = {
    gold: '#D8B25A',
    goldDim: '#9C7E3B',
    emerald: '#3FA796',
    rose: '#C2664A',
    azure: '#5C7FB2',
    slate: '#8A8A8E',
    crimson: '#B14848',
  };

  constructor(
    private dashboardApi: DashboardApiService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.fetchDashboard();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.data) {
      this.safeRenderCharts();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.ngZone.runOutsideAngular(() => this.destroyCharts());
  }

  applyFilter(): void {
    this.fetchDashboard();
  }

  resetFilter(): void {
    this.fromDate = this.firstDayOfMonth();
    this.toDate = this.today();
    this.fetchDashboard();
  }

  exportCsv(type: ReportExportType): void {
    const button = this.exportButtons.find(b => b.type === type);
    if (!button || button.loading) return;

    button.loading = true;
    this.dashboardApi.exportReport(type, this.fromDate, this.toDate)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (button.loading = false))
      )
      .subscribe({
        error: () => {
          this.errorMessage = `Couldn't export ${button.label.toLowerCase()}. Try again.`;
        },
      });
  }

  get bookingStatusEntries(): [string, number][] {
    return this.data ? Object.entries(this.data.bookings.byStatus) : [];
  }

  get unitStatusEntries(): [string, number][] {
    return this.data ? Object.entries(this.data.units.byStatus) : [];
  }

  get collectionProgress(): number {
    if (!this.data) return 0;
    const total = this.data.revenue.collectedToDate + this.data.revenue.outstanding;
    if (total <= 0) return 0;
    return Math.round((this.data.revenue.collectedToDate / total) * 100);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(value);
  }

  formatTimestamp(iso: string): string {
    return new Date(iso).toLocaleString('en-PK', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatActionLabel(action: string): string {
    return action
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private fetchDashboard(): void {
    this.loading = true;
    this.errorMessage = null;

    this.dashboardApi.getDashboard(this.fromDate, this.toDate)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: (response: any) => {
          // Defensive: some apps have an interceptor that already unwraps
          // the {success, message, data} envelope, so response IS the data.
          // Detect which shape we actually got.
          const looksUnwrapped = response && response.bookings && response.units && response.revenue;
          this.data = looksUnwrapped ? response : response?.data;

          if (!this.data) {
            this.errorMessage = "Dashboard response didn't match the expected shape. Check console.";
            return;
          }

          if (this.viewReady) {
            // Force the *ngIf="data as d" block (and its canvases) into the DOM
            // synchronously before we touch ViewChild refs — far more reliable
            // than a setTimeout(0) race, and avoids creating charts against a
            // stale/undefined canvas.
            this.cdr.detectChanges();
            this.safeRenderCharts();
          }
        },
        error: (err) => {
          console.error('[dashboard] request failed:', err);
          this.errorMessage = "Couldn't load the dashboard. Check your connection and try again.";
        },
      });
  }

  /**
   * Chart.js drives its own animation loop, resize observers, and event
   * listeners via requestAnimationFrame. Inside Angular's zone, every single
   * one of those frames re-triggers app-wide change detection, which is what
   * causes the UI to lock up after a couple of filter applies. Running chart
   * creation/destruction outside the Angular zone stops that feedback loop.
   */
  private safeRenderCharts(): void {
    this.ngZone.runOutsideAngular(() => {
      try {
        this.renderCharts();
      } catch (err) {
        console.error('[dashboard] chart render failed:', err);
      }
    });
  }

  private renderCharts(): void {
    if (!this.data) return;
    this.destroyCharts();

    this.renderDoughnut(
      this.bookingsStatusChartRef?.nativeElement,
      this.data.bookings.byStatus,
      [this.palette.gold, this.palette.emerald, this.palette.azure, this.palette.rose, this.palette.crimson, this.palette.slate]
    );

    this.renderDoughnut(
      this.unitsStatusChartRef?.nativeElement,
      this.data.units.byStatus,
      [this.palette.emerald, this.palette.gold, this.palette.crimson]
    );

    this.renderDoughnut(
      this.propertyTypeChartRef?.nativeElement,
      this.data.units.byPropertyType,
      [this.palette.azure, this.palette.gold, this.palette.emerald, this.palette.rose]
    );

    this.renderRevenueBar();
  }

  private renderDoughnut(canvas: HTMLCanvasElement | undefined, source: Record<string, number>, colors: string[]): void {
    if (!canvas) return;
    const labels = Object.keys(source);
    const values = Object.values(source);
    if (labels.length === 0) return;

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: labels.map(l => this.formatActionLabel(l)),
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderColor: '#1A1A1E',
          borderWidth: 2,
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // cutout: '68%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1A1A1E',
            titleColor: '#D8B25A',
            bodyColor: '#E8E6DF',
            borderColor: '#2D2D33',
            borderWidth: 1,
            padding: 10,
          },
        },
      },
    };

    this.charts.push(new Chart(canvas, config));
  }

  private renderRevenueBar(): void {
    const canvas = this.revenueChartRef?.nativeElement;
    if (!canvas || !this.data) return;

    const r = this.data.revenue;
    const labels = ['Accepted contract', 'Pipeline', 'Collected', 'Outstanding', 'Overdue'];
    const values = [r.acceptedContractValue, r.pipelineContractValue, r.collectedToDate, r.outstanding, r.overdueAmount];
    const colors = [this.palette.gold, this.palette.goldDim, this.palette.emerald, this.palette.azure, this.palette.crimson];

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Amount (PKR)',
          data: values,
          backgroundColor: colors,
          borderRadius: 6,
          maxBarThickness: 46,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1A1A1E',
            titleColor: '#D8B25A',
            bodyColor: '#E8E6DF',
            borderColor: '#2D2D33',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: (ctx) => this.formatCurrency(Number(ctx.raw)),
            },
          },
        },
        scales: {
          x: {
            ticks: { color: '#A9A7A0', font: { size: 11 } },
            grid: { display: false },
          },
          y: {
            ticks: {
              color: '#A9A7A0',
              callback: (val) => this.compactCurrency(Number(val)),
            },
            grid: { color: 'rgba(255,255,255,0.06)' },
          },
        },
      },
    };

    this.charts.push(new Chart(canvas, config));
  }

  private compactCurrency(value: number): string {
    if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
    return `${value}`;
  }

  private destroyCharts(): void {
    this.charts.forEach(c => c.destroy());
    this.charts = [];
  }

  private firstDayOfMonth(): string {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}