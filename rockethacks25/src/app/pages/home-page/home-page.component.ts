import { Component } from '@angular/core';
import { LoginComponent } from '../../components/login/login.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [LoginComponent, RouterModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {}
