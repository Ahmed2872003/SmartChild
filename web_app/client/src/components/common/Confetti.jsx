import React, { useState } from "react";

const Confetti = () => {
  const [particles] = useState(() =>
    Array.from({ length: 40 }).map(() => ({
      id: Math.random(),
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      color: ["#ef4444", "#22c55e", "#3b82f6", "#eab308", "#a855f7"][
        Math.floor(Math.random() * 5)
      ],
      animDuration: `${Math.random() * 1 + 0.5}s`,
      animDelay: `${Math.random() * 0.5}s`,
    })),
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-full animate-ping"
          style={{
            left: p.left,
            top: p.top,
            backgroundColor: p.color,
            animationDuration: p.animDuration,
            animationDelay: p.animDelay,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
