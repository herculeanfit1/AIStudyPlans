import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../app/components/Header";
import { ImageProps } from "next/image";

// Mock the next/image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImageProps) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img 
      src={props.src as string} 
      alt={props.alt as string} 
      width={props.width} 
      height={props.height} 
    />;
  },
}));

// Mock the next-themes hook
jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    resolvedTheme: "light",
    setTheme: jest.fn(),
  }),
}));

describe("Header Component", () => {
  it("renders the logo", () => {
    render(<Header />);
    const logo = screen.getByAltText("SchedulEd Logo");
    expect(logo).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Header />);
    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(screen.getByText("How It Works")).toBeInTheDocument();
    expect(screen.getByText("Pricing")).toBeInTheDocument();
  });

  it("toggles mobile menu when button is clicked", () => {
    render(<Header />);
    // Find the mobile menu button by its icon
    const menuButton = screen.getByRole("button", { name: "" });

    // Mobile menu should be hidden initially
    expect(screen.queryByText("How It Works")).toBeInTheDocument();

    // Click menu button to open mobile menu
    fireEvent.click(menuButton);

    // Mobile menu should now be visible with nav links
    expect(screen.getAllByText("How It Works").length).toBeGreaterThan(1);

    // Click menu button again to close mobile menu
    fireEvent.click(menuButton);

    // Mobile menu should be hidden again
    expect(screen.getAllByText("How It Works").length).toBe(1);
  });
});
