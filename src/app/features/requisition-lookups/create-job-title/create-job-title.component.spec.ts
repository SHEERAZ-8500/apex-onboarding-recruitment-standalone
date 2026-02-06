import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJobTitleComponent } from './create-job-title.component';

describe('CreateJobTitleComponent', () => {
  let component: CreateJobTitleComponent;
  let fixture: ComponentFixture<CreateJobTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateJobTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateJobTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
