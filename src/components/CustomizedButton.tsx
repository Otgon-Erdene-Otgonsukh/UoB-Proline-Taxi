export default function CustomizedButton({ title, type, click, }: { title: string; type: string; click: () => void; }) {
  return (
    <button
      onClick={click}
      className={"py-1.5 px-4 rounded-md hover:scale-101 transition-all duration-200 text-sm font-light" +
        (type === 'primary' && " bg-[#2c2c2c] text-white hover:bg-[#414040]") +
        (type === 'warning' && " bg-[#fb6d00] text-white hover:bg-[#414040]") +
        (type === 'error' && " bg-[#ff0000] text-white hover:bg-[#414040]")}

    >
      {title}
    </button>
  );
}
