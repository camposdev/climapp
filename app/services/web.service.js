app.factory('WebService', ['$http', function( $http ){


  // API Dark Sky
  var apiKey = '5379a1fdb33c95b24ff31bec3f3f4f49';

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

    return  $http.jsonp( url ).then( function success( res ) {
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
    var url = 'http://autocomplete.wunderground.com/aq?query=' + input;
    
    return  $http.jsonp( url ).then( function success( res ) {
              callback( res );
            });
  };


  var service = {
    forecast: forecast,
    getCity: getCity
  }

  return service;

}]);