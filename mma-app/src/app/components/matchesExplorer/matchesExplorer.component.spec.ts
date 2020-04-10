import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchExplorerComponent } from './matchesExplorer.component';

describe('MatchesComponent', () => {
  let component: MatchExplorerComponent;
  let fixture: ComponentFixture<MatchExplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchExplorerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
