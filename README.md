## To-Do Backend – REST e Arquitetura Reativa

Este repositório contém o backend da aplicação To-Do List, desenvolvido como parte do trabalho prático da disciplina de Arquitetura de Software.
O objetivo principal é comparar e demonstrar dois estilos de comunicação entre frontend e backend:

  * Arquitetura REST (Pull)

  * Arquitetura Reativa com Server-Sent Events (Push)

O backend foi implementado em Node.js com Express, utilizando uma camada de dados em memória para manter o foco na análise arquitetural.

# 🚀 Tecnologias Utilizadas

  * Node.js

  * Express

  * CORS

  * Body-Parser

  * Server-Sent Events (SSE)

# 🏗️ Arquitetura do Backend

O backend foi estruturado de forma simples e didática, com três responsabilidades principais:

  * Camada de Dados (em memória)
    Armazena o estado global da aplicação (lista de tarefas) utilizando estruturas JavaScript, sem dependência de banco de dados externo.

  * API REST (Modelo Pull)
    Fornece endpoints tradicionais para criação, leitura, atualização e remoção de tarefas.

  * Camada Reativa (Modelo Push)
    Utiliza Server-Sent Events para notificar automaticamente todos os clientes conectados sempre que o estado da aplicação é alterado.

Essa abordagem permite comparar claramente as diferenças entre comunicação baseada em requisição e comunicação baseada em eventos.

# 📌 Endpoints Disponíveis

🔹 REST API

GET	/todos	Retorna todas as tarefas

POST	/todos	Cria uma nova tarefa
PUT	/todos/:id	Atualiza uma tarefa existente
DELETE	/todos/:id	Remove uma tarefa

🔹 Arquitetura Reativa (SSE)

GET	/events	Estabelece conexão reativa para receber atualizações automáticas

Quando uma tarefa é criada, atualizada ou removida, todos os clientes conectados ao endpoint /events recebem automaticamente o novo estado da lista de tarefas.

🔄 Diferença entre REST e Reativo

  * REST (Pull):
    O cliente precisa realizar uma nova requisição para obter dados atualizados após qualquer alteração.

  * Reativo (Push):
    O servidor envia automaticamente as atualizações para os clientes conectados, sem necessidade de novas requisições.

Essa diferença pode ser observada claramente ao abrir múltiplas instâncias do frontend simultaneamente.

# ▶️ Como Executar o Projeto Localmente

Clone o repositório:

```
git clone https://github.com/RenanLM/eng-soft-backend.git
```

Acesse a pasta do projeto:

```
cd eng-soft-backend
```

Instale as dependências:

```
npm install
```

Inicie o servidor:

```
node server.js
```

O backend estará disponível em:

API REST: http://localhost:10000/todos

Stream Reativo: http://localhost:10000/events

# 🌐 Deploy

O backend está hospedado na plataforma Render, utilizando o plano gratuito.

URL pública:

https://eng-soft-backend.onrender.com

Observação: Em contas gratuitas, o serviço pode entrar em modo de suspensão quando não está sendo utilizado.
