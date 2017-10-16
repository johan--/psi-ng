import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeHitsComponent } from './node-hits.component';

describe('NodeHitsComponent', () => {
  let component: NodeHitsComponent;
  let fixture: ComponentFixture<NodeHitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeHitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeHitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
