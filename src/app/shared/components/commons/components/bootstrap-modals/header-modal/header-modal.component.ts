import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header-modal.component.html',
  styleUrl: './header-modal.component.scss'
})
export class HeaderModalComponent {
  activeTab: string = 'audit-logs';
  // Dummy data for quick actions
    quickActions = [
    { icon: 'fa-solid fa-euro-sign', label: 'Accounting' },
    { icon: 'fa-solid fa-users', label: 'Members' },
    { icon: 'fa-solid fa-briefcase', label: 'Projects' },
    { icon: 'fa-solid fa-user-tie', label: 'Customers' },
    { icon: 'fa-solid fa-envelope', label: 'Email' },
    { icon: 'fa-solid fa-gear', label: 'Settings' },
  ];
  // Dummy data for audit logs
  systemMessages = [
    { title: 'Duis faucibus lorem', subtitle: 'Pharetra, Nulla', amount: '+125$' },
    { title: 'Mauris varius augue', subtitle: 'Pharetra, Nulla', amount: '+125$' },
    { title: 'Aliquam in magna', subtitle: 'Pharetra, Nulla', amount: '+125$' },
    { title: 'Phasellus venenatis nisi', subtitle: 'Pharetra, Nulla', amount: '+125$' },
    { title: 'Vivamus consectetur', subtitle: 'Pharetra, Nulla', amount: '+125$' }
  ];

  tasksOverview = [
    { title: 'Project Briefing', subtitle: 'Project Manager' },
    { title: 'Concept Design', subtitle: 'Art Director' },
    { title: 'Functional Logics', subtitle: 'Lead Developer' },
    { title: 'Development', subtitle: 'DevOps' },
    { title: 'Testing', subtitle: 'QA Managers' }
  ];

  // Dummy data for notifications
  notifications = [
    { time: '10:10', message: 'Morbi quis ex eu arcu auctor sagittis.', author: 'Johne' },
    { time: '08:40', message: 'Proin loculis eros non odio omare efficitur.', author: 'Amia' },
    { time: '07:10', message: 'In mattis mi ut posuere consectetur.', author: 'Josef' },
    { time: '01:15', message: 'Morbi quis ex eu arcu auctor sagittis.', author: 'Rima' },
    { time: '23:12', message: 'Morbi quis ex eu arcu auctor sagittis.', author: 'Alaxa' },
    { time: '10:10', message: 'Morbi quis ex eu arcu auctor sagittis.', author: 'Johne' },
    { time: '08:40', message: 'Proin loculis eros non odio omare efficitur.', author: 'Amia' },
    { time: '07:10', message: 'In mattis mi ut posuere consectetur.', author: 'Josef' }
  ];

  // Dummy data for settings
  settings = [
    {
      section: 'Customer Care',
      items: [
        { name: 'Enable Notifications', enabled: true, id: 'enable-notifications' },
        { name: 'Enable Case Tracking', enabled: false, id: 'enable-case-tracking' },
        { name: 'Support Portal', enabled: true, id: 'support-portal' }
      ]
    },
    {
      section: 'Reports',
      items: [
        { name: 'Generate Reports', enabled: true, id: 'generate-reports' },
        { name: 'Enable Report Export', enabled: false, id: 'enable-report-export' },
        { name: 'Allow Data Collection', enabled: true, id: 'allow-data-collection' }
      ]
    },
    {
      section: 'Members',
      items: [
        { name: 'Enable Member singup', enabled: false, id: 'enable-member-signup' },
        { name: 'Allow User Feedbacks', enabled: true, id: 'allow-user-feedbacks' },
        { name: 'Enable Customer Portal', enabled: false, id: 'enable-customer-portal' }
      ]
    }
  ];

  // Colors for different sections
  systemMessageColors = ['#6610f2', '#dc3545', '#198754', '#0080ff', '#ffc107'];
  taskOverviewColors =  ['#6610f2', '#dc3545', '#198754', '#0080ff', '#ffc107'];
  notificationTimelineColors =  ['#6610f2', '#dc3545', '#198754', '#0080ff', '#ffc107', '#6610f2', '#dc3545', '#198754', '#0080ff', '#ffc107'];

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  toggleSetting(sectionIndex: number, itemIndex: number) {
    this.settings[sectionIndex].items[itemIndex].enabled = 
      !this.settings[sectionIndex].items[itemIndex].enabled;
  }

  getSystemMessageColor(index: number): string {
    return this.systemMessageColors[index % this.systemMessageColors.length];
  }

  getTaskOverviewColor(index: number): string {
    return this.taskOverviewColors[index % this.taskOverviewColors.length];
  }

  getNotificationTimelineColor(index: number): string {
    return this.notificationTimelineColors[index % this.notificationTimelineColors.length];
  }

  getToggleColor(section: string): string {
    switch(section) {
      case 'Customer Care': return '#7047ee'; // Purple
      case 'Reports': return '#da123b'; // Red
      case 'Members': return '#ffc107'; // Yellow
      default: return '#7047ee';
    }
  }
}