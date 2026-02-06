import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewRowLookupTableComponent } from './add-new-row-lookup-table.component';

describe('AddNewRowLookupTableComponent', () => {
  let component: AddNewRowLookupTableComponent;
  let fixture: ComponentFixture<AddNewRowLookupTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddNewRowLookupTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewRowLookupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
