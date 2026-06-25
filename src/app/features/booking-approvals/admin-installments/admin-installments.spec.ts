import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInstallments } from './admin-installments';

describe('AdminInstallments', () => {
  let component: AdminInstallments;
  let fixture: ComponentFixture<AdminInstallments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInstallments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminInstallments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
