import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LeadrecurringFollowupComponent } from './leadrecurring-followup.component';

describe('LeadrecurringFollowupComponent', () => {
  let component: LeadrecurringFollowupComponent;
  let fixture: ComponentFixture<LeadrecurringFollowupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadrecurringFollowupComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LeadrecurringFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
