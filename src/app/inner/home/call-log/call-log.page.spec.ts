import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CallLogPage } from './call-log.page';

describe('CallLogPage', () => {
  let component: CallLogPage;
  let fixture: ComponentFixture<CallLogPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CallLogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
