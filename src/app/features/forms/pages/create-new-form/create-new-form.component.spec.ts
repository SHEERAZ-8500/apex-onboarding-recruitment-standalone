import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewFormComponent } from './create-new-form.component';

describe('CreateNewFormComponent', () => {
  let component: CreateNewFormComponent;
  let fixture: ComponentFixture<CreateNewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateNewFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
