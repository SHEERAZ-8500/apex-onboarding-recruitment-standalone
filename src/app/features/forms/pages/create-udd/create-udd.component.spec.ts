import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUddComponent } from './create-udd.component';

describe('CreateUddComponent', () => {
  let component: CreateUddComponent;
  let fixture: ComponentFixture<CreateUddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
