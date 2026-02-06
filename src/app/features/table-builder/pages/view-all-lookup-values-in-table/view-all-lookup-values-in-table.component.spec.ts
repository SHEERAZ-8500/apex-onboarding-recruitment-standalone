import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllLookupValuesInTableComponent } from './view-all-lookup-values-in-table.component';

describe('ViewAllLookupValuesInTableComponent', () => {
  let component: ViewAllLookupValuesInTableComponent;
  let fixture: ComponentFixture<ViewAllLookupValuesInTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAllLookupValuesInTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllLookupValuesInTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
