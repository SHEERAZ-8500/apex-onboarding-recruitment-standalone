import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewRowInTableComponent } from './create-new-row-in-table.component';

describe('CreateNewRowInTableComponent', () => {
  let component: CreateNewRowInTableComponent;
  let fixture: ComponentFixture<CreateNewRowInTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateNewRowInTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewRowInTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
