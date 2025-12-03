export default function SensorBadge({ id, onConfigure }) {
  return (
    <button
      onClick={() => onConfigure(id)}
      className="px-6 py-2 rounded-full border-2 border-[#2f318a] 
                 text-[#2f318a] font-semibold text-sm 
                 hover:bg-[#2f318a] hover:text-white 
                 transition-all duration-300 ease-in-out 
                 shadow-sm"
    >
      ID #{id}
    </button>
  );
}


