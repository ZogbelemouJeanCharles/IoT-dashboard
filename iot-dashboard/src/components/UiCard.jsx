import Card from "react-bootstrap/Card";

export default function UiCard({ title, subtitle, children }) {
  return (
    <Card className="shadow-sm border-0">
      {(title || subtitle) && (
        <Card.Header className="bg-white border-0">
          {title && <div className="fw-semibold text-primary">{title}</div>}
          {subtitle && <div className="small text-secondary">{subtitle}</div>}
        </Card.Header>
      )}
      <Card.Body>{children}</Card.Body>
    </Card>
  );
}
