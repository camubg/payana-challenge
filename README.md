<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Requirements

Desarrollar una API para gestionar facturas, clientes y productos utilizando Node.js y
PostgreSQL. El proyecto debe ser capaz de:
1. Crear y leer facturas.
2. Crear, modificar, eliminar y leer productos
3. Crear, modificar, eliminar y leer clientes
4. Listar todas las facturas con la información detallada del cliente y los
   productos asociados.

## Project setup

```bash
$ docker-compose build
```

## Compile and run the project

```bash
$ docker-compose up
```

## Run tests

```bash
$ npm run test
```

## Endpoints

Once you run the app, you can access the swagger [here](http://localhost:3000/api/).

Please make sure you have the api key to use the endpoint, you can find it in the `.env` file.


- [GET] Healthcheck
```
curl --request GET 'http://localhost:3000/hello'
```