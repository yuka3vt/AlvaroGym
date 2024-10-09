import { Component, ElementRef, Renderer2, AfterViewInit, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdukService } from '../../service/produk/produk.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CurrencyFormatPipe } from '../../currency-format.pipe';
import { PaymentService } from '../../service/payment/payment.service';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../service/notification/notification.service';
import { ProfileService } from '../profil/profile/profile.service';
import { ApiResponse } from '../profil/profile/api-response.model';
declare var window: any;

@Component({
  selector: 'app-perpanjang-transaksi',
  providers: [
    ProdukService, 
    CurrencyFormatPipe, 
    PaymentService,
    ProfileService
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    
  ],
  templateUrl: './perpanjang-transaksi.component.html',
  styleUrl: './perpanjang-transaksi.component.css'
})
export class PerpanjangTransaksiComponent implements AfterViewInit, OnInit {
  userProfile: any = {};
  activeForm: string = 'membership';
  formData: any = {
    nama: '',
    username: '',
    telepon: '',
    email: '',
    produk: '',
    coach: '',
    jumlah: ''
  };

  userForm!: FormGroup;
  membershipList: any[] = [];
  trainerList: any[] = [];
  coachList: any[] = [];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private produkService: ProdukService,
    private currencyFormatPipe: CurrencyFormatPipe,
    private paymentService: PaymentService,
    private http: HttpClient,
    private ngZone: NgZone,
    private notificationService:NotificationService,
    private profileService: ProfileService
  ) {}
  ngOnInit() {
    this.loadUserProfile();
    this.route.queryParams.subscribe(params => {
      const type = params['type'];
      if (type) {
        this.selectForm(type);
        this.router.navigate([], {
          queryParams: {
            type: null
          },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      }
    });
    this.userForm = this.fb.group({
      nama: ['', Validators.required],
      produk: ['', Validators.required],
      harga: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telepon: ['', Validators.required],
      coach: [''],
      jumlah: ['', Validators.required]
    });
    this.produkService.getMembershipProduk().subscribe(data => {
      this.membershipList = data.data;
    });
    this.produkService.getTrainerProduk().subscribe(data => {
        this.trainerList = data.data;
    });
    this.produkService.getCoaches().subscribe(data => this.coachList = data.data);
    this.userForm.statusChanges.subscribe(status => {
      this.updateSubmitButtonState();
    });
  }
  selectForm(formType: string) {
    this.updateSubmitButtonState();
    this.activeForm = formType;
    this.formData.produk = '';
    this.formData.coach = '';
    this.formData.jumlah = '';
  }
  onSubmit() {
    if (this.activeForm === 'membership') {
    } 
    else if (this.activeForm === 'trainer') {
    }
  }
  ngAfterViewInit() {
    this.setBackgroundImages('.set-bg');
  }
  private setBackgroundImages(selector: string) {
    const elements = this.el.nativeElement.querySelectorAll(selector);
    elements.forEach((element: HTMLElement) => {
      const bg = element.getAttribute('data-setbg');
      if (bg) {
        this.renderer.setStyle(element, 'background-image', `url(${bg})`);
      }
    });
  }
  onProductChange(event: any): void {
    this.userForm.patchValue({
      nama: this.userProfile.nama,
      username: this.userProfile.username,
      telepon: this.userProfile.telepon,
      email: this.userProfile.email,
    });
    const selectedProductId = Number(event.target.value);
    const selectedProduct = this.activeForm === 'membership'
        ? this.membershipList.find(produk => produk.id === selectedProductId)
        : this.trainerList.find(produk => produk.id === selectedProductId);
    if (selectedProduct) {
        const formattedPrice = this.currencyFormatPipe.transform(selectedProduct.harga);
        this.userForm.patchValue({ harga: formattedPrice });
        this.userForm.patchValue({ jumlah: selectedProduct.harga });
    }
  }
  private updateSubmitButtonState(): void {
    const invalid = this.userForm.invalid;
    this.userForm.get('submitButton')?.patchValue({ disabled: invalid });
  }
  pay() {
    if (this.userForm.invalid) {
      return;
    }
    const transactionData = {
      order_id: 'order-' + Math.floor(Math.random() * 1000000),
      gross_amount: this.userForm.get('jumlah')?.value,
      customer_details: {
        first_name: this.userForm.get('nama')?.value.split(' ')[0],
        last_name: this.userForm.get('nama')?.value.split(' ').slice(1).join(' '),
        email: this.userForm.get('email')?.value,
        phone: this.userForm.get('telepon')?.value
      }
    };
    this.paymentService.createTransaction(transactionData).subscribe(response => {
      if (response.status === 'success') {
        if (window.snap && window.snap.pay) {
          window.snap.pay(response.data.token, {
            onSuccess: (result: any) => {
              this.ngZone.run(() => {
                const apiPayload = {
                  nama: this.userForm.get('nama')?.value,
                  username: this.userForm.get('username')?.value,
                  email: this.userForm.get('email')?.value,
                  telepon: this.userForm.get('telepon')?.value,
                  produk: this.userForm.get('produk')?.value,
                  coach: this.userForm.get('coach')?.value || null,
                  jumlah: this.userForm.get('jumlah')?.value,
                };
                this.http.post<any>(environment.apiUrl + '/api/perpanjang-transaksi/', apiPayload)
                  .subscribe(apiResponse => {
                    if (apiResponse?.status === 'success') {
                      this.router.navigate(['/profil']);
                      this.notificationService.showSuccess('Berhasil bergabung', `Pembyaran kamu berhasil dilakukan`);
                    } else {
                    }
                  });
              });
            },
            onPending: (result: any) => {},
            onError: (result: any) => {
            }
          });
        }
      }
    });
  }
  loadUserProfile() {
    this.profileService.getUserProfile().subscribe(
      (data: ApiResponse) => {
        this.userProfile = data.data;
      },
      error => {
        console.error('Error fetching user profile', error);
      }
    );
  }
}
