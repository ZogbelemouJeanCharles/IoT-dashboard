import useMQTT from "./mqtt"
import { useState } from "react"

export default function Dashboard() {
  const { temperature, humidity } = useMQTT()
  const [angle, setAngle] = useState(90)

  function sendServo() {
    fetch("http://<IP-RPi>:5000/servo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ angle }),
    })
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>IoT Dashboard</h1>

      <h2>Sensors</h2>
      <p>🌡 Temperatuur: {temperature ?? "Loading..."} °C</p>
      <p>💧 Vochtigheid: {humidity ?? "Loading..."} %</p>

      <h2>Servo Control</h2>
      <input
        type="range"
        min="0"
        max="180"
        value={angle}
        onChange={(e) => setAngle(Number(e.target.value))}
      />
      <button onClick={sendServo}>Set Angle</button>
    </div>
  )
}
