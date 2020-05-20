// Implemented by https://github.com/gbosetti
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class CombosService {

    constructor(private http: HttpClient) {}

    createPedido(dni, pedidosPorCombo, id_any_combo, length){

        var formData = new FormData();
            formData.append("id_cliente", dni);
            formData.append("datos", pedidosPorCombo);
            formData.append("id_combo_envia", id_any_combo); // Cualquier id de combo pedido, parece que es para saber el circuito...
            formData.append("item", length); // Parece que es la cantidad de elementos en el array

        return new Promise((resolve, reject) => {

            $.ajax({
                url: environment.apiUrl+'insert_pedidos.php',
                type: 'post',
                processData: false,
                contentType: false,
                success: function (msj) {
                    resolve(msj);
                },
                "error": function (request, status) {
                    reject(request.responseText);
                },
                data: formData
            });
        });
    }

    getEnabledCombos(circuitId, categoryId) {

        return new Promise((resolve, reject) => {

            var formData = new FormData();
            formData.append("id_circuito", circuitId);
            formData.append("id_categoria", categoryId);

            $.ajax({
                url: environment.apiUrl+'combos_by_circuit_and_category.php',
                type: 'post',
                processData: false,
                contentType: false,
                success: function (data) {
                    resolve(JSON.parse(data));
                },
                error: function (request, status, error) {
                    reject(request.responseText);
                },
                data: formData
            });
        }); 
    }

    getOrders(dni){

        return new Promise((resolve, reject) => {

            var formData = new FormData();
            formData.append("id", dni);

            $.ajax({
                url: environment.apiUrl+'pedidos_usuario.php',
                type: 'post',
                processData: false,
                contentType: false,
                success: function (data) {
                    resolve(JSON.parse(data));
                },
                error: function (request, status, error) {
                    reject(request.responseText);
                },
                data: formData
            });
        });   
    }

    getCategories(){

        return new Promise((resolve, reject) => {

            $.ajax({
                "url": environment.apiUrl+'categoria_articulos_all.php',
                "type": 'get',
                "processData": false,
                "contentType": false,
                success: function (data) {
                    resolve(JSON.parse(data));
                },
                error: function (request, status, error) {
                    reject(error);
                }
            });
        });   
    }

    getOpenCircuits() {

        return new Promise((resolve, reject) => {
            $.ajax({
                dataType: "json",
                url: environment.apiUrl+"circuitos_activos.php", //`${config.apiUrl}/combos/combos_por_circuito`
                success: function(data) {
                    resolve(data);
                }
            });
        });
    }

    getProductsForCombo(id){

        return new Promise((resolve, reject) => {

            var formData = new FormData();
            formData.append("id", id);

            $.ajax({
                url: environment.apiUrl+'productos_del_combo.php',
                type: 'post',
                processData: false,
                contentType: false,
                success: function (data) {
                    resolve(JSON.parse(data));
                },
                error: function (request, status, error) {
                    reject(request.responseText);
                },
                data: formData
            });
        });  
    }

    getProducts() {

        return new Promise((resolve, reject) => {

            //var formData = new FormData();
            //formData.append("id_circuito", circuitId);

            $.ajax({
                url: environment.apiUrl+'productos_all.php',
                type: 'get',
                processData: false,
                contentType: false,
                success: function (data) {
                    data = JSON.parse(data);
                    resolve(data);
                },
                error: function (request, status, error) {
                    reject([]);
                }//,
                //data: formData
            });
        }); 
    }
}