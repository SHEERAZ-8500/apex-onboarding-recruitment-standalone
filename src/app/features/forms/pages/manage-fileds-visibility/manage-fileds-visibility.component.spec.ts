import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFiledsVisibilityComponent } from './manage-fileds-visibility.component';

describe('ManageFiledsVisibilityComponent', () => {
  let component: ManageFiledsVisibilityComponent;
  let fixture: ComponentFixture<ManageFiledsVisibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageFiledsVisibilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageFiledsVisibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
