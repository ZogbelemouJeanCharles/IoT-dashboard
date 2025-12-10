import { useEffect, useState } from "react";
import Switch from "../components/Switch";
import Slider from "../components/Slider";
import { fetchSensors, fetchLatestData } from "../api/mockSensors";

const Card = ({ title, children }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
    <div className="mb-2 text-sm font-semibold text-slate-800">{title}</div>
    {children}
  </div>
);

export default function ActuatorsPage() {
  const [sensors, setSensors] = useState([]);
  const [dataBySensor, setDataBySensor] = useState({});

  useEffect(() => {
    let t;
    async function tick() {
      const list = await fetchSensors();
      setSensors(list);
      const updates = {};
      for (const s of list) updates[s.id] = await fetchLatestData(s.id);
      setDataBySensor(updates);
    }
    tick();
    t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#1a237e]">
      <div className="max-w-6xl mx-auto px-8 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Actuators</h1>
          <a href="/" className="text-sm underline">← Terug naar dashboard</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sensors.map((s) => {
            const d = dataBySensor[s.id] || {};
            return (
              <div key={s.id} className="space-y-4">
                <Card title={`Sensor #${s.id} • Switch`}>
                  <Switch defaultOn={Boolean(d.on)} onToggle={() => {}} />
                </Card>
                <Card title={`Sensor #${s.id} • Slider`}>
                  <Slider min={0} max={100} defaultValue={50} onChange={() => {}} />
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
