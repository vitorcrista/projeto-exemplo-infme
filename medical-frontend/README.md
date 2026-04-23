# medical-frontend

Aplicação Angular 17 (standalone + HttpClient + Observables) para gestão de pacientes. Inspirada na estrutura do [Tour of Heroes (toh-6)](../toh-6) mas modernizada e ligada a um backend real.

## Pré-requisitos

1. Backend [medical-backend](../medical-backend) a correr em `http://localhost:3000`
2. Node 18+ (Angular 17 não suporta Node 25 LTS — pode aparecer warning, mas funciona para dev)

## Arranque

```bash
npm install
npm start             # ng serve --proxy-config proxy.conf.json → http://localhost:4200
```

O ficheiro [proxy.conf.json](proxy.conf.json) encaminha `/api` → `http://localhost:3000`, pelo que o Angular chama `/api/patients` e o backend responde sem problemas de CORS.

## Estrutura

```
src/app/
├── app.component.ts/html/css      # navegação + painel de mensagens
├── app.config.ts                  # provideRouter + provideHttpClient
├── app.routes.ts                  # dashboard · patients · detail/:id
├── core/
│   ├── models/patient.model.ts
│   └── services/
│       ├── patient.service.ts     # CRUD + pesquisa via HttpClient
│       └── message.service.ts     # log no painel de mensagens
└── features/
    ├── dashboard/                 # top 4 pacientes + pesquisa
    ├── patients/                  # lista + adicionar + eliminar
    ├── patient-detail/            # form editar/guardar
    └── patient-search/            # debounce 300 ms + switchMap
```

## Scripts

- `npm start` – servidor de desenvolvimento com proxy para o backend
- `npm run build` – build de produção
- `npm test` – unit tests (Karma + Jasmine)
