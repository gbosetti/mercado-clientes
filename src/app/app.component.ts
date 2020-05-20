// Implemented by https://github.com/gbosetti
import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './_services/authentication.service';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mercado-clientes';
  currentUser: User;

	constructor(
	    private router: Router,
	    private authenticationService: AuthenticationService
	) {
	    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
	}

	logout() {
	    this.authenticationService.logout();
	    this.router.navigate(['/login']);
	}

	myOrders(){
		this.router.navigate(['/orders']);
		return false;
	}

	myData(){
		return;
		//this.router.navigate(['/my-data']);
	}
}
