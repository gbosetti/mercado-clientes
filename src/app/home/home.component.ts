import { Component, OnInit } from '@angular/core';
import { CombosService } from '../_services/combos.service';
import { AuthenticationService } from '../_services/authentication.service';


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
  	this.loadCircuits(); 
  	this.loadCategories(); 
  	$("#circuit").on("click", ()=>{ this.loadCombos() });
  	$("#categories").on("click", ()=>{ this.loadCombos() });
  	$("#combos").on("click", ".add-to-cart", (evt)=>{ this.addToCart($(evt.target)) });
  	$(".combos-pedidos").on("click", ".remove-from-cart", (evt)=>{ evt.target.parentElement.parentElement.remove() });
  	$("#registerOrder").on("click", (evt)=>{ this.registerOrder(); });
  	
  }

  addToCart(target){

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

  	var combos = "", id_combo, combos_length=0;
  	$(".combos-pedidos li").each((id, combo: any) => {
  		console.log(combo);
  		combos = combos + '{"id_combo":' + combo.getAttribute("data-id") + ', "cantidad": 1 }]';
  		id_combo = combo.getAttribute("data-id");
  		combos_length =+1;
  	});

  	var dni = this.getCurrentDni();

	if(dni == undefined || id_combo == undefined){
	  alert("Por favor, completar todos lso campos requeridos para efectuar el pedido.");
	  return false;
	}

	this.combosService.createPedido(dni, combos, id_combo, combos_length).then((msg: any) =>{ 
	   alert(msg);
	}, msg =>{
	   alert(msg);
	}).finally(()=>{ this.clearMyCart(); });
  }

  clearMyCart(){

  	$(".combos-pedidos").html("");
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
