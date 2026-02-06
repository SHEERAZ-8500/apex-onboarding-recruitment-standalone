import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllLookupTablesComponent } from './view-all-lookup-tables.component';

describe('ViewAllLookupTablesComponent', () => {
  let component: ViewAllLookupTablesComponent;
  let fixture: ComponentFixture<ViewAllLookupTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAllLookupTablesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllLookupTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
