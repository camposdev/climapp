/**
 *
 * Filtrar números decimais
 *
 */

app.filter('int', function() {
  return function( input ) {
    return parseInt(input);
  };
});