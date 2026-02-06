import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayOutTwoComponent } from './lay-out-two.component';

describe('LayOutTwoComponent', () => {
  let component: LayOutTwoComponent;
  let fixture: ComponentFixture<LayOutTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayOutTwoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayOutTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
