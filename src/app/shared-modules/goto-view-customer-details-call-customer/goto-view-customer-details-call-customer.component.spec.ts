import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GotoViewCustomerDetailsCallCustomerComponent } from './goto-view-customer-details-call-customer.component';

describe('GotoViewCustomerDetailsCallCustomerComponent', () => {
  let component: GotoViewCustomerDetailsCallCustomerComponent;
  let fixture: ComponentFixture<GotoViewCustomerDetailsCallCustomerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GotoViewCustomerDetailsCallCustomerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GotoViewCustomerDetailsCallCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
