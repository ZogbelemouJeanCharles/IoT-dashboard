import { useState } from "react";

export default function Slider({ min = 0, max = 30, step = 1, defaultValue = 15, onChange }) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    setValue(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <div className="w-48 h-32 bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center">
      <span className="text-lg font-semibold text-gray-700 mb-2">{value}</span>
      <input
  type="range"
  min={min}
  max={max}
  step={step}
  value={value}
  onChange={handleChange}
  className="w-40 accent-blue-500 cursor-pointer"
/>

      <p className="text-xs text-gray-500 mt-2">Example Data</p>
    </div>
  );
}

