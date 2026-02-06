import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offer-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offer-card.component.html',
  styleUrl: './offer-card.component.scss'
})
export class OfferCardComponent {
  @Input() offer: any ;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['offer']) {
      console.log('Offer changed:', this.offer);
    }
  }
}
