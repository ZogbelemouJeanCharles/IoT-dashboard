export default function ComponentPicker({ value, onChange }) {
  return (
    <select
      className="border rounded-md px-3 py-2 w-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="graph">Graph (lijn)</option>
      <option value="distance">Distance bar</option>
      <option value="switch">Switch</option>
      <option value="slider">Slider</option>
    </select>
  );
}
