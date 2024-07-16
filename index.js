 const express = require('express');
const mqtt = require('mqtt');
const { Client } = require('pg');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Conexión a PostgreSQL
const dbClient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
dbClient.connect();

// Configuración MQTT
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');

mqttClient.on('connect', () => {
  mqttClient.subscribe('meshtastic/#', (err) => {
    if (!err) {
      console.log('Subscribed to Meshtastic topic');
    }
  });
});

mqttClient.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message.toString()}`);
  // Guardar mensaje en la base de datos
  dbClient.query('INSERT INTO messages(content) VALUES($1)', [message.toString()], (err, res) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Message saved to database');
    }
  });
});

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

