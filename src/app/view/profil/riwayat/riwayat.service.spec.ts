import { TestBed } from '@angular/core/testing';

import { RiwayatService } from './riwayat.service';

describe('RiwayatService', () => {
  let service: RiwayatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiwayatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
