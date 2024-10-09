import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  loginForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
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
  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const { username, password } = this.loginForm.value;
    this.http.post<any>(`${environment.apiUrl}/api/login/`, { username, password })
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            localStorage.setItem('username', this.loginForm.get('username')?.value);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            this.router.navigate(['/home']); 
            Swal.fire({
              title: 'Berhasil!',
              text: 'Berhasil Login! Hii ' + this.loginForm.get('username')?.value,
              icon: 'success',
              confirmButtonText: 'OK'
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Username atau Password Salah',
              icon: 'error',
              confirmButtonText: 'OK'
            }).then(() => {
              this.loginForm.get('password')?.setValue('');
            });
          }
        },
        error: (error) => {
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          }).then(() => {
            this.loginForm.get('password')?.setValue('');
          });
        }
      }
    );
  }
}
