app.factory('WebService', ['$http', function( $http ){


  // API Dark Sky
  var apiKey = '78840139b008a4a740b25540a4f59574';

  /**
   * Busca informações da API
   * @params {string}   lat   
   * @params {string}   long
   * @params {date}     time
   * @params {string}   unit
   * @params {function} callback
   * See https://darksky.net/dev/docs/forecast
   */
    
  function forecast( lat, long, time, unit, callback ) {
      
    if ( time == null ) {
      var url = 'https://api.darksky.net/forecast/' + apiKey + '/' + lat + ',' + long + '?lang=pt&units=' + unit + '&callback=JSON_CALLBACK';
    } else {
      var url = 'https://api.darksky.net/forecast/' + apiKey + '/' + lat + ',' + long + ',' + time + '?lang=pt&units=' + unit + '&callback=JSON_CALLBACK';
    }

    return $http.jsonp( url ).then( function success( res ) {
      callback( res.data );
    });
  }

  /**
   * Busca de cidades com autocomplete
   * @param {string}   input
   * @param {function} callback
   * See https://www.wunderground.com/weather/api/d/docs?d=autocomplete-api&MR=1
   */
  
  function getCity( input, callback ) {

    var url = 'https://autocomplete.wunderground.com/aq?query=' + input + '&cb=JSON_CALLBACK'; 
    return $http.jsonp( url ).then( function success( res ) {
      callback( res );
    });
  };


  /**
   * Busca a localização referente as coordenadas passadas
   * @param {string}   lat
   * @param {string}   long
   * @param {function} callback
   */
  
  function geolocation( lat, long, callback ) {

    var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat +','+ long +'&key=AIzaSyBLBgEFOwy1Ghm0Ov-R6tol7RzYjAztjkw&callback=';
    return $http.get( url ).then( function success( res ) {

      // Filtra dados para pegar cidade, estado e pais
      var local = {};
      for (var ac = 0; ac < res.data.results[0].address_components.length; ac++) {
        var component = res.data.results[0].address_components[ac];

        switch(component.types[0]) {
          case 'locality':
            local.city = component.long_name;
            break;
          case 'administrative_area_level_1':
            local.state = component.short_name;
            break;
          case 'country':
            local.country = component.long_name;
            local.registered_country_iso_code = component.short_name;
            break;
        }
      };

      callback( local );
    });
  }


  var service = {
    forecast: forecast,
    getCity: getCity,
    geolocation: geolocation
  }

  return service;

}]);