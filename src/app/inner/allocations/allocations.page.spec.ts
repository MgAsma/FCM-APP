import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllocationsPage } from './allocations.page';

describe('AllocationsPage', () => {
  let component: AllocationsPage;
  let fixture: ComponentFixture<AllocationsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AllocationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
