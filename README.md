# Sistema de Gestão de TCCs

Sistema web para gerenciamento de Trabalhos de Conclusão de Curso, desenvolvido como trabalho prático da disciplina **GAC116 – Programação Web (2026/1) – UFLA**.

---

## Tecnologias

**Backend:** Python 3.12 · Django · Django REST Framework

**Frontend:** React 18 · Vite · React Router DOM · Axios · Lucide React

**Infraestrutura:** Docker · Docker Compose · PostgreSQL (quando rodado com Docker)

---

## Estrutura do projeto

```
projeto-gestao-tccs/
├── core/                          # App Django principal
│   ├── models.py                  # Modelos do banco de dados
│   ├── serializers.py             # Serializers da API REST
│   ├── views.py                   # ViewSets
│   └── urls.py                    # Rotas da API
├── tcc_project/
│   └── settings.py                # Configurações do Django
├── tcc-frontend/
│   └── src/
│       ├── components/            # Navbar, DataTable, Modal
│       ├── pages/                 # Uma pasta por módulo
│       │   ├── unidades/
│       │   ├── departamentos/
│       │   ├── cursos/
│       │   ├── alunos/
│       │   ├── professores/
│       │   ├── tccs/
│       │   └── dashboard/
│       └── services/api.js        # Funções Axios para a API
├── Dockerfile                     # Imagem do backend
├── docker-compose.yml
├── requirements.txt
├── manage.py
└── load.py                        # Popula o banco com dados de exemplo
```

---

## Opção 1 — Rodando com Docker (recomendado)

Quando rodado via Docker, o sistema usa **PostgreSQL** como banco de dados. Os dados são persistidos em um volume Docker chamado `postgres_data`, ou seja, continuam salvos mesmo após derrubar os containers.

**Pré-requisito:** Docker Desktop instalado e em execução.

```bash
# Na pasta projeto-gestao-tccs
docker compose up --build
```

Isso vai automaticamente:
1. Construir as imagens do backend e do frontend
2. Subir o PostgreSQL e aguardar ele ficar saudável (healthcheck)
3. Aplicar as migrações do banco
4. Popular o banco com dados de exemplo via `load.py`
5. Subir o Django em **http://localhost:8000**
6. Subir o React em **http://localhost:5173**

Acesse o sistema em: **http://localhost:5173**

Para parar os containers:

```bash
docker compose down
```

Para resetar o banco do zero:

```bash
docker compose down -v
docker compose up --build
```

> Nas próximas execuções, `docker compose up` (sem `--build`) é suficiente.

---

## Opção 2 — Rodando sem Docker

Quando rodado sem Docker, o sistema usa **SQLite** como banco de dados (padrão do Django). Os dados de exemplo funcionam normalmente.

**Pré-requisitos:** Python 3.10+ e Node.js 18+ com npm instalados.

### Backend

Abra um terminal na pasta raiz do projeto:

```bash
# 1. Crie e ative o ambiente virtual
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Linux / macOS

# 2. Instale as dependências
pip install -r requirements.txt

# 3. Aplique as migrações
python manage.py migrate

# 4. Popule o banco com dados de exemplo
python load.py

# 5. Inicie o servidor
python manage.py runserver
```

Backend disponível em **http://localhost:8000**

### Frontend

Abra um **segundo terminal** na pasta do frontend:

```bash
cd tcc-frontend
npm install
npm run dev
```

Frontend disponível em **http://localhost:5173**

> O Vite redireciona chamadas `/api` para o backend automaticamente via proxy configurado no `vite.config.js`.

Acesse o sistema em: **http://localhost:5173**

---

## Módulos do sistema

| Módulo | Funcionalidades |
|--------|----------------|
| **Unidades Acadêmicas** | Listagem com busca |
| **Departamentos** | Listagem com busca, exibe unidade vinculada |
| **Cursos** | Listagem com busca |
| **Alunos** | Listagem com busca, exibe curso vinculado |
| **Professores** | Listagem com busca, exibe departamento vinculado |
| **TCCs** | CRUD completo — criar, editar, excluir e listar |
| **Dashboard** | Painel com gráficos e estatísticas gerais |

### Campos do TCC

- Título, resumo e palavras-chave
- Tipo: Monografia, Relatório de Estágio, Relatório Técnico ou Artigo
- Idioma: Português ou Inglês
- Status: Em Elaboração, Enviado, Aprovado ou Reprovado
- Aluno, orientador e coorientador (opcional)
- Banca: presidente, 1º membro e 2º membro
- Semestre letivo de defesa
- Upload de arquivo PDF

### Dashboard

- Cards de totais: geral e por status
- Gráficos de rosca: por status, tipo e idioma
- Gráfico de barras: TCCs por semestre
- Rankings: top orientadores, coorientadores, cursos, departamentos e unidades

---

## API REST

Base URL: `http://localhost:8000/api/`

| Recurso | Endpoint |
|---------|----------|
| Unidades Acadêmicas | `/api/unidades-academicas/` |
| Departamentos | `/api/departamentos/` |
| Cursos | `/api/cursos/` |
| Alunos | `/api/alunos/` |
| Professores | `/api/professores/` |
| TCCs | `/api/tccs/` |
| Estatísticas | `/api/tccs/estatisticas/` |

Todos os endpoints suportam GET, POST, PUT, PATCH e DELETE.

A documentação interativa do DRF está disponível em **http://localhost:8000/api/**

---

## Dados de exemplo

O script `load.py` popula o banco com:

- 9 unidades acadêmicas (ESAL, EENG, FCS, FCSA, FAELCH, FZMV, ICTIN, ICET, ICN)
- 7 departamentos (DCC, DAC, DES, DMM, DFM, DCH, DBI)
- 4 cursos (BCC, BSI, MAT, FIS)
- 20 professores
- 100 alunos com TCCs gerados automaticamente

---

## Equipe

Trabalho desenvolvido em grupo para a disciplina GAC116 – Programação Web, UFLA, 2026/1.