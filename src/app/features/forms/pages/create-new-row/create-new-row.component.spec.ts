import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewRowComponent } from './create-new-row.component';

describe('CreateNewRowComponent', () => {
  let component: CreateNewRowComponent;
  let fixture: ComponentFixture<CreateNewRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateNewRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
