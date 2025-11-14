// src/mqtt.js
import { useEffect, useState } from "react";
import mqtt from "mqtt";

export default function useMQTT() {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);

  useEffect(() => {
    const client = mqtt.connect("ws://<IP-RPi>:9001");

    client.on("connect", () => {
      console.log("Connected to MQTT");
      client.subscribe("sensors/#");
    });

    client.on("message", (topic, message) => {
      const value = message.toString();

      if (topic === "sensors/temperature") setTemperature(value);
      if (topic === "sensors/humidity") setHumidity(value);
    });
  }, []);

  return { temperature, humidity };
}
