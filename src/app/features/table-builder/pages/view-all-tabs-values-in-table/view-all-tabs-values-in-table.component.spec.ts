import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllTabsValuesInTableComponent } from './view-all-tabs-values-in-table.component';

describe('ViewAllTabsValuesInTableComponent', () => {
  let component: ViewAllTabsValuesInTableComponent;
  let fixture: ComponentFixture<ViewAllTabsValuesInTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAllTabsValuesInTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllTabsValuesInTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
