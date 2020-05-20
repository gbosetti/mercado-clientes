// Implemented by https://github.com/gbosetti
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../_models/user';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

    register(user: User) {

        var formData = new FormData();
            formData.append("nombre", user.firstName);
            formData.append("apellido", user.lastName);
            formData.append("dni", user.username);
            formData.append("mail", user.email);
            formData.append("nro_cel", user.phone);
            formData.append("clave", user.password);
            formData.append("direccion", user.domicilio);
            formData.append("referencia", user.referencia);
            formData.append("barrio", user.barrio);
            formData.append("localidad", user.localidad);

        return new Promise((resolve, reject) => {

            $.ajax({
                url: environment.apiUrl+'registra_usuario.php',
                type: 'post',
                processData: false,
                contentType: false,
                success: function (data) {
                    resolve(data);
                },
                "error": function (request, status) {
                    reject(request.responseText);
                },
                data: formData
            });
        });
    }
}