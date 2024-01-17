import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamLiveStatusPage } from './team-live-status.page';

describe('TeamLiveStatusPage', () => {
  let component: TeamLiveStatusPage;
  let fixture: ComponentFixture<TeamLiveStatusPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TeamLiveStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
