import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TlsToolbarTopComponent } from './tls-toolbar-top.component';

describe('TlsToolbarTopComponent', () => {
  let component: TlsToolbarTopComponent;
  let fixture: ComponentFixture<TlsToolbarTopComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TlsToolbarTopComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TlsToolbarTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
