import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTitle } from './job-title';

describe('JobTitle', () => {
  let component: JobTitle;
  let fixture: ComponentFixture<JobTitle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobTitle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobTitle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
