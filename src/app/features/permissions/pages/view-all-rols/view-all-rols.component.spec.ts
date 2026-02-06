import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllRolsComponent } from './view-all-rols.component';

describe('ViewAllRolsComponent', () => {
  let component: ViewAllRolsComponent;
  let fixture: ComponentFixture<ViewAllRolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAllRolsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllRolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
