import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesMasterData } from './leaves-master-data';

describe('LeavesMasterData', () => {
  let component: LeavesMasterData;
  let fixture: ComponentFixture<LeavesMasterData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeavesMasterData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavesMasterData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
