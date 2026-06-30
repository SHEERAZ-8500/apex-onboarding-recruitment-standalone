import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateInstallmentsModal } from './generate-installments-modal';

describe('GenerateInstallmentsModal', () => {
  let component: GenerateInstallmentsModal;
  let fixture: ComponentFixture<GenerateInstallmentsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateInstallmentsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateInstallmentsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
