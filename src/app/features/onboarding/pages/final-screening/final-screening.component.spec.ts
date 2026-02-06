import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalScreeningComponent } from './final-screening.component';

describe('FinalScreeningComponent', () => {
  let component: FinalScreeningComponent;
  let fixture: ComponentFixture<FinalScreeningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinalScreeningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalScreeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
