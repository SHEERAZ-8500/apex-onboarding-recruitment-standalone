import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllEnumsValuesInTableComponent } from './view-all-enums-values-in-table.component';

describe('ViewAllEnumsValuesInTableComponent', () => {
  let component: ViewAllEnumsValuesInTableComponent;
  let fixture: ComponentFixture<ViewAllEnumsValuesInTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAllEnumsValuesInTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllEnumsValuesInTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
