import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewUdfComponent } from './create-new-udf.component';

describe('CreateNewUdfComponent', () => {
  let component: CreateNewUdfComponent;
  let fixture: ComponentFixture<CreateNewUdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateNewUdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewUdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
