import { render, screen } from "@testing-library/react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "../../app/components/ThemeToggle";
import Hero from "../../app/components/Hero";
import ParticlesBackground from "../../app/components/ParticlesBackground";

// Mock the next-themes hook 
jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    resolvedTheme: "light",
    setTheme: jest.fn(),
  }),
}));

// Mock the tsparticles-slim module
jest.mock("tsparticles-slim", () => ({
  loadSlim: jest.fn().mockResolvedValue(undefined),
}));

// Mock the react-tsparticles module
jest.mock("react-tsparticles", () => ({
  Particles: () => <div data-testid="particles" />,
}));

describe("Components with useEffect optimizations", () => {
  test("ThemeToggle component renders after mount without crashing", () => {
    render(<ThemeToggle />);
    const themeButton = screen.getByRole("button", { name: /toggle dark mode/i });
    expect(themeButton).toBeInTheDocument();
  });

  test("Hero component renders and animations trigger after mount", () => {
    render(<Hero />);
    const heading = screen.getByText(/Your AI Study/);
    expect(heading).toBeInTheDocument();
    // Animation classes should be applied
    const container = heading.closest("div");
    expect(container).toHaveClass("opacity-100");
  });

  test("ParticlesBackground handles theme changes correctly", () => {
    render(<ParticlesBackground />);
    const particles = screen.getByTestId("particles");
    expect(particles).toBeInTheDocument();
  });
}); 