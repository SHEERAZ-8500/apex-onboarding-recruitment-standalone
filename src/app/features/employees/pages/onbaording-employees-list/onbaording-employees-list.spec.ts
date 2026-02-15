import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnbaordingEmployeesList } from './onbaording-employees-list';

describe('OnbaordingEmployeesList', () => {
  let component: OnbaordingEmployeesList;
  let fixture: ComponentFixture<OnbaordingEmployeesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnbaordingEmployeesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnbaordingEmployeesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
