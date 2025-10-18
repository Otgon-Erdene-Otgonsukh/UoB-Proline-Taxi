// Defines dropdown/info component for FAQ-style title/descriptions.
export default function DdInfoBox({title, description, open, click,}: {title: string; description: string; open: boolean; click: () => void;}) {
  return (
    // ${open ? ...} makes the background white (slightly easier to read thinner font) if the element is open.
    <div className={`my-4 border border-black rounded-md ${open ? "bg-white" : ""}`}>
        {/* onClick calls the callback function to trigger set state in page. */}
        <button onClick={click}
            // focus:border-blue-500 places a blue box when it's in focus (tabbed onto) for accessibility.
            className="p-4 cursor-pointer w-full flex justify-between items-center text-left font-bold transition-all focus:border-blue-500"
            aria-expanded={open}>
              
            {title}
            {/* Turn the arrow upside down if the dropdown is opened. */}
            {/* NOTE: I used the ascii character for an upside down triangle here, we should replace this with a real icon element later. */}
            <p className={`h-5 w-5 transition-transform duration-100 ${open ? "rotate-180" : ""}`}>▼</p>
        </button>

        {/* Opened and closed animation / states are determined by the height and opacity judging by the state open == true / false. */}
        <div className={`transition-all duration-100 ease-in-out overflow-hidden ${open ? "px-4 pb-4 max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
            <p className="leading-relaxed">{description}</p>
        </div>
    </div>
  );
}
