import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLookupTableComponent } from './create-lookup-table.component';

describe('CreateLookupTableComponent', () => {
  let component: CreateLookupTableComponent;
  let fixture: ComponentFixture<CreateLookupTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateLookupTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateLookupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
