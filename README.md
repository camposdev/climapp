# climapp
Uma simples aplicação de previsão do tempo com [AngularJS](https://angularjs.org/) e [Dark Sky API](https://darksky.net/dev/).

## Estrutura
Como é um app pequeno a organização ficou bem simples:

```
app/
  controllers/
    main.controller.js
  directives/
    selectclick.directive.js
  filters/
    int.filter.js
    totrusted.filter.js
  services/
    web.service.js
  app.js
assets/
  css/
    main.css      -> arquivos compilados para produção
    vendor.css    -> arquivos compilados para produção
  font/           -> icones (Weather Icons)
    ...
  images/
    ...
  js/
    main.js       -> arquivos compilados para produção
    vendor.js     -> arquivos compilados para produção
  styl/
    _flexbox.styl
    _mixins.styl
    _reset.styl
    app.styl      -> arquivo principal para desenvolvimento

index.html  
```

## Stylus
Na criação dos estilos usei o pré-processador [Stylus](http://stylus-lang.com/). Pra mim esse é o melhor pré-processador de css ;).

## Gulp
A compilação, minificação e organização dos arquivos é feito com o [Gulp](http://gulpjs.com/)

## Iniciando
Para iniciar o projeto siga para desenvolvimento e produção siga estes passos:

Instalando dependências do Npm:
```
$ npm install
```

Instalando dependências do Bower:
```
$ bower install
```

Montando a estrutura com o Gulp:
```
$ gulp
```
Para atualizar e compilar os arquivos automaticamente enquanto desenvolve:
```
$ gulp watch
```

## Demonstração
[https://camposdev.github.io/climapp/](https://camposdev.github.io/climapp/)
