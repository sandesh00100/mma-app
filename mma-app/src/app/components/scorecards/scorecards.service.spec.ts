import { TestBed } from '@angular/core/testing';

import { ScoreCardService } from './scorecards.service';

describe('JudgeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScoreCardService = TestBed.get(ScoreCardService);
    expect(service).toBeTruthy();
  });
});
