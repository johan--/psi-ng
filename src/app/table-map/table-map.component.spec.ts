import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMapViewComponent } from './table-map-view.component';

describe('TableMapViewComponent', () => {
  let component: TableMapViewComponent;
  let fixture: ComponentFixture<TableMapViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableMapViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableMapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
