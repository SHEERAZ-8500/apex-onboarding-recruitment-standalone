import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserPermissionsComponent } from './view-user-permissions.component';

describe('ViewUserPermissionsComponent', () => {
  let component: ViewUserPermissionsComponent;
  let fixture: ComponentFixture<ViewUserPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewUserPermissionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewUserPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
