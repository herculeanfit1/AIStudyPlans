import { render, screen } from "@testing-library/react";
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

// Mock canvas getContext for ParticlesBackground
HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  strokeStyle: "",
  fillStyle: "",
  lineWidth: 1,
});

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

  test("ParticlesBackground renders canvas element", () => {
    render(<ParticlesBackground />);
    const canvas = document.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });
});
