import React from 'react';

class FormPronostico extends React.Component {
    render() {
        return (
      <div id="form-pronostico">
        <input className="form-control input-react" type="text" name="valueCiudad" 
          onChange={this.props.handleChangeInput} value={this.props.value} placeholder="Ingrese una ciudad" />
        <button className="btn btn-success btn-react" onClick={this.props.handleClimaClick} >Consultar</button>
        <div className="error-ciudad">
          <p>{this.props.error}</p>
        </div>          
      </div>
        )
    } 
}

class PronosticoHoy extends React.Component {
    render() {
        return (
      <div className="pronostico-hoy">
        <p>{this.props.ciudad}</p>
        <img className="img-pronostico" src={this.props.icon} />
        <p>{this.props.temp}°</p>
        <p>{this.props.descrip}</p> 
      </div>  
        )
    } 
}

class PronosticoInfo extends React.Component {
    render() {
        return (
      <div className="pronostico-info">
        <p>{this.props.fecha}</p>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <div className="info-clima">
              <p>Min°/Max°:</p>
              <p>{this.props.min}°/{this.props.max}°</p>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <div className="info-clima">
              <p>Alba/Ocaso:</p>
              <p>{this.props.sunrise}/{this.props.sunset}</p>
            </div>
          </div>
        </div>
        <p><strong>Humedad: </strong>{this.props.hum}%</p>
        <p><strong>Viento: </strong> {this.props.wind} km/h</p>
        <p><strong>Visibilidad: </strong>{this.props.vis} m.</p>
        <p><strong>Presión: </strong>{this.props.press} mbar.</p>
      </div>  
        )
    } 
}

class AppClima extends React.Component {
  constructor(props) {
    super(props);

    var meses = new Array ("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre")
    var f = new Date()
    var fecha = f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear()
    
    this.handleClimaClick   = this.handleClimaClick.bind(this);
    this.handleChangeInput  = this.handleChangeInput.bind(this);

    this.state = {
        descrip:  '.....',
        icon:     'public/images/icons/clima_default.png',
        temp:     '--',
        min:    '--',
        max:    '--',
        press:    '-',
        hum:    '-',
        vis:    '-',
        wind:     '-',
        sunrise:  '--:--',
        sunset:   '--:--',
        id:     0,
        city:     '---',
        fecha:    fecha,

        value:    '',
        error:    '',
    };
  }

  handleClimaClick(event) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + this.state.value + "&units=metric&appid=f3f376b99fe63334a561bad62acb4f94")
      .then(response => response.json())
      .then((response) => {

          var sunrise     = new Date(response.sys.sunrise * 1000)
          var sunrise_hours   = sunrise.getHours()
          var sunrise_minutes = "0" + sunrise.getMinutes()

          var sunset      = new Date(response.sys.sunset * 1000)
          var sunset_hours  = sunset.getHours()
          var sunset_minutes  = "0" + sunset.getMinutes()

          this.setState ({
            descrip:  getDescription(response.weather[0].icon),
            icon:     'public/images/icons/' + response.weather[0].icon + '.svg',
            temp:     Math.round(response.main.temp),
              min:    Math.floor(response.main.temp_min),
              max:    Math.ceil(response.main.temp_max),
              press:    response.main.pressure,
              hum:    response.main.humidity,
              vis:    response.visibility,
              wind:     response.wind.speed,
              sunrise:  sunrise_hours + ':' + sunrise_minutes.substr(-2),
              sunset:   sunset_hours + ':' + sunset_minutes.substr(-2),
              id:     response.id,
              city:     response.name,
          })
        })
      .catch((error) => { 

        this.setState ({
            descrip:  '.....',
            icon:     'public/images/icons/clima_default.png',
            temp:     '--',
            temp_min:   '--',
            temp_max:   '--',
            press:    '-',
            hum:    '-',
            vis:    '-',
            wind:     '-',
            sunrise:  '--:--',
            sunset:   '--:--',
            id:     0,
            city:     '---',

            error:    "Ciudad no encontrada",
        }); 

        setInterval(() => { this.setState ({ error: "", }); }, 3000); 

      });
  }

  handleChangeInput(event) {
    this.setState({
      value: event.target.value
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
          <FormPronostico 
            handleClimaClick  = {this.handleClimaClick}
            error         = {this.state.error}
            value         = {this.state.value}
            handleChangeInput   = {this.handleChangeInput}
          />
        </div>

        <div className="offset-lg-1 offset-md-1 offset-sm-1 offset-xs-1"></div>

        <div className="col-lg-7 col-md-7 col-sm-7 col-xs-7">
          <div className="row">

            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
              <PronosticoHoy 
                ciudad  = {this.state.city}
                icon  = {this.state.icon}
                temp  = {this.state.temp}
                descrip = {this.state.descrip}
              />
            </div>

            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
              <PronosticoInfo 
                fecha     = {this.state.fecha}
                min     = {this.state.min}
                max     = {this.state.max}
                sunrise   = {this.state.sunrise}
                sunset    = {this.state.sunset}
                hum     = {this.state.hum}
                wind    = {this.state.wind}
                vis     = {this.state.vis}
                press     = {this.state.press}
              />    
            </div>

          </div>
        </div>
      </React.Fragment>
    );
  }
}

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

export default AppClima;
