var meses 	= new Array ("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre")
var f 		= new Date()
var fecha 	= f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear()

$('.pronostico-info p').first().html(fecha)

$('#buscarCiudad').click(function(){

	var buscar = $("input[type=text][name=buscar]").val()

	$.get("https://api.openweathermap.org/data/2.5/weather?q=" + buscar + "&units=metric&appid=f3f376b99fe63334a561bad62acb4f94", 
		function(response, status){

		var sunrise 			= new Date(response.sys.sunrise * 1000)
		var sunrise_hours 		= sunrise.getHours()
		var sunrise_minutes 	= "0" + sunrise.getMinutes()
		sunrise 				= sunrise_hours + ':' + sunrise_minutes.substr(-2)

		var sunset 				= new Date(response.sys.sunset * 1000)
		var sunset_hours 		= sunset.getHours()
		var sunset_minutes 		= "0" + sunset.getMinutes()
		sunset 					= sunset_hours + ':' + sunset_minutes.substr(-2)

		$('.pronostico-hoy')
			.html(`
				<p>` + response.name + `</p>
				<img class="img-pronostico" src="public/images/icons/` + response.weather[0].icon + `.svg">
				<p>` + Math.round(response.main.temp) + `°</p>
				<p>` + getDescription(response.weather[0].icon) + `</p>
			`)

		$('.pronostico-info')
			.html(`
				<p>` + fecha + `</p>
				<div class="row">
					<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
						<div class="info-clima">
							<p>Min°/Max°:</p>
							<p>` + Math.floor(response.main.temp_min) + `°/` + Math.ceil(response.main.temp_max) + `°</p>
						</div>
					</div>
					<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
						<div class="info-clima">
							<p>Alba/Ocaso:</p>
							<p>` + sunrise + `/` + sunset + `</p>
						</div>
					</div>
				</div>
				<p><strong>Humedad: </strong>` + response.main.humidity + `%</p>
				<p><strong>Viento: </strong> ` + response.wind.speed + ` km/h</p>
				<p><strong>Visibilidad: </strong>` + response.visibility + ` m.</p>
				<p><strong>Presión: </strong>` + response.main.pressure + ` mbar.</p>
			`)

	}).fail(function() {

		$('.error-ciudad').first().html('<p>Ciudad no encontrada</p>')

		$('.pronostico-hoy')
			.html(`
				<p>---</p>
				<img class="img-pronostico" src="public/images/icons/clima_default.png">
				<p>--°</p>
				<p>.....</p>
			`)

		$('.pronostico-info')
			.html(`
				<p>` + fecha + `</p>
				<div class="row">
					<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
						<div class="info-clima">
							<p>Min°/Max°:</p>
							<p>--°/--°</p>
						</div>
					</div>
					<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
						<div class="info-clima">
							<p>Alba/Ocaso:</p>
							<p>--:--/--:--</p>
						</div>
					</div>
				</div>
				<p><strong>Humedad: </strong>-%</p>
				<p><strong>Viento: </strong> - km/h</p>
				<p><strong>Visibilidad: </strong>- m.</p>
				<p><strong>Presión: </strong>- mbar.</p>				
			`)

		setTimeout(function(){ 
			$('.error-ciudad').html('<p></p>'); 
		}, 3000);

	});
})

function getDescription(icon) {
	switch(icon) {
		case '01d': case '01n': {
			return "Cielo despejado";
		};break;
		case '02d': case '02n': {
			return "Algunas nubes";
		};break;
		case '03d': case '03n': {
			return "Nublado";
		};break;
		case '04d': case '04n': {
			return "Nublado";
		};break;
		case '09d': case '09n': {
			return "Probabilidad de lluvias";
		};break;
		case '10d': case '10n': {
			return "Lluvioso";
		};break;
		case '11d': case '11n': {
			return "Tormenta eléctrica";
		};break;
		case '13d': case '13n': {
			return "Nevadas";
		};break;
		case '50d': case '50n': {
			return "Niebla";
		};break;
	}
}


var cities = [{"name": "Bogota"}, {"name": "Buenos Aires"}, {"name": "Hong Kong"}, {"name": "Nueva York"}, {"name": "Madrid"}, {"name": "Mosku"}, {"name": "Paris"}, {"name": "Roma"}, {"name": "Sidney"}, {"name": "Viena"}]

$.each(cities, function(index, value){
	$.get("https://api.openweathermap.org/data/2.5/weather?q=" + value.name + "&units=metric&appid=f3f376b99fe63334a561bad62acb4f94", 
		function(response, status){

		$('#tablaCiudades').append(`
					    <tr id="` + response.id + `">
					      <th scope="row">` + response.name + `</th>
					      <td class="img-cont-ciudad img-v img-h-ciudad">
					      	<span>` + Math.round(response.main.temp) + `°</span>
					      	<img class="img-ciudad" src="public/images/icons/` + response.weather[0].icon + `.svg">
					      </td>
					      <td>` + Math.floor(response.main.temp_min) + `°/` + Math.ceil(response.main.temp_max) + `°</td>
					      <td>` + response.main.humidity + `%</td>
					   	  <td>
					      	<button onclick="removeCity(` + response.id + `)" class="button-del">
					      		<img src="public/images/icons/delete.svg">
					      	</button>
					  	  </td>
					    </tr>
					    `);
	})
});

function removeCity(id) {
	$('#' + id).remove();
}

function addCity() {

	var addCiudad = $("input[type=text][name=addCiudad]").val()

	$.get("https://api.openweathermap.org/data/2.5/weather?q=" + addCiudad + "&units=metric&appid=f3f376b99fe63334a561bad62acb4f94", 
		function(response, status){

		$('#tablaCiudades').append(`
					    <tr id="` + response.id + `">
					      <th scope="row">` + response.name + `</th>
					      <td class="img-cont-ciudad img-v img-h-ciudad">
					      	<span>` + Math.round(response.main.temp) + `°</span>
					      	<img class="img-ciudad" src="public/images/icons/` + response.weather[0].icon + `.svg">
					      </td>
					      <td>` + Math.floor(response.main.temp_min) + `°/` + Math.ceil(response.main.temp_max) + `°</td>
					      <td>` + response.main.humidity + `%</td>
					   	  <td>
					      	<button onclick="removeCity(` + response.id + `)" class="button-del">
					      		<img src="public/images/icons/delete.svg">
					      	</button>
					  	  </td>
					    </tr>
					    `);

	}).fail(function() {

		$('.error-ciudad').last().html('<p>Ciudad no encontrada</p>')

		setTimeout(function(){ 
			$('.error-ciudad').html('<p></p>'); 
		}, 3000);

	})

}