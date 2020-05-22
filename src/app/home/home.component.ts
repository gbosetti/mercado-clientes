import { Component, OnInit } from '@angular/core';
import { CombosService } from '../_services/combos.service';
import { AuthenticationService } from '../_services/authentication.service';
declare var bootbox: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private combosPedidos;

  constructor(private combosService: CombosService, private authenticationService: AuthenticationService) { }

  getCurrentDni(){
  	return (<any>this.authenticationService.currentUser.source).getValue()["id"];
  }

  ngOnInit() {
  	this.initSelectedCombos();
  	this.loadCircuits(); 
  	this.loadCategories(); 
  	$("#circuit").on("change", ()=>{ this.loadCombos(); this.initSelectedCombos(); });
  	$("#categories").on("change", ()=>{ this.loadCombos() });
  	$("#combos").on("click", ".add-to-cart", (evt)=>{ this.addToCart($(evt.target)) });
  	$(".combos-pedidos").on("click", ".remove-from-cart", (evt)=>{ evt.target.parentElement.parentElement.remove() });
  	$("#registerOrder").on("click", (evt)=>{ this.registerOrder(); });
  	
  }

  initSelectedCombos(){

  	$(".combos-pedidos").html("Aún no agregó combos a su carrito.");
  }

  addToCart(target){

  	if($(".combos-pedidos li").length<=0)
  		$(".combos-pedidos").html('');

  	var combo = $(`<li data-id="${target.attr("id")}" href="#" class="list-group-item list-group-item-action flex-column align-items-start">
		<div class="d-flex w-100 justify-content-between">
			<h5 class="mb-1">${target.attr("combo_nombre")} ($ ${target.attr("combo_precio")})</h5>
		</div>
		<i><small>${target.attr("detalle")}</small></i>
		<div class="btn-group mt-3" role="group" style="width: 100%">
		  <button type="button" class="btn btn-secondary remove-from-cart"><i class="fa fa-remove" aria-hidden="true"></i> Eliminar</button>
		</div>
	</li>`);
  	$(".combos-pedidos").append(combo);
  }

  registerOrder(){

  	var combos = "", id_combo, combos_length=1;
  	$(".combos-pedidos li").each((id, combo: any) => {
  		combos = combos + '{"id_combo":' + combo.getAttribute("data-id") + ', "cantidad": 1 }] ';
  		id_combo = combo.getAttribute("data-id");
  		combos_length = combos_length + 1;
  	});

  	var dni = this.getCurrentDni();

	if(dni == undefined || id_combo == undefined){
	  bootbox.alert({ message: "Por favor, completar todos los campos requeridos para efectuar el pedido." });
	  return false;
	}

	bootbox.confirm({
		title: "Advertencia",
	    message: "Una vez registrado, el pedido no puede ser modificado ni cancelado. ¿Estas seguro de querer registrar el pedido?",
	    buttons: {
	        confirm: {
	            label: '<i class="fa fa-check" aria-hidden="true"></i> Si',
	            className: 'btn-primary'
	        },
	        cancel: {
	            label: '<i class="fa fa-times" aria-hidden="true"></i> No',
	            className: 'btn-secondary'
	        }
	    },
	    callback: (result) => {
	    	if(result){
  		    this.combosService.createPedido(dni, combos, id_combo, combos_length).then((msg: any) =>{ 
  				   bootbox.alert({ message: msg });
  				   this.clearMyCart(msg);
  				}, msg =>{
  				   bootbox.alert({ message: msg })
  				});
		    }
	    }
	});
  }

  clearMyCart(msg){

  	$(".combos-pedidos").html(msg);
  }

  loadCategories(){
  	
  	 this.combosService.getCategories().then((categories: Array<any>)=>{

    	$("#categories").html('');
    	categories.forEach(e => {
        	$("#categories").append(this.createCategory(e));
        });
        $("#categories").append($(`<option value="-1" selected>Todas las categorias</option>`));
    });
  }

  createCategory(category){
  	return $(`<option value="${category.id}">${category.nombre_categoria}</option>`);
  }

  loadCircuits(){

  	return new Promise((resolve, reject) => {

        this.combosService.getOpenCircuits().then((circuits: Array<any>)=>{

        	$("#circuit").html('');
        	circuits.forEach(e => {
        		if(parseInt(e["habilitado"])==1)
	        		$("#circuit").append(this.createCircuit(e));
	        });
	        $("#circuit").append($(`<option value="" disabled selected>Seleccione el circuito</option>`));
	        resolve();
        });
    }); 
  }

  loadCombos(){

  	$('#overlay-spinner').fadeIn();
      var formattedData = [];
      var circuito = $("#circuit").val();
      if (circuito == null) return;

      var category = $("#categories").val();
      if (category == null) return;

      $("#combos").html('');

      this.combosService.getEnabledCombos(circuito, category).then((combos: Array<any>) => {

        combos.forEach(e => {

        	var products="";
        	(<any>e['products']).forEach(prod => products = products + prod["prod_nombre"] + " (x" + prod["prod_cantidad"] + "), ");
        	e["detalle"] = products;
        	$("#combos").append(this.createCombo(e));
        	
        });
        $('#overlay-spinner').fadeOut();
      });
    }

  createCircuit(circuit){
  	return $(`<option value="${circuit.id}">${circuit.nombre}</option>`);
  }

  createCombo(combo){

  	return $(`<li href="#" class="list-group-item list-group-item-action flex-column align-items-start">
		<div class="d-flex w-100 justify-content-between">
			<h5 class="mb-1">${combo.combo_nombre} ($ ${combo.combo_precio})</h5>
		</div>
		<i><small>${combo.detalle}</small></i>
		<div class="btn-group mt-3" role="group" style="width: 100%">
		  <button combo_nombre="${combo.combo_nombre}" combo_precio="${combo.combo_precio}" detalle="${combo.detalle}" id="${combo.combo_id}" type="button" class="btn btn-secondary add-to-cart"><i class="fa fa-shopping-cart" aria-hidden="true"></i> Agregar al carrito</button>
		</div>
	</li>`);
  }

}
