/// <reference types="vitest/globals" />
import "@testing-library/jest-dom/vitest";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: "/",
    query: {},
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/image — renders as a plain <img>
vi.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: Record<string, unknown>) => {
    return <img src={src as string} alt={alt as string} {...props} />;
  },
}));

// Mock next/link — renders as a plain <a>
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: "light",
    setTheme: vi.fn(),
    theme: "light",
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Suppress console errors in tests
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("Warning: ReactDOM.render is no longer supported")
  ) {
    return;
  }
  originalConsoleError(...args);
};
