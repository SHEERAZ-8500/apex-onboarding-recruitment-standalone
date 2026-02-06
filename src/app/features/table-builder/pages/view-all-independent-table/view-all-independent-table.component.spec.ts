import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllIndependentTableComponent } from './view-all-independent-table.component';

describe('ViewAllIndependentTableComponent', () => {
  let component: ViewAllIndependentTableComponent;
  let fixture: ComponentFixture<ViewAllIndependentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAllIndependentTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllIndependentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
