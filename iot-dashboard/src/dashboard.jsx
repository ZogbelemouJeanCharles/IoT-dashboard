import { useEffect, useMemo, useState } from "react";

// UI componenten
import Switch from "./components/Switch";
import Slider from "./components/Slider";
import Graph from "./components/Graph";
import DistanceBar from "./components/DistanceBar";
import Modal from "./components/Modal.jsx";
import SensorBadge from "./components/SensorBadge";
import ComponentPicker from "./components/ComponentPicker";

// Mock “API” (vervang later door echte fetch calls)
import { fetchSensors, fetchLatestData /*, _addFakeSensor*/ } from "./api/mockSensors";

export default function Dashboard() {
  // Sensoren & live data
  const [sensors, setSensors] = useState([]);           // [{ id, fields: [] }]
  const [dataBySensor, setDataBySensor] = useState({}); // { id: { field: value } }

  // Voor detectie van nieuwe sensoren
  const configuredIds = useMemo(() => new Set(), []);   // (nog niet gebruikt, maar klaar)
  const [knownIds, setKnownIds] = useState(new Set());

  // Modal state
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    field: "",
    component: "graph",
  });

  // Bindings: aan welke component koppel je welk veld van welke sensor?
  // [{ id, name, description, field, component }]
  const [bindings, setBindings] = useState([]);

  // Poll sensoren + data (mock) — later vervangen door echte API
  useEffect(() => {
    let timer = null;

    async function tick() {
      const list = await fetchSensors();
      setSensors(list);

      // laatste waarden ophalen per sensor
      const updates = {};
      for (const s of list) {
        updates[s.id] = await fetchLatestData(s.id);
      }
      setDataBySensor(updates);

      // nieuw gezien
      const newSet = new Set(knownIds);
      list.forEach((s) => newSet.add(s.id));
      setKnownIds(newSet);
    }

    tick();
    timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [knownIds]);

  // Open de configuratiemodal voor een sensor-ID
  function onConfigure(id) {
    const sensor = sensors.find((s) => s.id === id);
    setActiveId(id);
    setForm({
      name: `Sensor ${id}`,
      description: "",
      field: sensor?.fields?.[0] || "",
      component: "graph",
    });
    setOpen(true);
  }

  // Bewaar binding (id + veld + gekozen component)
  function saveBinding() {
    if (!activeId || !form.field) return;
    setBindings((prev) => [
      ...prev,
      {
        id: activeId,
        name: form.name,
        description: form.description,
        field: form.field,
        component: form.component,
      },
    ]);
    setOpen(false);
  }

  // Lichte kaart-stijl (wit, subtiele rand en schaduw)
  const Card = ({ title, subtitle, children }) => (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      {(title || subtitle) && (
        <div className="mb-2">
          {title && <div className="text-sm font-semibold text-slate-800">{title}</div>}
          {subtitle && <div className="text-xs text-slate-500 -mt-0.5">{subtitle}</div>}
        </div>
      )}
      {children}
    </div>
  );

  // Render gekozen component voor een binding
  function renderBinding(b) {
    const latest = dataBySensor[b.id] || {};
    const val = latest[b.field];

    switch (b.component) {
      case "distance":
        return (
          <Card key={`${b.id}-${b.field}-distance`} title={b.name} subtitle={`${b.field} • DistanceBar`}>
            <DistanceBar value={typeof val === "number" ? Math.round(val) : 0} max={100} />
          </Card>
        );

      case "switch":
        return (
          <Card key={`${b.id}-${b.field}-switch`} title={b.name} subtitle={`${b.field} • Switch`}>
            <Switch defaultOn={Boolean(val)} onToggle={() => {}} />
          </Card>
        );

      case "slider":
        return (
          <Card key={`${b.id}-${b.field}-slider`} title={b.name} subtitle={`${b.field} • Slider`}>
            <Slider
              min={0}
              max={100}
              defaultValue={typeof val === "number" ? Math.round(val) : 50}
              onChange={() => {}}
            />
          </Card>
        );

      case "graph":
      default: {
        const pts = Array.isArray(val)
          ? val
          : typeof val === "number"
          ? [val - 2, val - 1, val, val + 1].map((x) => Math.max(0, x))
          : [20, 22, 23, 24];

        return (
          <Card key={`${b.id}-${b.field}-graph`} title={b.name} subtitle={`${b.field} • Graph`}>
            <div className="w-[400px]">
              <Graph dataPoints={pts} />
            </div>
          </Card>
        );
      }
    }
  }

  // Welke sensoren zijn nog niet gebonden (die tonen we als “nieuw gedetecteerd”)
  const boundIds = new Set(bindings.map((b) => b.id));
  const unconfigured = sensors.filter((s) => !boundIds.has(s.id));

  return (
    <div className="min-h-screen bg-white text-[#1a237e]">
      <div className="max-w-6xl mx-auto px-8 py-10 space-y-10">
        <h1 className="text-4xl font-bold text-[#1a237e] tracking-tight">🌐 Web Interface</h1>
        <p className="text-sm text-slate-500">
          Beheer en visualiseer je verbonden sensoren in real-time
        </p>

        {/* Nieuwe/ongeconfigureerde sensoren */}
        <div className="space-y-3">
          {unconfigured.length > 0 && (
            <>
              <div className="text-sm text-slate-600">Nieuwe sensor gedetecteerd:</div>
              <div className="flex gap-3 flex-wrap">
                {unconfigured.map((s) => (
                  <SensorBadge key={s.id} id={s.id} onConfigure={onConfigure} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sensoren (read-only visualisaties) */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[#1a237e]">Sensoren</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bindings.filter((b) => ["graph", "distance"].includes(b.component)).map(renderBinding)}
          </div>
        </section>

        {/* Actuators (interactieve componenten) */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[#1a237e]">Actuators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bindings.filter((b) => ["switch", "slider"].includes(b.component)).map(renderBinding)}
          </div>
        </section>
      </div>

      {/* Modal: configuratie van een sensor */}
      <Modal open={open} title={`Configureer sensor ${activeId || ""}`} onClose={() => setOpen(false)}>
        <div className="space-y-4 text-slate-800">
          <div>
            <label className="block text-sm mb-1">Naam</label>
            <input
              className="w-full border border-slate-300 rounded-md px-3 py-2"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Beschrijving (optioneel)</label>
            <input
              className="w-full border border-slate-300 rounded-md px-3 py-2"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Veld (data)</label>
              <select
                className="border border-slate-300 rounded-md px-3 py-2 w-full"
                value={form.field}
                onChange={(e) => setForm((f) => ({ ...f, field: e.target.value }))}
              >
                {(sensors.find((s) => s.id === activeId)?.fields || []).map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Component</label>
              <ComponentPicker value={form.component} onChange={(v) => setForm((f) => ({ ...f, component: v }))} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button className="px-4 py-2 rounded-md border border-slate-300 text-slate-700" onClick={() => setOpen(false)}>
              Annuleren
            </button>
            <button className="px-4 py-2 rounded-md bg-[#1a237e] text-white" onClick={saveBinding}>
              Opslaan
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

