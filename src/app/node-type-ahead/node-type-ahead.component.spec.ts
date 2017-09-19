import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeTypeAheadComponent } from './node-type-ahead.component';

describe('NodeTypeAheadComponent', () => {
  let component: NodeTypeAheadComponent;
  let fixture: ComponentFixture<NodeTypeAheadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeTypeAheadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeTypeAheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
