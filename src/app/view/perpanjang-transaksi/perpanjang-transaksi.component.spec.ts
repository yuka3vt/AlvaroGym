import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerpanjangTransaksiComponent } from './perpanjang-transaksi.component';

describe('PerpanjangTransaksiComponent', () => {
  let component: PerpanjangTransaksiComponent;
  let fixture: ComponentFixture<PerpanjangTransaksiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerpanjangTransaksiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerpanjangTransaksiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
