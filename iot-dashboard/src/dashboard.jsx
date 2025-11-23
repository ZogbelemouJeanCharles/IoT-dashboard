import { useState } from "react";
import Switch from "./components/Switch";
import Slider from "./components/Slider";
import Graph from "./components/Graph";
import DistanceBar from "./components/DistanceBar";



export default function Dashboard() {
  // Dummy data tijdelijk (tot MQTT terug is)
  const temperature = 22.5;
  const humidity = 45;

  const [angle, setAngle] = useState(90);

  function sendServo() {
    fetch("http://<IP-RPi>:5000/servo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ angle }),
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start gap-10 py-10 bg-gray-900 text-white">

      <h1>IoT Dashboard</h1>

      


      

      

      <h2 className="mt-6">Switch</h2>
      <Switch defaultOn={false} onToggle={(state) => console.log("Switch state:", state)} />
        

        <h2>Slider</h2>
<Slider min={0} max={30} step={1} defaultValue={15} onChange={(v) => console.log("Slider:", v)} />

  <h2>Graph</h2>
<Graph dataPoints={[20, 22, 21, 24, 25, 23, 26]} />

<h2>Ultrasonic Distance</h2>
<DistanceBar value={30} max={100} />



    </div>
  );
}
