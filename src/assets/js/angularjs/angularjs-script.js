angular.module('climaApp', []);

angular.module("climaApp")
	.component("pronosticoHoy", {
		template: `<div class="pronostico-hoy">
					  <p>{{ $ctrl.city }}</p>
					  <img class="img-pronostico" ng-src="{{ $ctrl.icon }}">
					  <p>{{ $ctrl.temp }}°</p>
					  <p>{{ $ctrl.descrip }}</p>	
				   </div>`,
		bindings: { 
  			descrip: '@',
  			icon: '@',
  			temp: '@',
  			city: '@',
		}
	});

angular.module("climaApp")
	.component("pronosticoInfo", {
		template: `<div class="pronostico-info">
						<p>{{ $ctrl.fecha }}</p>
						<div class="row">
							<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
								<div class="info-clima">
									<p>Min°/Max°:</p>
									<p>{{ $ctrl.min }}°/{{ $ctrl.max }}°</p>
								</div>
							</div>
							<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
								<div class="info-clima">
									<p>Alba/Ocaso:</p>
									<p>{{ $ctrl.sunrise }}/{{ $ctrl.sunset }}</p>
								</div>
							</div>
						</div>
						<p><strong>Humedad: </strong>{{ $ctrl.hum }}%</p>
						<p><strong>Viento: </strong> {{ $ctrl.wind }} km/h</p>
						<p><strong>Visibilidad: </strong>{{ $ctrl.vis }} m.</p>
						<p><strong>Presión: </strong>{{ $ctrl.press }} mbar.</p>
				   </div>`,
		bindings: { 
			min: 		'@',
			max: 		'@',
			press: 		'@',
			hum: 		'@',
			vis: 		'@',
			wind: 		'@',
			sunrise: 	'@',
			sunset: 	'@',
			fecha: 		'@',
		}
	});

angular.module('climaApp')
	.controller('climaCtrl', function($scope, $http, $timeout) {
		
	  	$scope.descrip 	= "....."
		$scope.icon 	= "public/images/icons/clima_default.png"
		$scope.temp 	= "--"
		$scope.temp_min = "--"
		$scope.temp_max = "--"
		$scope.press 	= "-"
		$scope.hum 		= "-"
		$scope.vis 		= "-"
		$scope.wind 	= "-"
		$scope.sunrise 	= "--:--"
		$scope.sunset 	= "--:--"
		$scope.city 	= "---"

		$scope.error 	= ''
		$scope.errorAdd = ''

		var meses	 	= new Array ("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre")
		var f 			= new Date()
		$scope.fecha 	= f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear()

		var cities 		= [{"name": "Bogota"}, {"name": "Buenos Aires"}, {"name": "Hong Kong"}, 
			{"name": "Nueva York"}, {"name": "Madrid"}, {"name": "Mosku"}, {"name": "Paris"}, 
			{"name": "Roma"}, {"name": "Sidney"}, {"name": "Viena"}]

		$scope.ciudades = []
		angular.forEach(cities, function(value) {
			$http.get('https://api.openweathermap.org/data/2.5/weather?q=' + value.name + '&units=metric&appid=f3f376b99fe63334a561bad62acb4f94').
		        then(function(response){

      			$scope.ciudades.push({
		  			icon: 'public/images/icons/' + response.data.weather[0].icon + '.svg',
		  			temp: Math.round(response.data.main.temp),
		  			temp_min: Math.floor(response.data.main.temp_min),
		  			temp_max: Math.ceil(response.data.main.temp_max),
		  			hum: response.data.main.humidity,
		  			id: response.data.id,
		  			city: response.data.name,
      			})
      		})
		});


		$scope.pronosticoCiudad = function() {

			$http.get('https://api.openweathermap.org/data/2.5/weather?q=' + $scope.buscarCiudad + '&units=metric&appid=f3f376b99fe63334a561bad62acb4f94').
		        then(function(response){

			    $scope.descrip 	= getDescription(response.data.weather[0].icon)
				$scope.icon 	= 'public/images/icons/' + response.data.weather[0].icon + '.svg'
				$scope.temp 	= Math.round(response.data.main.temp)

				$scope.temp_min = Math.floor(response.data.main.temp_min)
				$scope.temp_max = Math.ceil(response.data.main.temp_max)
				$scope.press 	= response.data.main.pressure
				$scope.hum 		= response.data.main.humidity
				$scope.vis 		= response.data.visibility
				$scope.wind 	= response.data.wind.speed
				$scope.city 	= response.data.name

				var sunrise 		= new Date(response.data.sys.sunrise * 1000)
				var sunrise_hours 	= sunrise.getHours()
				var sunrise_minutes = "0" + sunrise.getMinutes()
				$scope.sunrise 		= sunrise_hours + ':' + sunrise_minutes.substr(-2)

				var sunset 			= new Date(response.data.sys.sunset * 1000)
				var sunset_hours 	= sunset.getHours()
				var sunset_minutes 	= "0" + sunset.getMinutes()
				$scope.sunset 		= sunset_hours + ':' + sunset_minutes.substr(-2)

			}, function(response){

				$scope.error 	= "Ciudad no encontrada"
				$scope.descrip 	= "....."
				$scope.icon 	= "public/images/icons/clima_default.png"
				$scope.temp 	= "--"
				$scope.temp_min = "--"
				$scope.temp_max = "--"
				$scope.press 	= "-"
				$scope.hum 		= "-"
				$scope.vis 		= "-"
				$scope.wind 	= "-"
				$scope.sunrise 	= "--:--"
				$scope.sunset 	= "--:--"
				$scope.city 	= "---"

				$timeout(() => $scope.error = '', 3000);

			});
		}

		$scope.addCiudad = ""
		$scope.addCity = function(event) {

			$http.get('https://api.openweathermap.org/data/2.5/weather?q=' + $scope.addCiudad + '&units=metric&appid=f3f376b99fe63334a561bad62acb4f94').
		        then(function(response){

		        	$scope.ciudades.push({
			  			icon: 'public/images/icons/' + response.data.weather[0].icon + '.svg',
			  			temp: Math.round(response.data.main.temp),
			  			temp_min: Math.floor(response.data.main.temp_min),
			  			temp_max: Math.ceil(response.data.main.temp_max),
			  			hum: response.data.main.humidity,
			  			id: response.data.id,
			  			city: response.data.name,
	      			})


			}, function(response){

				$scope.errorAdd = "Ciudad no encontrada"
				$timeout(() => $scope.errorAdd = '', 3000);

			});

		}

		$scope.removeCity = function(event, key) {
			angular.forEach($scope.ciudades, function(value, index) {
				if(value.id == key) {
					$scope.ciudades.splice(index, 1);
				}
			})
		}

	}); //END Controller

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