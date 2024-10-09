import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BmiKalkulatorComponent } from './bmi-kalkulator.component';

describe('BmiKalkulatorComponent', () => {
  let component: BmiKalkulatorComponent;
  let fixture: ComponentFixture<BmiKalkulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BmiKalkulatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BmiKalkulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
