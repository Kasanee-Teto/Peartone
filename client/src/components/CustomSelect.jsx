import { useState } from "react";

const CustomSelect = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(opt => String(opt.id) === String(value))?.title || placeholder;

  return (
    <div className="relative w-full">
      <div
        className={`
          flex items-center justify-between w-full px-3 py-[10px] rounded-xl
          border bg-white/[0.04] text-[13px] text-white/90 cursor-pointer select-none
          transition-all duration-200
          ${isOpen
            ? "border-white/20 bg-white/[0.08] shadow-[0_0_0_2px_rgba(200,245,96,0.1)]"
            : "border-white/10 hover:bg-white/[0.08] hover:border-white/20"
          }
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={!value ? "text-white/45" : ""}>{selectedLabel}</span>
        <span
          className={`
            inline-block w-[9px] h-[9px] border-r-2 border-b-2 border-white/50
            transition-transform duration-300 mr-1
            ${isOpen ? "-rotate-[135deg] translate-y-[-2px] translate-x-[-2px]" : "rotate-45"}
          `}
        />
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[999]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#181818] border border-white/10 rounded-2xl max-h-[250px] overflow-y-auto z-[1001] shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
            <div
              className="px-4 py-[14px] text-sm text-white/70 cursor-pointer transition-all duration-150 hover:bg-white/[0.08] hover:text-white"
              onClick={() => { onChange(""); setIsOpen(false); }}
            >
              Without album
            </div>
            {options.map((item) => (
              <div
                key={item.id}
                className={`
                  px-4 py-[14px] text-sm cursor-pointer transition-all duration-150
                  ${String(value) === String(item.id)
                    ? "bg-[rgba(200,245,96,0.1)] text-[#c8f560]"
                    : "text-white/70 hover:bg-white/[0.08] hover:text-white"
                  }
                `}
                onClick={() => { onChange(item.id); setIsOpen(false); }}
              >
                {item.title}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomSelect;