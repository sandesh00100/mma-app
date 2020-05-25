import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchfilterComponent } from './matchfilter.component';

describe('MatchfilterComponent', () => {
  let component: MatchfilterComponent;
  let fixture: ComponentFixture<MatchfilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchfilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
