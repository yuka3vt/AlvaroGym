import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TentangKamiComponent } from './tentang-kami.component';

describe('TentangKamiComponent', () => {
  let component: TentangKamiComponent;
  let fixture: ComponentFixture<TentangKamiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TentangKamiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TentangKamiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
