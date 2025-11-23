export default function DistanceBar({ value = 50, max = 100 }) {
  // Bereken percentage (afstand / max)
  const percentage = Math.min((value / max) * 100, 100);

  // Kleur afhankelijk van afstand
  const getColor = () => {
    if (percentage > 70) return "bg-green-500"; // ver weg
    if (percentage > 40) return "bg-yellow-400"; // midden
    return "bg-red-500"; // dichtbij
  };

  return (
    <div className="w-64 bg-gray-300 rounded-full h-6 overflow-hidden shadow-inner">
      <div
        className={`h-full ${getColor()} transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      ></div>
      <p className="text-sm text-gray-700 text-center mt-2 font-semibold">
        Distance: {value} cm
      </p>
    </div>
  );
}
