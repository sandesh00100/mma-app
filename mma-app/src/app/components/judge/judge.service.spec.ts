import { TestBed } from '@angular/core/testing';

import { JudgeService } from './judge.service';

describe('JudgeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JudgeService = TestBed.get(JudgeService);
    expect(service).toBeTruthy();
  });
});
