import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLoopupEnumsComponent } from './create-loopup-enums.component';

describe('CreateLoopupEnumsComponent', () => {
  let component: CreateLoopupEnumsComponent;
  let fixture: ComponentFixture<CreateLoopupEnumsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateLoopupEnumsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateLoopupEnumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
