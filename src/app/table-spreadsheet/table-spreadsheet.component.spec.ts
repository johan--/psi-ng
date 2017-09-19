import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSpreadsheetComponent } from './table-spreadsheet.component';

describe('TableSpreadsheetComponent', () => {
  let component: TableSpreadsheetComponent;
  let fixture: ComponentFixture<TableSpreadsheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableSpreadsheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableSpreadsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
