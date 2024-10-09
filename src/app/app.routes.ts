import { Routes } from '@angular/router';
import { HomeComponent } from './view/home/home.component';
import { HubungiComponent } from './view/hubungi/hubungi.component';
import { TentangKamiComponent } from './view/tentang-kami/tentang-kami.component';
import { BmiKalkulatorComponent } from './view/bmi-kalkulator/bmi-kalkulator.component';
import { BlogComponent } from './view/blog/blog.component';
import { BlogDetailComponent } from './view/blog-detail/blog-detail.component';
import { NotFoundComponent } from './view/not-found/not-found.component';
import { PembelianPaketGymComponent } from './view/pembelian-paket-gym/pembelian-paket-gym.component';
import { LoginComponent } from './view/login/login.component';
import { AuthGuard } from './auth.guard';
import { ProfilComponent } from './view/profil/profil.component';
import { PerpanjangTransaksiComponent } from './view/perpanjang-transaksi/perpanjang-transaksi.component';
import { NoAuthGuard } from './no-auth.guard';
export const routes: Routes = [
    { path: 'home', component: HomeComponent},
    { path: 'blog', component: BlogComponent,},
    { path: 'sign-in', component: LoginComponent, canActivate: [NoAuthGuard]},
    { path: '404', component: NotFoundComponent },
    { path: 'hubungi', component: HubungiComponent},
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'blog/:slug', component: BlogDetailComponent},
    { path: 'tentang-kami', component: TentangKamiComponent},
    { path: 'pembelian', component: PembelianPaketGymComponent},
    { path: 'bmi-kalkulator', component: BmiKalkulatorComponent},
    { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard]},
    { path: 'perpanjang', component: PerpanjangTransaksiComponent, canActivate: [AuthGuard]},
    { path: '**', redirectTo: '/404' }
];
