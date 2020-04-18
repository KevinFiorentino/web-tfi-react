import React from 'react';

/* Subcomponente TRs de la tabla */
class TRCiudades extends React.Component {
    render() {
        return (
	  	    <tr>
		      <th scope="row">{this.props.city}</th>
		      <td className="img-cont-ciudad img-v img-h-ciudad">
		      	<span>{this.props.temp}°</span>
		      	<img className="img-ciudad" src={this.props.icon} />
		      </td>
		      <td>{this.props.min}°/{this.props.max}°</td>
		      <td>{this.props.hum}%</td>
		   	  <td>
		      	<button className="button-del" onClick={this.props.handleDelete.bind(this, this.props.id)} >
		      		<img src="public/images/icons/delete.svg" />
		      	</button>
		  	  </td>
		    </tr>
        )
    } 
}

/* Subcomponente formulario de la tabla */
class FormCiudades extends React.Component {
    render() {
        return (
			<div id="form-pronostico">
				<h3>Agregar ciudad a la lista</h3>	
				<input className="form-control input-react" type="text" name="addCiudad" 
					onChange={this.props.handleChangeInput} value={this.props.value} placeholder="Ingrese una ciudad" />
				<button className="btn btn-success btn-react" onClick={this.props.handleCiudadClick} >Consultar</button>
				<div className="error-ciudad">
					<p>{this.props.error}</p>
				</div>					
			</div>
        )
    } 
}

/* Clase principal para construir el componente */
class AppCiudades extends React.Component {

	/* Constructor, seteo de atributos al inicializar el componente */
	constructor(props) {
		super(props);
		
		/* Seteo eventos del componente */
		this.handleCiudadClick 	= this.handleCiudadClick.bind(this);
		this.handleChangeInput 	= this.handleChangeInput.bind(this);
		this.handleDelete 		= this.handleDelete.bind(this);

		/* Inicializamos los valores por defecto de los atributos del estado */
		this.state = {
			ciudades: 	[],
  			value: 		'',
  			error: 		'',
		};
	}

	/* componentDidMount se ejecuta cuando se inicializa el componente */
	/* Ver ciclo de vida de React */
	componentDidMount() {

		/* Array con ciudades preseleccionadas */
		var cities = new Array ("Bogota", "Buenos Aires", "Hong Kong", "Nueva York", "Madrid", "Mosku", "Paris", "Roma", "Sidney", "Viena");

		{cities.map(ciudad => (

			/* Consumo Web Service del clima con el valor de cada iteración del array cities */
			fetch("https://api.openweathermap.org/data/2.5/weather?q=" + ciudad + "&units=metric&appid=f3f376b99fe63334a561bad62acb4f94")
				.then(response => response.json()) //fetch() requiere formatear el json
				.then((response) => {
						/* Seteo del estado, array de ciudades */
						this.setState ({
							ciudades: [
								/* ... Operador de propagación para extender un array */
								...this.state.ciudades, 
								{
									/* Nuevo objeto en el array con los valores de la API */
									icon: 	'public/images/icons/' + response.weather[0].icon + '.svg',
									temp: 	Math.round(response.main.temp),
						  			min: 	Math.floor(response.main.temp_min),
						  			max: 	Math.ceil(response.main.temp_max),
						  			hum: 	response.main.humidity,
						  			id: 	response.id,
						  			city: 	response.name, 
					  			}
					  		]
						})
				})
		))}

	}

	/* Función que se ejecuta al hacer click en el botón 'Consultar' */
	handleCiudadClick(event) {
		fetch("https://api.openweathermap.org/data/2.5/weather?q=" + this.state.value + "&units=metric&appid=f3f376b99fe63334a561bad62acb4f94")
			.then(response => response.json())
			.then((response) => {
					this.setState ({
						ciudades: [
							...this.state.ciudades, 
							{
								icon: 	'public/images/icons/' + response.weather[0].icon + '.svg',
								temp: 	Math.round(response.main.temp),
					  			min: 	Math.floor(response.main.temp_min),
					  			max: 	Math.ceil(response.main.temp_max),
					  			hum: 	response.main.humidity,
					  			id: 	response.id,
					  			city: 	response.name, 
				  			}
				  		]
					})
				})
			.catch((error) => { 

				this.setState ({
		  			error: "Ciudad no encontrada",
				});	

				setInterval(() => { this.setState ({ error: "", }); }, 3000);	

			});
	}

	/* Función que guarda el valor del input con cada cambio en la variable 'this.state.value' 
      para utilizarse posteriormente en handleCiudadClick() */
	handleChangeInput(event) {
		this.setState({
			value: event.target.value
		});
	}

	/* Función para borrar clima de la tabla */
	handleDelete(id) {
		const ciudad = this.state.ciudades.filter(ciudad => ciudad.id !== id);
    	this.setState({ ciudades: ciudad });
	}

	/* El componente retorna JSX con los subcomponentes pasandole los valores del estado correspondientes a cada uno */
	render() {
		return (
			<React.Fragment>
				<div className="row">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<h3>Pronóstico ciudades del mundo</h3>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<table className="table table-hover-react">
						  <thead>
						    <tr className="col-name">
						      <th scope="col">Ciudad</th>
						      <th scope="col">Actual</th>
						      <th scope="col">Max°/Min°</th>
						      <th scope="col">Humedad</th>
						    </tr>
						  </thead>
						  <tbody>

							  {this.state.ciudades.map(ciudad => (

							  	<TRCiudades
									icon 			= {ciudad.icon}
									temp 			= {ciudad.temp}
									min 			= {ciudad.min}
									max 			= {ciudad.max}
									hum 			= {ciudad.hum}
									city 			= {ciudad.city}
									id 				= {ciudad.id}
									handleDelete 	= {this.handleDelete}
							  	/>

							  ))}

						  </tbody>
						</table>

					</div>
				</div>
				<div className="row">
					<div className="container">
						<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">

							<FormCiudades 
								handleCiudadClick 	= {this.handleCiudadClick}
								error 				= {this.state.error}
								value 				= {this.state.value}
								handleChangeInput 	= {this.handleChangeInput}
							/>

						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default AppCiudades;