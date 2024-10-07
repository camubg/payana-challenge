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

```
Put .env in the root project
```

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

### Clients
- [GET] Get all clients
```
curl --request GET \
  --url http://localhost:3000/v1/clients \
  --header 'x-api-key: {api-key}'
```

- [GET] Get one client
```
curl --request GET \
  --url http://localhost:3000/v1/clients/:id \
  --header 'x-api-key: {api-key}'
```

- [POST] Create a client
```
curl --request POST \
  --url http://localhost:3000/v1/clients \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: {api-key}' \
  --data '{
	"name": "camila",
	"email": "camila@mail"
}'
```

- [PUT] Update a client by id
```
curl --request PUT \
--url http://localhost:3000/v1/clients/:id \
--header 'Content-Type: application/json' \
--header 'x-api-key: {api-key}' \
--data '{
	"name": "camila", (optional)
	"email": "camila@mail" (optional)
}'
```

- [DELETE] Delete a client by id
```
curl --request DELETE \
  --url http://localhost:3000/v1/clients/:id \
  --header 'x-api-key: {api-key}'
```

### Products
- [GET] Get all products
```
curl --request GET \
  --url http://localhost:3000/v1/products \
  --header 'x-api-key: {api-key}'
```

- [GET] Get one product
```
curl --request GET \
  --url http://localhost:3000/v1/products/:id \
  --header 'x-api-key: {api-key}'
```

- [POST] Create a client
```
curl --request POST \
  --url http://localhost:3000/v1/products \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: {api-key}' \
  --data '{
	"name": "coca-cola",
	"price": 10
}'
```

- [PUT] Update a product by id
```
curl --request PUT \
  --url http://localhost:3000/v1/products/:id \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: {api-key}' \
  --data '{
	"name": "coca zero", (optional)
	"price": 100 (optional)
}'
```

- [DELETE] Delete a product by id
```
curl --request DELETE \
  --url http://localhost:3000/v1/products/:id \
  --header 'x-api-key: {api-key}'
```

### Invoices 
- [GET] Get an invoice by id
```
curl --request GET \
  --url http://localhost:3000/v1/invoices/:id \
  --header 'x-api-key: {api-key}'
```

- [GET] Get all invoices, date filters optional
```
curl --request GET \
--url 'http://localhost:3000/v1/invoices?fromDate=2024-10-07&toDate=2024-10-07' \
--header 'x-api-key: {api-key}'
```

- [POST] Create an invoice
```
curl --request POST \
  --url http://localhost:3000/v1/invoices \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: {api-key}' \
  --data '{
	"clientId": 1,
	"items": [
		{
			"productId": 1,
			"quantity": 10
		},
		{
			"productId": 2,
			"quantity": 10
		}
	]
}'
```

## Decisions I made
- I decided that products and clients will have soft delete to preserve history, and only active records will be returned in their respective `GET` requests.
- I decided that the product `name` will be unique to maintain data consistency.
- In the absence of specific API definitions, I decided that my invoice api will be responsible for calculating totals and fetching product prices. 
It will receive the following parameters: clientId, productIds, and quantities.
- I understand that the price within invoice_items is the unit price of the product.
- I decided that products cannot be repeated in the item list when creating an invoice, as I consider this is a data entry error.
- I decided not to test controllers or repositories since they don't contain any logic of their own.
- I used api-key instead of jwt because I assumed this is an internal api, but if this would be used by users then jwt is a better approach.

## Potential Improvements
- Implement pagination in getAll to handle large data loads efficiently.
- Add caching for GET requests (depending on how frequently they are consumed), particularly for GET invoice if the dataset is extensive.
- Introduce versioning to track product price changes.
- Change filters in the getAll from invoices, depending on the requirements of the client.



