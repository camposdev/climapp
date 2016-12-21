app.controller('MainController', ['$rootScope', '$http', 'WebService', '$filter', function( $rootScope, $http, WebService, $filter ){

  var vm = this;

  /**
   *
   * Inicia consumindo a API e mostrando as informações da data atual
   *
   */

  // Define unidade default
  $rootScope.unitMetrics = 'ca';

  // Inicia com o loading na página
  vm.loaded = false;

  // Pega latitude e longitude com HTML5
  navigator.geolocation.getCurrentPosition(function(location) {
    // Chama função passando coordenadas da geolocalização
    setLocation( location.coords.latitude, location.coords.longitude );
  }, 
  function() {
    // Caso não consiga a localização configura manualmente
    setLocation( '-27.595378', '-48.548050' );
  });

  // Função que busca dados da API referente a latitude e logitude
  function setLocation ( lat, long ) {
    // Grava a localização atual
    vm.defaultLatitude = lat;
    vm.defaultLongitude = long;

    // Busca o nome da cidade pela localização
    WebService.geolocation( lat, long, function( local ) {
      vm.searchCity = local.city + ', ' + local.state + ', ' + local.country;
    });

    // Mostra as informações do dia atual
    getForecast( lat, long, null, $rootScope.unitMetrics );

    // Mostra os próximos 6 dias
    getDays( lat, long, null, $rootScope.unitMetrics );

    // Desativa o loading da página
    vm.loaded = true;
  }

  // Atualiza a unidade de temperatura
  vm.changeUnit = function( unit ) {
    // Atualiza a unidade selecionada
    $rootScope.unitMetrics = unit;
    // Busca as informações novamente com a nova unidade selecionada
    getForecast( vm.defaultLatitude, vm.defaultLongitude, null, $rootScope.unitMetrics );
    getDays( vm.defaultLatitude, vm.defaultLongitude, null, $rootScope.unitMetrics );
  };

  // Atualiza informações ao selecionar outro dia
  vm.changeDay = function( time, index ) {
    getForecast( vm.defaultLatitude, vm.defaultLongitude, time, $rootScope.unitMetrics );
    // Ativa botão do dia selecionado
    vm.selectedDay = index;
  }

  // Lista de cidades ao digitar na busca
  vm.autoComplete = function( value ){
    if ( vm.formSearch.$valid ){
      WebService.getCity( vm.searchCity, function( res ) {
        vm.listCities = res.data.RESULTS;
        vm.loaded = true;
      });
    }
  }

  // Seleciona uma nova cidade e recarrega os
  vm.selectCity = function( res ) {
    vm.searchCity = res.name;

    getForecast( res.lat, res.lon, null, $rootScope.unitMetrics );
    getDays( res.lat, res.lon, null, $rootScope.unitMetrics );

    vm.selectedDay = null;
  }
  
  
  /**
   * Função que pega dados da previsão para o dia atual OU do dia selecionado
   * @params {string}   lat 
   * @params {string}   long
   * @params {date}     time
   */
    
  function getForecast( lat, long, time, unit ) {
    
    // Ativa classe para esconder o conteúdo até carregar os dados
    vm.loaded = false;
    
    return WebService.forecast( lat, long, time, unit, function( res ) {
      
      // Variavel para buscar informações atuais do tempo
      var currently = res.currently;
      
      // Formata a data atual
      vm.currentDay = $filter('date')( new Date(currently.time * 1000), 'EEEE');

      // Se for selecionado outro dia oculta o horário atual
      if ( !time ) {
        vm.currentTime = ' - ' + $filter('date')( new Date(currently.time * 1000), 'HH:mm');
      } else {
        vm.currentTime = '';
      }

      // Armazena a descrição da pevisão atual e icone
      vm.currentStatus = currently.summary;
      vm.currentIcon = 'wi-forecast-io-' + currently.icon;

      vm.currentTemp = parseInt( currently.temperature );

      // Armazena informação de umidade e velocidade do vendo
      vm.currentHumidity = parseInt( currently.humidity * 100 );
      vm.curentMind = parseInt( currently.windSpeed );

      // Desativa a classe para esconder o conteúdo depois de carregar
      vm.loaded = true;


      // Variavel para buscar informações por horário
      var hourly = res.hourly.data;

      // Cria um array para horários e temperaturas a serem inseridos no gráfico
      var hours = [];
      var temps = [];

      // Pega os próximos horários de 3 em 3 horas
      var count = 0;
      for ( var i = 0; i < 9; i++ ) {
        if ( i == 0 ) {
          count = i;
        } else {
          count += 3;
        }
        if ( hourly[count] ) {

          hours.push( $filter('date')( new Date( hourly[count]['time'] * 1000 ), 'HH:mm') );
          temps.push( parseInt( hourly[count]['temperature'] ) );

        } else { // Pega o ultimo horário do array
          
          hours.push( $filter('date')( new Date( hourly.slice(-1)[0]['time'] * 1000 ), 'HH:mm') );
          temps.push( parseInt( hourly.slice(-1)[0]['temperature'] ) );
        }
      }

      // Chama a função que monta o gráfico de temperaturas e horários
      vm.chart = setChart( hours, temps );

    });
  }

  /**
   * Função que busca da API a previsão dos próximos 6 dias
   * @params {string}  lat
   * @params {string}  long
   */
  
  function getDays( lat, long, time, unit ) {

    return WebService.forecast( lat, long, null, unit, function( res ) {
      
      var daily = res.daily.data;
      vm.dailyList = daily;

      // Formata a data nos dias atuais e grava a data original para a chamada de outro dia
      for ( var key in vm.dailyList ) {
        vm.dailyList[key]['original_time'] = vm.dailyList[key]['time'];
        vm.dailyList[key]['time'] = new Date(vm.dailyList[key]['time'] * 1000);
      }
    });
  }

  /**
   * Função que monta o gráfico de temperaturas
   * @params {array}  hours
   * @params {array}  temps
   */
  
  function setChart( hours, temps ) {
    var chart = {
      labels: hours,
      colors: ['#ffffff'],
      data: [
        temps
      ],
      datasetOverride: [{ yAxisID: 'y-axis-1' }],
      options: {
        scales: {
          yAxes: [
            {
              id: 'y-axis-1',
              type: 'linear',
              display: false,
              position: 'left',
              gridLines: {
                display: false
              },
              ticks: {
                display: false
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                display: false
              },
              ticks: {
                fontColor: "#FFF",
                fontFamily: 'montserrat',
                fontSize: 16
              }
            }
          ]
        },
        hover: false,
        legend: {
          display: false
        },
        tooltips: {
          enabled: true,
          mode: 'single',
          callbacks: {
            label: function(tooltipItem, data) {
              var label = data.labels[tooltipItem.index];
              var datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              if ( $rootScope.unitMetrics == 'ca' ) {
                var unit = '°C';
              } else {
                var unit = '°F';
              }
              return datasetLabel + unit;
            }
          }
        },
        maintainAspectRatio: false,
        scaleShowVerticalLines: false,
      }
    }

    return chart;
  }
  
}]);