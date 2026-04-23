# medical-backend

API REST mínima em Node.js + Express + Mongoose para gerir pacientes (MongoDB).

## Arranque

```bash
npm install
cp .env.example .env      # ajustar se necessário
npm run seed              # popula ~10 pacientes fictícios (apaga os existentes!)
npm run dev               # http://localhost:3000
```

Pré-requisito: MongoDB a correr localmente na porta 27017 (ou ajustar `MONGO_URI`).

## Endpoints

| Método | URL | Descrição |
|---|---|---|
| GET    | `/api/health` | Ping |
| GET    | `/api/patients` | Lista todos |
| GET    | `/api/patients/search?name=xx` | Pesquisa por nome/apelido (regex case-insensitive) |
| GET    | `/api/patients/:id` | Um paciente |
| POST   | `/api/patients` | Cria (body JSON) |
| PUT    | `/api/patients/:id` | Actualiza |
| DELETE | `/api/patients/:id` | Remove |

## Exemplos rápidos

```bash
curl http://localhost:3000/api/patients
curl http://localhost:3000/api/patients/search?name=silva
curl -X POST http://localhost:3000/api/patients \
  -H 'Content-Type: application/json' \
  -d '{"firstName":"Teste","lastName":"Novo","dateOfBirth":"2000-01-01","gender":"M","snsNumber":"999999999"}'
```
