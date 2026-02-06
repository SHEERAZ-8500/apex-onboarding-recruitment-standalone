import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewIndependentTableComponent } from './create-new-independent-table.component';

describe('CreateNewIndependentTableComponent', () => {
  let component: CreateNewIndependentTableComponent;
  let fixture: ComponentFixture<CreateNewIndependentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateNewIndependentTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewIndependentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
