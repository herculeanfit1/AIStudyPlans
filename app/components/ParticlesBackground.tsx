"use client";

import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Particles } from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

export default function ParticlesBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // This effect only needs to run once on component mount to handle client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update dark mode state when theme changes
  useEffect(() => {
    if (mounted) {
      setIsDarkMode(theme === "dark");
    }
  }, [theme, mounted]);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  // Don't render particles until mounted to prevent hydration issues
  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: {
            enable: true,
            zIndex: -1,
          },
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 60,
          particles: {
            color: {
              value: isDarkMode ? "#6d62ff" : "#4f46e5",
            },
            links: {
              color: isDarkMode ? "#a5b4fc" : "#818cf8",
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            move: {
              enable: true,
              random: true,
              speed: 1,
              straight: false,
              outModes: {
                default: "bounce",
              },
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 40,
            },
            opacity: {
              value: isDarkMode ? 0.4 : 0.2,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "grab",
              },
              resize: true,
            },
            modes: {
              grab: {
                distance: 180,
                links: {
                  opacity: 0.5,
                },
              },
            },
          },
        }}
      />
    </div>
  );
}
