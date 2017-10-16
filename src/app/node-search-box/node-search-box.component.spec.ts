import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeSearchBoxComponent } from './node-search-box.component';

describe('NodeSearchBoxComponent', () => {
  let component: NodeSearchBoxComponent;
  let fixture: ComponentFixture<NodeSearchBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeSearchBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeSearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
