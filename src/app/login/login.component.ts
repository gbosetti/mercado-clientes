import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';
declare var bootbox: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	loginForm: FormGroup;
	loading = false;
	submitted = false;
	returnUrl: string;

	constructor(
	    private formBuilder: FormBuilder,
	    private route: ActivatedRoute,
	    private router: Router,
	    private authenticationService: AuthenticationService) { }

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
		    username: ['', Validators.required],
		    password: ['', Validators.required]
		});

		this.returnUrl = '/'; //this.route.snapshot.queryParams['returnUrl'] || '/';
		$('input:text:visible:first').focus();
		$('.recover-pass').on('click', ()=>{ this.recoverPass() });
	}

	recoverPass(){

		var dni = this.f.username.value.trim();
		if (dni == undefined || dni == ''){
			bootbox.alert({ message: "Por favor, ingrese su DNI e intente nuevamente." });
		}
		else {
			$('#overlay-spinner').fadeIn();
			this.authenticationService.recoverPass(dni).then(msg=>{
				$('#overlay-spinner').fadeOut();
				bootbox.alert({ message: msg });
			}, errorMessage => {
				$('#overlay-spinner').fadeOut();
	            bootbox.alert({ message: errorMessage });
	            this.loading = false;
	        });
		}
	}

	// convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value.trim(), this.f.password.value).then(userData => {
            this.router.navigate(['/home']);
        }, errorMessage => {
            bootbox.alert({ message: errorMessage });
            this.loading = false;
        });
    }
}
