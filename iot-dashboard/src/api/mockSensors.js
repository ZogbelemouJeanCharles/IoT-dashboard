// Simuleert sensorlijst + live data updates.
// Later vervang je dit door echte fetch('/api/sensors') + fetch('/api/data?sensorId=...')

let sensors = [
  { id: "288120", fields: ["distance", "temperature"] },
];

let latestData = {
  "288120": { distance: 37, temperature: 22.5 },
};

// willekeurige updates (elke seconde)
setInterval(() => {
  if (latestData["288120"]) {
    latestData["288120"].distance = Math.max(0, Math.min(100, latestData["288120"].distance + (Math.random()*10-5)));
    latestData["288120"].temperature = +(20 + Math.random() * 10).toFixed(1);
  }
}, 1000);

export async function fetchSensors() {
  // hier zou je echte API call doen
  return Promise.resolve(sensors);
}

export async function fetchLatestData(sensorId) {
  return Promise.resolve(latestData[sensorId] || {});
}

// helper om later makkelijk een nieuwe sensor te simuleren
export function _addFakeSensor(id, fields) {
  if (!sensors.find(s => s.id === id)) {
    sensors.push({ id, fields });
  }
  latestData[id] = {};
  fields.forEach(f => {
    latestData[id][f] = f === "distance" ? Math.floor(Math.random()*100) : +(20 + Math.random()*10).toFixed(1);
  });
}
