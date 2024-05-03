import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomerToolbarCounsellorComponent } from './customer-toolbar-counsellor.component';

describe('CustomerToolbarCounsellorComponent', () => {
  let component: CustomerToolbarCounsellorComponent;
  let fixture: ComponentFixture<CustomerToolbarCounsellorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerToolbarCounsellorComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerToolbarCounsellorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
