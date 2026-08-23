"use client";

import { useEffect, useState } from "react";

/**
 * Renders a time-of-day greeting. Starts with a neutral, SSR-safe default
 * and swaps to "Good morning/afternoon/evening" once mounted — computing
 * this on the server would use the server's clock, not the visitor's.
 */
export function Greeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 12
        ? "Good morning"
        : hour < 18
          ? "Good afternoon"
          : "Good evening",
    );
  }, []);

  return (
    <>
      {greeting}, {name} <span aria-hidden>👋</span>
    </>
  );
}
