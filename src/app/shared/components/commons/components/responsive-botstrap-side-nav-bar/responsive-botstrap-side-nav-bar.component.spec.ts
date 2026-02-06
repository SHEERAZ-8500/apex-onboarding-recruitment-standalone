import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveBotstrapSideNavBarComponent } from './responsive-botstrap-side-nav-bar.component';

describe('ResponsiveBotstrapSideNavBarComponent', () => {
  let component: ResponsiveBotstrapSideNavBarComponent;
  let fixture: ComponentFixture<ResponsiveBotstrapSideNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponsiveBotstrapSideNavBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponsiveBotstrapSideNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
