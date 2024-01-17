import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecFollowupListPage } from './rec-followup-list.page';

describe('RecFollowupListPage', () => {
  let component: RecFollowupListPage;
  let fixture: ComponentFixture<RecFollowupListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RecFollowupListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
