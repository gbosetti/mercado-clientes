// Implemented by https://github.com/gbosetti
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../_models/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(dni, password) {

        var formData = new FormData();
            formData.append("dni", dni);
            formData.append("password", password);

        var self = this;

        return new Promise((resolve, reject) => {
            $.ajax({
                "url": environment.apiUrl + 'authenticate_client.php',
                "type": 'post',
                "processData": false,
                "contentType": false,
                "success": function (data) {
                    console.log('retrieved', data);
                    data = JSON.parse(data);

                    if ('dni' in data) {

                        var user = new User();
                            user["id"] = data["dni"];
                            user["username"] = data["dni"];
                            user["firstName"] = data["nombre"];
                            user["lastName"] = data["apellido"];
                            user["token"] = 'fake-jwt-token';
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        self.currentUserSubject.next(user);
                        resolve(user);
                    }
                    else {reject('No se ha podido iniciar sesión. Su usuario puede no estar habilitado, o bien el DNI o la contraseña son invalidos.');};
                },
                "error": function (request, status) {
                    reject(request.responseText);
                },
                "data": formData
            });
        }); 
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}