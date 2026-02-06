import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPagesComponent } from './reset-pages.component';

describe('ResetPagesComponent', () => {
  let component: ResetPagesComponent;
  let fixture: ComponentFixture<ResetPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResetPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
