const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// --- CAMADA DE DADOS (Em Memória) ---
let todos = [
  { id: 1, text: "Architecture Analysis (Initial)", completed: false },
  { id: 2, text: "Implement MVC", completed: true }
];

// --- CAMADA REATIVA (Clientes SSE) ---
let clients = [];

const broadcastEvents = () => {
  const payload = JSON.stringify(todos);
  clients.forEach(client => {
    // Formato SSE: "data: <payload>\n\n"
    client.response.write(`data: ${payload}\n\n`);
  });
};

// --- ENDPOINTS REST (Arquitetura Pull) ---

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Texto da tarefa é obrigatório" });
  }

  const newTodo = {
    id: Date.now(),
    text,
    completed: false
  };

  todos.push(newTodo);

  // Dispara atualização reativa
  broadcastEvents();

  res.status(201).json(newTodo);
});

app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;

  const todoIndex = todos.findIndex(t => t.id == id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: "Tarefa não encontrada" });
  }

  // Atualiza apenas os campos enviados
  if (text !== undefined) {
    todos[todoIndex].text = text;
  }

  if (completed !== undefined) {
    todos[todoIndex].completed = completed;
  }

  // Dispara atualização reativa
  broadcastEvents();

  res.json(todos[todoIndex]);
});

// DELETE: Remove uma tarefa.
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;

  todos = todos.filter(t => t.id != id);

  // Dispara atualização reativa
  broadcastEvents();

  res.status(200).json({ message: "Tarefa removida" });
});

// --- ENDPOINT REATIVO (Arquitetura Push) ---

// GET /events: Estabelece conexão SSE persistente
app.get('/events', (req, res) => {
  // Cabeçalhos SSE
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };

  res.writeHead(200, headers);

  // Envia o estado inicial
  const data = `data: ${JSON.stringify(todos)}\n\n`;
  res.write(data);

  // Registra o cliente
  const clientId = Date.now();
  const newClient = {
    id: clientId,
    response: res
  };
  clients.push(newClient);

  // Remove cliente quando a conexão é encerrada
  req.on('close', () => {
    console.log(`Conexão ${clientId} encerrada`);
    clients = clients.filter(client => client.id !== clientId);
  });
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
  console.log(`- API REST: http://localhost:${PORT}/todos`);
  console.log(`- Stream Reativo: http://localhost:${PORT}/events`);
});
