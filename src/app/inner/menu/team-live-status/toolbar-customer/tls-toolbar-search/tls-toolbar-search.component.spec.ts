import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TlsToolbarSearchComponent } from './tls-toolbar-search.component';

describe('TlsToolbarSearchComponent', () => {
  let component: TlsToolbarSearchComponent;
  let fixture: ComponentFixture<TlsToolbarSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TlsToolbarSearchComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TlsToolbarSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
