"use client";

import CountUp from "react-countup";

export function AnimatedNumber({ value }: { value: number }) {
  return (
    <CountUp
      end={value}
      duration={1.2}
      separator="," 
      formattingFn={(n) => new Intl.NumberFormat("en-US").format(n)}
    />
  );
}


