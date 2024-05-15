import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllocationToolbarTopComponent } from './allocation-toolbar-top.component';

describe('AllocationToolbarTopComponent', () => {
  let component: AllocationToolbarTopComponent;
  let fixture: ComponentFixture<AllocationToolbarTopComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocationToolbarTopComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllocationToolbarTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
