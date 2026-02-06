import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewRoleComponent } from './create-new-role.component';

describe('CreateNewRoleComponent', () => {
  let component: CreateNewRoleComponent;
  let fixture: ComponentFixture<CreateNewRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateNewRoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
