import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CalllogToolbarSearchComponent } from './calllog-toolbar-search.component';

describe('CalllogToolbarSearchComponent', () => {
  let component: CalllogToolbarSearchComponent;
  let fixture: ComponentFixture<CalllogToolbarSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CalllogToolbarSearchComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CalllogToolbarSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
