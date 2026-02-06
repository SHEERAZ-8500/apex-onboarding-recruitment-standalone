import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildTableComponent } from './build-table.component';

describe('BuildTableComponent', () => {
  let component: BuildTableComponent;
  let fixture: ComponentFixture<BuildTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuildTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
