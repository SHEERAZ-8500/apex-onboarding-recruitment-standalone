// src/app/chat.service.ts

export interface Contact {
  id: number;
  name: string;
  lastSeen?: string;
  lastMessage?: string;
  avatarColor?: string;
}

export interface Message {
  id: number;
  contactId: number;
  text: string;
  fromMe: boolean;
  time: string; // ISO or short time string
}

export interface EventItem {
  id: number;
  date: string; // yyyy-mm-dd
  title: string;
  time?: string;
  color?: string;
  desc?: string;
}
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ChatService {

  contacts: Contact[] = [
    { id: 1, name: 'Mical Clark', lastSeen: '10:00pm', lastMessage: 'Nullam facilisis velit.', avatarColor: '#f29573' },
    { id: 2, name: 'Colin Nathan', lastSeen: '10:00pm', lastMessage: 'Nullam facilisis velit.', avatarColor: '#ffd166' },
    { id: 3, name: 'Nathan Johen', lastSeen: '10:00pm', lastMessage: 'Nullam facilisis velit.', avatarColor: '#90caf9' },
    { id: 4, name: 'Semi Doe', lastSeen: '10:00pm', lastMessage: 'Nullam facilisis velit.', avatarColor: '#b39ddb' },
    { id: 5, name: 'Mimi Carreira', lastSeen: '09:41pm', lastMessage: 'I would suggest...', avatarColor: '#e573ff' },
  ];

  messages: Message[] = [
    { id: 1, contactId: 2, text: 'What do you think about our plans for this product launch?', fromMe: false, time: '09:25' },
    { id: 2, contactId: 2, text: 'It looks to me like you have a lot planned before your deadline.', fromMe: false, time: '09:28' },
    { id: 3, contactId: 2, text: 'I would suggest you discuss this further with the advertising team.', fromMe: true, time: '09:41' },
    { id: 4, contactId: 2, text: 'I am very busy at the moment and on top of everything, I forgot my umbrella today.', fromMe: true, time: '09:41' },
  ];

  events: EventItem[] = [
    { id: 1, date: this.isoFromOffset(0, 2025, 11, 5), title: '11:40a Thi', time: '11:40', color: '#ff5c8a', desc: 'Important event' },
    { id: 2, date: this.isoFromOffset(0, 2025, 11, 14), title: '1:40p Like', time: '13:40', color: '#1abc9c', desc: 'Meeting' },
    { id: 3, date: this.isoFromOffset(0, 2025, 11, 8), title: 'Main basket', time: '09:00', color: '#7b61ff', desc: 'Task with Muhammad' }
  ];

  constructor() {}

  getContacts() {
    return this.contacts.slice();
  }

  getMessagesFor(contactId: number) {
    return this.messages.filter(m => m.contactId === contactId);
  }

  sendMessage(contactId: number, text: string) {
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const msg: Message = {
      id: this.messages.length + 1,
      contactId,
      text,
      fromMe: true,
      time
    };
    this.messages.push(msg);
    // emulate auto-reply after short delay
    setTimeout(() => {
      this.messages.push({
        id: this.messages.length + 1,
        contactId,
        text: 'Auto reply: got your message ✔',
        fromMe: false,
        time
      });
    }, 800);
    return msg;
  }

  addEvent(event: EventItem) {
    event.id = this.events.length + 1;
    this.events.push(event);
  }

  getEventsForMonth(year: number, monthIndex: number) {
    // monthIndex 0..11
    return this.events.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === monthIndex;
    });
  }

  getEventsOn(dateISO: string) {
    return this.events.filter(e => e.date === dateISO);
  }

  isoFromOffset(_unused: number, y: number, m: number, d: number) {
    // helper to build yyyy-mm-dd for sample. m is 1..12
    return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  }
}
