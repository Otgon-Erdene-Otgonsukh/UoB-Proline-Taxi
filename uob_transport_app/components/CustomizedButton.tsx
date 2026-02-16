export default function CustomizedButton({ title, type, click, }: { title: string; type: string; click: () => void; }) {
  return (
    <button
      onClick={click}
      className={"py-1.5 px-4 rounded-md hover:scale-104 transition-all duration-200 text-sm font-light font-inter cursor-pointer" +
        (type === 'primary' ? " bg-[#2c2c2c] text-white hover:bg-green-600" :
          (type === 'warning' ? " bg-[#2c2c2c] text-white hover:bg-[#414040]" :
            " bg-[#ffffff] text-black border-2 border-[#2c2c2c] hover:bg-red-600 hover:text-white"))}
    >
      {title}
    </button>
  );
}

