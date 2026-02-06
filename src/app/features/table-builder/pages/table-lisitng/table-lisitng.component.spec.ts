import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLisitngComponent } from './table-lisitng.component';

describe('TableLisitngComponent', () => {
  let component: TableLisitngComponent;
  let fixture: ComponentFixture<TableLisitngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableLisitngComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableLisitngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
