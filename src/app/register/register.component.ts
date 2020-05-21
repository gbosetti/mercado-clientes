// Implemented by https://github.com/gbosetti
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService } from '../_services/user.service';
import { AuthenticationService } from '../_services/authentication.service';
declare var bootbox: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
    	$('input:text:visible:first').focus();
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', Validators.required],
            phone: ['', Validators.required],
            domicilio: ['', Validators.required],
            barrio: ['', Validators.required],
            localidad: ['', Validators.required],
            referencia: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]]
        });
        $('input:text:visible:first').focus();
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.userService.register(this.registerForm.value).then(
            data => {
                this.router.navigate(['/login']).then(()=>{
                  bootbox.alert({ message: 'Se ha registrado correctamente.' });
                });
            },
            error => {
                bootbox.alert({ message: error });
                this.loading = false;
            }
        );
    }
}

