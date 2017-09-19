import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSimpleSearchComponent } from './input-simple-search.component';

describe('InputSimpleSearchComponent', () => {
  let component: InputSimpleSearchComponent;
  let fixture: ComponentFixture<InputSimpleSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputSimpleSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputSimpleSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
