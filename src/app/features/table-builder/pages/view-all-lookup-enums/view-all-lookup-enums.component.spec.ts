import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllLookupEnumsComponent } from './view-all-lookup-enums.component';

describe('ViewAllLookupEnumsComponent', () => {
  let component: ViewAllLookupEnumsComponent;
  let fixture: ComponentFixture<ViewAllLookupEnumsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAllLookupEnumsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllLookupEnumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
