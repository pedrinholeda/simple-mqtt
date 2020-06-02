// controller.js
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com')


var garageState = ''
var connected = false

client.on('connect', () => {
  client.subscribe('garage/connected')
  client.subscribe('garage/state')
})

client.on('message', (topic, message) => {
  switch (topic) {
    case 'garage/connected':
      return handleGarageConnected(message)
    case 'garage/state':
      return handleGarageState(message)
  }
  console.log('No handler for topic %s', topic)
})

function handleGarageConnected(message) {
  console.log('Garagem conectada com status: %s', message)
  connected = (message.toString() === 'true')
}

function handleGarageState(message) {
  garageState = message
  console.log('status da garagem atualizada para %s', message)
}

function openGarageDoor() {

  if (connected && garageState !== 'open') {

    client.publish('garage/open', 'true')
  }
}

function closeGarageDoor() {

  if (connected && garageState !== 'closed') {

    client.publish('garage/close', 'true')
  }
}


setTimeout(() => {
  console.log('abrir porta')
  openGarageDoor()
}, 5000)


setTimeout(() => {
  console.log('fechar porta')
  closeGarageDoor()
}, 20000)
