[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Poshap API

APP de fornecimento de serviços gerais.

Para testar a api, clone o repositório pela url: "https://github.com/HericC/poshap_api.git". \
Abra o terminal e execute: "npm run init". \
Crie o arquivo ".env" na raiz do projeto e configure de acordo com o arquivo de exemplo: ".env.example". \
Abra o terminal e execute: "npm run start".

## Installation

```bash
# install dependencies
$ npm install

# install commit standardization
$ npm run prepare

# complete installation
$ npm run init
```

## Running the app

```bash
# development
$ npm run start

# development watch mode
$ npm run dev

# production mode
$ npm run prod
```

## Prisma client

```bash
# Generate prisma client
$ npm run gen

# Update prisma client (Whenever you update schema.prisma, you will need to run this command)
$ npm run up

# Run prisma studio
$ npm run studio
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

This project is under the MIT license - see the [LICENSE.md](LICENSE) file for details
