import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgeScreenComponent } from './judge-screen.component';

describe('JudgeScreenComponent', () => {
  let component: JudgeScreenComponent;
  let fixture: ComponentFixture<JudgeScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JudgeScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JudgeScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
