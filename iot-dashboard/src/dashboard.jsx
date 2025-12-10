import { useEffect, useMemo, useState } from "react";

// UI componenten
import Switch from "./components/Switch";
import Slider from "./components/Slider";
import Graph from "./components/Graph";
import DistanceBar from "./components/DistanceBar";
import Modal from "./components/Modal.jsx";
import SensorBadge from "./components/SensorBadge";
import ComponentPicker from "./components/ComponentPicker";
import UiCard from "./components/UiCard";
import Section from "./components/Section";   // ✅ nieuw

// Bootstrap layout & UI
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

// Mock “API”
import { fetchSensors, fetchLatestData } from "./api/mockSensors";

export default function Dashboard() {
  const [sensors, setSensors] = useState([]);           // [{ id, fields: [] }]
  const [dataBySensor, setDataBySensor] = useState({}); // { id: { field: value } }

  const configuredIds = useMemo(() => new Set(), []);   // voor later
  const [knownIds, setKnownIds] = useState(new Set());

  // Modal
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", field: "", component: "graph" });

  // Bindings: [{ id, name, description, field, component }]
  const [bindings, setBindings] = useState([]);

  // Poll mock data
  useEffect(() => {
    let timer = null;
    async function tick() {
      const list = await fetchSensors();
      setSensors(list);

      const updates = {};
      for (const s of list) updates[s.id] = await fetchLatestData(s.id);
      setDataBySensor(updates);

      const newSet = new Set(knownIds);
      list.forEach((s) => newSet.add(s.id));
      setKnownIds(newSet);
    }
    tick();
    timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [knownIds]);

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

  function saveBinding() {
    if (!activeId || !form.field) return;
    setBindings((prev) => [
      ...prev,
      { id: activeId, name: form.name, description: form.description, field: form.field, component: form.component },
    ]);
    setOpen(false);
  }

  // Kaart render
  function renderBindingWithCard(b) {
    const latest = dataBySensor[b.id] || {};
    const val = latest[b.field];
    const title = b.name;
    const subtitle =
      `${b.field} • ${b.component === "distance" ? "DistanceBar" :
                     b.component === "switch"   ? "Switch" :
                     b.component === "slider"   ? "Slider" : "Graph"}`;

    switch (b.component) {
      case "distance":
        return (
          <UiCard title={title} subtitle={subtitle}>
            <DistanceBar value={typeof val === "number" ? Math.round(val) : 0} max={100} />
          </UiCard>
        );
      case "switch":
        return (
          <UiCard title={title} subtitle={subtitle}>
            <Switch defaultOn={Boolean(val)} onToggle={() => {}} />
          </UiCard>
        );
      case "slider":
        return (
          <UiCard title={title} subtitle={subtitle}>
            <Slider min={0} max={100} defaultValue={typeof val === "number" ? Math.round(val) : 50} onChange={() => {}} />
          </UiCard>
        );
      case "graph":
      default: {
        const pts = Array.isArray(val)
          ? val
          : typeof val === "number"
          ? [val - 2, val - 1, val, val + 1].map((x) => Math.max(0, x))
          : [20, 22, 23, 24];
        return (
          <UiCard title={title} subtitle={subtitle}>
            <div style={{ width: 400, maxWidth: "100%" }}>
              <Graph dataPoints={pts} />
            </div>
          </UiCard>
        );
      }
    }
  }

  const boundIds = new Set(bindings.map((b) => b.id));
  const unconfigured = sensors.filter((s) => !boundIds.has(s.id));

  return (
    <div className="min-h-screen bg-white" style={{ color: "#1a237e" }}>
      <Container className="py-4">
        {/* Titel */}
        <div className="mb-2">
          <h1 className="fw-bold" style={{ color: "#1a237e" }}>🌐 Web Interface</h1>
          <div className="text-secondary small">Beheer en visualiseer je verbonden sensoren in real-time</div>
        </div>

        {/* Nieuwe / ongeconfigureerde sensoren */}
        {unconfigured.length > 0 && (
          <div className="mb-3">
            <div className="text-secondary small mb-2">Nieuwe sensor gedetecteerd:</div>
            <div className="d-flex gap-2 flex-wrap">
              {unconfigured.map((s) => (
                <SensorBadge key={s.id} id={s.id} onConfigure={onConfigure} />
              ))}
            </div>
          </div>
        )}

        {/* SENSOR-SECTION met composition */}
        <Section
  title="Sensoren"
  subtitle="Live weergaves"
  layout="stacked"       // <-- titel bovenaan, acties eronder
  align="start"          // <-- alles uitgelijnd links
  actions={
    <a href="/sensors">
      <Button variant="outline-primary" className="rounded-pill px-3">
        Bekijk sensoren
      </Button>
    </a>
  }
  className="mt-4"
>
  {/* inhoud */}
</Section>


        {/* ACTUATOR-SECTION met andere layout (stacked + links uitgelijnd) */}
        <Section
          title="Actuators"
          subtitle="Interactieve besturing"
          layout="stacked"
          align="start"
          actions={
            <>
              <a href="/actuators">
                <Button variant="outline-primary" className="rounded-pill px-3">Bekijk actuators</Button>
              </a>
              {/* Voeg hier later extra knoppen/filters toe */}
            </>
          }
          className="mt-5"
        >
          <Row className="g-3">
            {bindings
              .filter((b) => ["switch", "slider"].includes(b.component))
              .map((b) => (
                <Col key={`${b.id}-${b.field}-a`} xs={12} md={6} lg={4}>
                  {renderBindingWithCard(b)}
                </Col>
              ))}
          </Row>
        </Section>
      </Container>

      {/* Modal: configuratie */}
      <Modal open={open} title={`Configureer sensor ${activeId || ""}`} onClose={() => setOpen(false)}>
        <div className="space-y-4" style={{ color: "#0f172a" }}>
          <div className="mb-3">
            <label className="form-label">Naam</label>
            <input
              className="form-control"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Beschrijving (optioneel)</label>
            <input
              className="form-control"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Veld (data)</label>
              <select
                className="form-select"
                value={form.field}
                onChange={(e) => setForm((f) => ({ ...f, field: e.target.value }))}
              >
                {(sensors.find((s) => s.id === activeId)?.fields || []).map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Component</label>
              <ComponentPicker value={form.component} onChange={(v) => setForm((f) => ({ ...f, component: v }))} />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>Annuleren</Button>
            <Button variant="primary" onClick={saveBinding}>Opslaan</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

