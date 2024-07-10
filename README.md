# Backend NestJS

## Por que NestJS?

Fiz a escolha do NestJS para o backend devido a alguns motivos:

- **TypeScript**: Permite desenvolvimento mais seguro e escalável, com tipagem estática e suporte moderno a ECMAScript.
- **Framework Opinionado**: Facilita a estruturação do código e a organização do projeto, seguindo boas práticas.
- **Suporte a Decorators**: Facilita a criação de controladores, serviços e módulos de forma estruturada.
- **Injeção de Dependências**: Promove um código mais modular e testável.

## Por que PostgreSQL?

Escolhi o PostgreSQL como banco de dados para este projeto pelas seguintes razões:

- **Relacional e ACID**: O PostgreSQL oferece suporte completo a transações ACID (Atomicidade, Consistência, Isolamento e Durabilidade), adequado para aplicações que requerem integridade de dados.
- **Escalabilidade**: É altamente escalável, permitindo o crescimento do volume de dados e o aumento da carga de trabalho conforme necessário.
- **Flexibilidade**: Suporta diversos tipos de dados e oferece recursos avançados para consultas complexas.

## Configuração das Variáveis de Ambiente

Antes de executar o servidor localmente, é necessário configurar as seguintes variáveis de ambiente:

- `POSTGRES_HOST`: Host do servidor PostgreSQL.
- `POSTGRES_PORT`: Porta utilizada pelo PostgreSQL (normalmente 5432).
- `POSTGRES_USER`: Usuário do PostgreSQL.
- `POSTGRES_PASSWORD`: Senha do usuário do PostgreSQL.
- `POSTGRES_DB`: Nome do banco de dados PostgreSQL a ser utilizado pelo aplicativo.

Você pode configurar essas variáveis de ambiente de diferentes maneiras, como definindo-as no seu ambiente de desenvolvimento ou utilizando um arquivo `.env`.

## Como Executar

### Pré-requisitos

- Node.js versão 20 ou superior
- Docker (opcional, para execução via contêiner)

### Executar Local

1. **Instalação das Dependências**

   ```bash
   npm install
   ```

2. **Compilação do TypeScript**

   ```bash
   npm run build
   ```

3. **Execução do Servidor**

   ```bash
   npm start
   ```

O servidor estará acessível em http://localhost:3000

### Executando via Docker

- Para executar via Docker, você pode construir uma imagem Docker do projeto:

   ```bash
   docker build -t backend-nestjs .
   ```

- Depois executar o docker-compose para executar o projeto:

   ```bash
   docker-compose up -d
   ```


O servidor estará acessível em http://localhost:3000


## Testes

Para testar execute os seguintes comandos:

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
 npm run test:cov
```

