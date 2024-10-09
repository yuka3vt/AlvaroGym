import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PembelianPaketGymComponent } from './pembelian-paket-gym.component';

describe('PembelianPaketGymComponent', () => {
  let component: PembelianPaketGymComponent;
  let fixture: ComponentFixture<PembelianPaketGymComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PembelianPaketGymComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PembelianPaketGymComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
