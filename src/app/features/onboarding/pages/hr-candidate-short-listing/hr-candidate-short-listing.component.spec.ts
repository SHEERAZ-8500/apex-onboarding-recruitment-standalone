import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrCandidateShortListingComponent } from './hr-candidate-short-listing.component';

describe('HrCandidateShortListingComponent', () => {
  let component: HrCandidateShortListingComponent;
  let fixture: ComponentFixture<HrCandidateShortListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HrCandidateShortListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrCandidateShortListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
