import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayOutOneComponent } from './lay-out-one.component';

describe('LayOutOneComponent', () => {
  let component: LayOutOneComponent;
  let fixture: ComponentFixture<LayOutOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayOutOneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayOutOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
