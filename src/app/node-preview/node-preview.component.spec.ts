import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodePreviewComponent } from './node-preview.component';

describe('NodePreviewComponent', () => {
  let component: NodePreviewComponent;
  let fixture: ComponentFixture<NodePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
