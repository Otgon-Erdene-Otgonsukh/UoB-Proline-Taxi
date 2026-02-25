export default function DdInfoBox({title, description, open, click,}: {title: string; description: string; open: boolean; click: () => void;}) {
  return (
    <div className={`my-4 border border-black rounded-md ${open ? "bg-white" : ""}`}>
        <button onClick={click}
            className="p-4 cursor-pointer w-full flex justify-between items-center text-left font-bold"
            aria-expanded={open}>
              
            {title}
            <span className={`flex-shrink-0 h-5 w-5 flex items-center justify-center transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▼</span>
        </button>

        <div className={`transition-all duration-100 ease-in-out overflow-hidden ${open ? "px-4 pb-4 max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
            <p className="leading-relaxed">{description}</p>
        </div>
    </div>
  );
}