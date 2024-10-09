import { Component, OnInit } from '@angular/core';
import { TrainerService, TrainerSession } from './trainer.service';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CurrencyFormatPipe } from '../../../currency-format.pipe';

@Component({
  selector: 'app-trainer',
  standalone: true,
  providers : [
    TrainerService,
    CurrencyFormatPipe
  ],
  imports: [
    CommonModule,
    CurrencyFormatPipe
  ],
  templateUrl: './trainer.component.html',
  styleUrl: './trainer.component.css'
})
export class TrainerComponent implements OnInit {
  
  trainerSession$: Observable<TrainerSession> = of(null as any);

  constructor(private trainerService: TrainerService) { }

  ngOnInit(): void {
    this.loadTrainerSession();
  }

  loadTrainerSession(): void {
    this.trainerSession$ = this.trainerService.getTrainerSession();
  }
}
