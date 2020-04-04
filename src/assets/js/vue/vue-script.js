Vue.component('pronostico-hoy', {
	props: ['descrip', 'icon', 'temp', 'city', 'id'],
	template: `<div class="pronostico-hoy">
					<p>{{ city }}</p>
					<img class="img-pronostico" v-bind:src="icon">
					<p>{{ temp }}°</p>
					<p>{{ descrip }}</p>
			  </div>`
})

Vue.component('pronostico-info', {
	props: ['temp_min', 'temp_max', 'press', 'hum', 'vis', 'wind', 'sunrise', 'sunset', 'id', 'fecha'],
	template: `<div class="pronostico-info">
					<p>{{ fecha }}</p>
					<div class="row">
						<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
							<div class="info-clima">
								<p>Min°/Max°:</p>
								<p>{{ temp_min }}°/{{ temp_max }}°</p>
							</div>
						</div>
						<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
							<div class="info-clima">
								<p>Alba/Ocaso:</p>
								<p>{{ sunrise }}/{{ sunset }}</p>
							</div>
						</div>
					</div>
					<p><strong>Humedad: </strong>{{ hum }}%</p>
					<p><strong>Viento: </strong>{{ wind }} km/h</p>
					<p><strong>Visibilidad: </strong>{{ vis }} m.</p>
					<p><strong>Presión: </strong>{{ press }} mbar.</p>
			  </div>`
})


var kevin = new Vue({
  	el: '#clima',
  	data: {
  		buscar_ciudad: 	'',
  		add_ciudad: 	'',
  		error: 			'',
  		errorCity: 		'',
  		pronostico: [
  			{ 	
	  			descrip: 	'.....',
	  			icon: 		'public/images/icons/clima_default.png',
	  			temp: 		'--',
	  			temp_min: 	'--',
	  			temp_max: 	'--',
	  			press: 		'-',
	  			hum: 		'-',
	  			vis: 		'-',
	  			wind: 		'-',
	  			sunrise: 	'--:--',
	  			sunset: 	'--:--',
	  			id: 		0,
	  			city: 		'---',
	  			fecha: 		'---',
  			}
  		],
  		ciudades: []
  	},

  	created: function () {
		var meses 					= new Array ("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre")
		var f 						= new Date()
		this.pronostico[0].fecha 	= f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear()

		var cities = new Array ("Bogota", "Buenos Aires", "Hong Kong", "Nueva York", "Madrid", "Mosku", "Paris", "Roma", "Sidney", "Viena")

		cities.forEach((value) => {
	    	this.$http.get('https://api.openweathermap.org/data/2.5/weather?q=' + value + '&units=metric&appid=f3f376b99fe63334a561bad62acb4f94')
	      		.then(response => {

      			this.ciudades.push({
		  			icon: 'public/images/icons/' + response.data.weather[0].icon + '.svg',
		  			temp: Math.round(response.data.main.temp),
		  			temp_min: Math.floor(response.data.main.temp_min),
		  			temp_max: Math.ceil(response.data.main.temp_max),
		  			hum: response.data.main.humidity,
		  			id: response.data.id,
		  			city: response.data.name,
      			})
      			
      		})
		})
  	},

	methods: {
		pronostico_ciudad: function (event) {

	    	this.$http.get('https://api.openweathermap.org/data/2.5/weather?q=' + this.buscar_ciudad + '&units=metric&appid=f3f376b99fe63334a561bad62acb4f94')
	      		.then(response => {

		        this.pronostico[0].descrip 	= this.getDescription(response.data.weather[0].icon)
				this.pronostico[0].icon 	= 'public/images/icons/' + response.data.weather[0].icon + '.svg'
				this.pronostico[0].temp 	= Math.round(response.data.main.temp)
				this.pronostico[0].temp_min = Math.floor(response.data.main.temp_min)
				this.pronostico[0].temp_max = Math.ceil(response.data.main.temp_max)
				this.pronostico[0].press 	= response.data.main.pressure
				this.pronostico[0].hum 		= response.data.main.humidity
				this.pronostico[0].vis 		= response.data.visibility
				this.pronostico[0].wind 	= response.data.wind.speed
				this.pronostico[0].id 		= response.data.id
				this.pronostico[0].city 	= response.data.name

				var sunrise 				= new Date(response.data.sys.sunrise * 1000)
				var sunrise_hours 			= sunrise.getHours()
				var sunrise_minutes 		= "0" + sunrise.getMinutes()
				this.pronostico[0].sunrise 	= sunrise_hours + ':' + sunrise_minutes.substr(-2)

				var sunset 					= new Date(response.data.sys.sunset * 1000)
				var sunset_hours 			= sunset.getHours()
				var sunset_minutes 			= "0" + sunset.getMinutes()
				this.pronostico[0].sunset 	= sunset_hours + ':' + sunset_minutes.substr(-2)
	        
      		}, response => {

      			this.error = "Ciudad no encontrada"
      			this.pronostico[0].descrip 	= '.....'
				this.pronostico[0].icon 	= 'public/images/icons/clima_default.png'
				this.pronostico[0].temp 	= '--'
				this.pronostico[0].temp_min = '--'
				this.pronostico[0].temp_max = '--'
				this.pronostico[0].press 	= '-'
				this.pronostico[0].hum 		= '-'
				this.pronostico[0].vis 		= '-'
				this.pronostico[0].wind 	= '-'
				this.pronostico[0].id 		= 0
				this.pronostico[0].city 	= '---'
				this.pronostico[0].sunrise 	= '--:--'
				this.pronostico[0].sunset 	= '--:--'

      			setTimeout(() => this.error = "", 3000);

      		});
		},

		getDescription: function (icon) {
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
		},

		addCity: function (event) {

	    	this.$http.get('https://api.openweathermap.org/data/2.5/weather?q=' + this.add_ciudad + '&units=metric&appid=f3f376b99fe63334a561bad62acb4f94')
	      		.then(response => {

      			this.ciudades.push( {
		  			icon: 'public/images/icons/' + response.data.weather[0].icon + '.svg',
		  			temp: Math.round(response.data.main.temp),
		  			temp_min: Math.floor(response.data.main.temp_min),
		  			temp_max: Math.ceil(response.data.main.temp_max),
		  			hum: response.data.main.humidity,
		  			id: response.data.id,
		  			city: response.data.name,
      				}
      			)
	        
      		}, response => {

      			this.errorCity = "Ciudad no encontrada"
				setTimeout(() => this.errorCity = "", 3000);

      		});
		},
		
		removeCity: function (event, key) {
			this.ciudades.forEach((value, index) => {
				if(value.id == key) {
					this.$delete(this.ciudades, index)
				}
			})
   		},

	} //END Methods

})