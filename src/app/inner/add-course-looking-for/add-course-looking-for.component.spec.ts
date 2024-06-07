import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddCourseLookingForComponent } from './add-course-looking-for.component';

describe('AddCourseLookingForComponent', () => {
  let component: AddCourseLookingForComponent;
  let fixture: ComponentFixture<AddCourseLookingForComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCourseLookingForComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddCourseLookingForComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
