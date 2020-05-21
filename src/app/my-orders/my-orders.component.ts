import { Component, OnInit } from '@angular/core';
import { CombosService } from '../_services/combos.service';
import { AuthenticationService } from '../_services/authentication.service';


@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  constructor(private combosService: CombosService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
  	this.loadOrders();
  }

  getCurrentDni(){
  	return (<any>this.authenticationService.currentUser.source).getValue()["id"];
  }

  createOrder(order){

  	var detalle = '';
  	(order.combos_del_pedido).forEach(combo =>{
  		detalle = detalle + combo.nombre_combo + " (" + combo.cantidad + "x$" + combo.precio_individual + ")<br/>";
  	});

  	return $(`<li href="#" class="list-group-item list-group-item-action flex-column align-items-start">
		<h5>${order.fechahora}</h5>
		<div class="d-flex w-100 justify-content-between">
			<p class="mb-1">${detalle}</p>
		</div>
		Total: $ ${order.total_pedido}
	</li>`);
  }

  loadOrders(){

  	$('#overlay-spinner').fadeIn();
  	this.combosService.getOrders(this.getCurrentDni()).then((orders: Array<any>)=>{

  		$("#my-orders").html('');
    	orders.forEach(order => {
        	$("#my-orders").append(this.createOrder(order));
        });
        $('#overlay-spinner').fadeOut();
  	});
  }

}
