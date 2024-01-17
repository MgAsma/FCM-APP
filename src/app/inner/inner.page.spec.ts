import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InnerPage } from './inner.page';

describe('InnerPage', () => {
  let component: InnerPage;
  let fixture: ComponentFixture<InnerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
