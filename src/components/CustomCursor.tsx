
import { useState, useEffect } from "react";

const CURSOR_SIZE = 24;

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const onMouseLeave = () => setVisible(false);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  // Hide when not visible (e.g. page not focused)
  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[10000]"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Divine cursor: glowing white/gold center, subtle aura */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Glowing center */}
        <div className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 via-white to-yellow-500 shadow-[0_0_32px_8px_rgba(244,215,101,0.4)] animate-[pulse_1.5s_ease-in-out_infinite] border-2 border-yellow-100"></div>
        {/* Slight inner white dot for maximum focus */}
        <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_18px_6px_rgba(255,255,255,0.5)] border border-yellow-200"></div>
      </div>
    </div>
  );
};

export default CustomCursor;

