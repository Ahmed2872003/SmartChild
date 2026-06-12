import { useEffect, useState } from "react";

const useTimer = ({ ascending = true, durationSec }) => {
  const initvalue = ascending ? 0 : durationSec;
  const [timer, setTimer] = useState(initvalue);
  const [active, setActive] = useState(false);

  const step = ascending ? 1 : -1;

  const timerFinished = (timer) =>
    (ascending && timer === durationSec) || (!ascending && timer === 0);

  useEffect(() => {
    if (!active) return;

    const timerId = setInterval(
      () => setTimer((timer) => updateTimer(timerId, timer)),
      1000,
    );

    return () => clearInterval(timerId);
  }, [active]);

  useEffect(() => {
    if (timerFinished(timer)) {
      setActive(false);
      setTimer(initvalue);
    }
  }, [timer]);

  function updateTimer(timerId, timer) {
    if (timerFinished(timer)) {
      clearInterval(timerId);
      return timer;
    }

    return timer + step;
  }

  return { value: timer, isActive: active, setActive };
};

export { useTimer };
