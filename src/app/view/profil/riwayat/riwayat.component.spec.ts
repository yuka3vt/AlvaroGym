import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiwayatComponent } from './riwayat.component';

describe('RiwayatComponent', () => {
  let component: RiwayatComponent;
  let fixture: ComponentFixture<RiwayatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiwayatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RiwayatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
