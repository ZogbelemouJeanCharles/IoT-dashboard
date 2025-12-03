export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Achtergrond overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Inhoud */}
      <div className="relative w-full max-w-lg bg-gray-900/90 border border-gray-700/60 
                      rounded-2xl p-6 shadow-2xl shadow-blue-500/10 text-white 
                      backdrop-blur-md transition-all duration-300">
        <div className="flex items-center justify-between mb-4 border-b border-gray-700/60 pb-2">
          <h3 className="text-xl font-semibold text-blue-400">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg transition-transform transform hover:rotate-90"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

