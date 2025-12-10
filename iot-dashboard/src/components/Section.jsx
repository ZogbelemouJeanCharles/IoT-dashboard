import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

/**
 * Section
 * props:
 * - title: string | ReactNode
 * - subtitle?: string
 * - actions?: ReactNode        // knoppen rechts van de titel (inline layout)
 * - layout?: "inline" | "stacked"  // "inline" = titel links, actions rechts; "stacked" = titel boven, actions eronder
 * - align?: "start" | "center" | "end"  // uitlijning van de header (alleen bij stacked zinvol)
 * - className?: string
 * - children: inhoud (b.v. je <Row> met kaarten)
 */
export default function Section({
  title,
  subtitle,
  actions,
  layout = "inline",
  align = "start",
  className = "",
  children,
}) {
  if (layout === "inline") {
    return (
      <section className={className}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h2 className="h4 m-0">{title}</h2>
            {subtitle && <div className="text-secondary small">{subtitle}</div>}
          </div>
          {actions && <div className="d-flex gap-2">{actions}</div>}
        </div>
        {children}
      </section>
    );
  }

  // stacked
  const alignMap = { start: "start", center: "center", end: "end" };
  return (
    <section className={className}>
      <div className={`text-${alignMap[align]} mb-2`}>
        <h2 className="h4 m-0">{title}</h2>
        {subtitle && <div className="text-secondary small">{subtitle}</div>}
      </div>
      {actions && <div className={`d-flex gap-2 justify-content-${alignMap[align]} mb-3`}>{actions}</div>}
      {children}
    </section>
  );
}
