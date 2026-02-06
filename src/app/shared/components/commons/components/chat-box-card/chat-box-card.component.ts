import { Component, ElementRef, HostListener, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-box-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-box-card.component.html',
  styleUrls: ['./chat-box-card.component.scss']
})
export class ChatBoxCardComponent {
  @Input() visible = false;   // Controlled from header
  @Output() close = new EventEmitter<void>(); // Emits event to header

  // Card data
  cardData = {
    name: "Mayra Sibley",
    status: "Active",
    profileIcon: "fa-solid fa-user-plus"
  };

  // Chat messages
  messages = [
    { text: "Hi there, I'm Jesse and you?", type: "received" },
    { text: "My name is Anne ClarC.", type: "sent" },
    { text: "Nice to meet you Anne. How can I help you?", type: "received" }
  ];

  // Dropdown items
  dropdownItems = [
    { icon: "fa fa-users", label: "New Group" },
    { icon: "fa fa-address-book", label: "Contacts" },
    { icon: "fa fa-layer-group", label: "Groups" },
    { icon: "fa fa-phone", label: "Calls" },
    { icon: "fa fa-cog", label: "Settings" },
    { icon: "fa fa-question-circle", label: "Help" },
    { icon: "fa fa-bell", label: "Privacy" }
  ];

  // UI states
  isDropdownOpen = false;

  // ViewChilds for click outside logic
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  @ViewChild('profileButton') profileButton!: ElementRef;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeCard() {
    this.close.emit();  // notify header to hide card
    this.isDropdownOpen = false;
  }

  openCard() {
    this.isDropdownOpen = false;
  }

  // Close dropdown on click outside
  @HostListener('document:click', ['$event'])
  onOutsideClick(event: Event) {
    if (!this.dropdownMenu || !this.profileButton) return;

    const clickedInsideDropdown = this.dropdownMenu.nativeElement.contains(event.target);
    const clickedProfileButton = this.profileButton.nativeElement.contains(event.target);

    if (!clickedInsideDropdown && !clickedProfileButton) {
      this.isDropdownOpen = false;
    }
  }
}
