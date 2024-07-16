const mqtt = require('mqtt');

// Conexión al broker MQTT
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
  // Aquí podrías actualizar el DOM o enviar el mensaje a tu backend para almacenamiento
  const messageContainer = document.createElement('div');
  messageContainer.textContent = message.toString();
  document.body.appendChild(messageContainer);
});
 
