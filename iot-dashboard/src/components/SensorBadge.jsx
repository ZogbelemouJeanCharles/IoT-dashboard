import Button from "react-bootstrap/Button";

export default function SensorBadge({ id, onConfigure }) {
  return (
    <Button
      variant="outline-primary"
      onClick={() => onConfigure(id)}
      className="rounded-pill fw-semibold px-3 py-2"
    >
      ID #{id} <span className="ms-1">⚙️</span>
    </Button>
  );
}



