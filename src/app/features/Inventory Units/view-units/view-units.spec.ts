import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUnits } from './view-units';

describe('ViewUnits', () => {
  let component: ViewUnits;
  let fixture: ComponentFixture<ViewUnits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewUnits]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewUnits);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
