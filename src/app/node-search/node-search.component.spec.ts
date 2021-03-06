import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeSearchComponent } from './node-search.component';

describe('NodeSearchComponent', () => {
  let component: NodeSearchComponent;
  let fixture: ComponentFixture<NodeSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
