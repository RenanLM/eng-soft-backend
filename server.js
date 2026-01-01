const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- DATA LAYER (In-Memory) ---
let todos = [
  { id: 1, text: "Architecture Analysis (Initial)", completed: false },
  { id: 2, text: "Implement MVC", completed: true }
];

// --- REACTIVE LAYER (SSE Clients) ---
let clients = [];

const broadcastEvents = () => {
  const payload = JSON.stringify(todos);
  clients.forEach(client => {
    // SSE format: "data: <payload>\n\n"
    client.response.write(`data: ${payload}\n\n`);
  });
};

// --- REST ENDPOINTS (Pull Architecture) ---

// GET: Retrieve tasks. Changes here do NOT affect other clients in REST mode.
app.get('/todos', (req, res) => {
  res.json(todos);
});

// POST: Add task. Triggers broadcast for Reactive clients, but REST clients must pull again.
app.post('/todos', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text required" });

  const newTodo = {
    id: Date.now(),
    text,
    completed: false
  };
  todos.push(newTodo);

  // Trigger Reactive Update
  broadcastEvents();

  res.status(201).json(newTodo);
});

// DELETE: Remove task.
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  todos = todos.filter(t => t.id!= id);

  // Trigger Reactive Update
  broadcastEvents();

  res.status(200).json({ message: "Deleted" });
});

// --- REACTIVE ENDPOINT (Push Architecture) ---

// GET /events: Establishes the persistent SSE connection
app.get('/events', (req, res) => {
  // Headers required for SSE
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);

  // Send initial data immediately
  const data = `data: ${JSON.stringify(todos)}\n\n`;
  res.write(data);

  // Register client
  const clientId = Date.now();
  const newClient = {
    id: clientId,
    response: res
  };
  clients.push(newClient);

  // Handle connection close
  req.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter(client => client.id!== clientId);
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log(`- REST API: http://localhost:${PORT}/todos`);
  console.log(`- Reactive Stream: http://localhost:${PORT}/events`);
});