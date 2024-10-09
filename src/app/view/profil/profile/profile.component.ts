import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

interface ApiResponse<T> {
  status: string;
  status_code: number;
  message: string;
  data: T;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  providers:[
    ProfileService,
    HttpClientModule,
  ],
  imports:[
    CommonModule,
    FormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  userProfile: any = {};
  password: string = '';
  repeatPassword: string = '';

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.profileService.getUserProfile().subscribe(
      (data: ApiResponse<any>) => {
        this.userProfile = data.data;
      },
      error => {
        console.error('Error fetching user profile', error);
      }
    );
  }

  updateProfile() {
    if (this.password !== this.repeatPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password mismatch',
        text: 'The passwords do not match.'
      });
      return;
    }
    if (this.password && this.password.length < 8) {
      Swal.fire({
        icon: 'error',
        title: 'Password too short',
        text: 'The password must be at least 8 characters long.'
      });
      return;
    }
    const updatedProfile = {
      nama: this.userProfile.nama,
      email: this.userProfile.email,
      telepon: this.userProfile.telepon,
      gender: this.userProfile.gender,
      password: this.password
    };
    this.profileService.updateUserProfile(updatedProfile).subscribe(
      (response: ApiResponse<any>) => {
        Swal.fire({
          icon: 'success',
          title: 'Profile updated',
          text: response.message
        }).then(() => {
          this.router.navigate(['/profil']);
        });
        this.loadUserProfile();
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Update failed',
          text: 'An error occurred while updating the profile.'
        }).then(() => {
          this.router.navigate(['/profil']);
        });
      }
    );
  }
}