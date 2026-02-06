import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBoxCardComponent } from './chat-box-card.component';

describe('ChatBoxCardComponent', () => {
  let component: ChatBoxCardComponent;
  let fixture: ComponentFixture<ChatBoxCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatBoxCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatBoxCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
