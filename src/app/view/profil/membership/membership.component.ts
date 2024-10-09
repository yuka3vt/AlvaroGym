import { Component, OnInit } from '@angular/core';
import { MembershipService, Membership } from './membership.service';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyFormatPipe } from '../../../currency-format.pipe';

@Component({
  selector: 'app-membership',
  standalone: true,
  providers: [
    MembershipService,
    HttpClientModule
  ],
  imports: [
    CommonModule,
    CurrencyFormatPipe
  ],
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css']
})
export class MembershipComponent implements OnInit {
  membership$: Observable<Membership> = of(null as any);

  constructor(private membershipService: MembershipService) { }

  ngOnInit(): void {
    this.loadMembership();
  }

  loadMembership(): void {
    this.membership$ = this.membershipService.getMembership();
  }
  getRemainingDays(membership: Membership): number {
    if (!membership || !membership.tanggal_akhir) {
      return 0;
    }
    const endDate = new Date(membership.tanggal_akhir);
    const today = new Date();
    const timeDiff = endDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
}
