import { useState } from "react";

export default function Switch({ defaultOn = false, onToggle }) {
  const [isOn, setIsOn] = useState(defaultOn);

  const handleClick = () => {
    const newState = !isOn;
    setIsOn(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-36 h-36 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500"
      style={{
        background: isOn
          ? "radial-gradient(circle at 30% 30%, #6ee7b7, #059669)"
          : "radial-gradient(circle at 30% 30%, #d1d5db, #9ca3af)",
        boxShadow: isOn
          ? "0 0 20px rgba(16, 185, 129, 0.8)"
          : "inset 0 0 10px rgba(0,0,0,0.3)",
      }}
    >
      <div
        className={`absolute inset-3 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-500 ${
          isOn ? "text-white" : "text-gray-700"
        }`}
        style={{
          backgroundColor: isOn ? "rgba(16, 185, 129, 0.5)" : "#f3f4f6",
          boxShadow: isOn
            ? "0 0 10px rgba(16, 185, 129, 0.8)"
            : "inset 0 0 10px rgba(0,0,0,0.2)",
        }}
      >
        {isOn ? "ON" : "OFF"}
      </div>
      
    </div>
  );
}

