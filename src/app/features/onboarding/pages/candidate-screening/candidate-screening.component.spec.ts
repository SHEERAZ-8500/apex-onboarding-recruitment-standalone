import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateScreeningComponent } from './candidate-screening.component';

describe('CandidateScreeningComponent', () => {
  let component: CandidateScreeningComponent;
  let fixture: ComponentFixture<CandidateScreeningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidateScreeningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateScreeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
