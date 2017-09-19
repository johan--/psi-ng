import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeRegisterComponent } from './node-register.component';

describe('NodeRegisterComponent', () => {
  let component: NodeRegisterComponent;
  let fixture: ComponentFixture<NodeRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
