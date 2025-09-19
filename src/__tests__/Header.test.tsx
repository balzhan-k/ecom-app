import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // Add this line
import Header from "@/components/layout/Header";

// Update the mock for next/image to correctly handle props
jest.mock(
  "next/image",
  () =>
    ({
      src,
      alt,
      width,
      height,
      priority,
      ...props
    }: {
      src: string;
      alt: string;
      width?: number;
      height?: number;
      priority?: boolean;
      [key: string]: any;
    }) => {
      // eslint-disable-next-line @next/next/no-img-element
      return (
        <img src={src} alt={alt} width={width} height={height} {...props} />
      );
    }
);

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock AuthContext and CartContext
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/context/CartContext", () => ({
  useCart: jest.fn(),
}));

// Mock UserMenu and CartIcon as they are separate components
jest.mock("@/components/layout/UserMenu", () => ({
  UserMenu: () => <div data-testid="user-menu" />,
}));

jest.mock("@/components/layout/CartIcon", () => ({
  CartIcon: () => <div data-testid="cart-icon" />,
}));

const mockUsePathname = require("next/navigation").usePathname;
const mockUseAuth = require("@/context/AuthContext").useAuth;

describe("Header", () => {
  test("renders login link when user is not logged in", () => {
    mockUsePathname.mockReturnValue("/");
    mockUseAuth.mockReturnValue({
      user: null,
    });

    render(<Header />);

    const loginLink = screen.getByRole("link", { name: /login/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
    expect(screen.queryByTestId("user-menu")).not.toBeInTheDocument();
  });

  test("renders user menu when user is logged in", () => {
    mockUsePathname.mockReturnValue("/");
    mockUseAuth.mockReturnValue({
      user: { uid: "test-user-id", email: "test@example.com" },
    });

    render(<Header />);

    expect(screen.getByTestId("user-menu")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /login/i })
    ).not.toBeInTheDocument();
  });

  test("applies active class to the correct category link", () => {
    mockUsePathname.mockReturnValue("/categories/pens");
    mockUseAuth.mockReturnValue({ user: null });

    render(<Header />);

    const pensLink = screen.getByRole("link", { name: /pens/i });
    expect(pensLink).toHaveClass("text-cyan-600");

    const notebooksLink = screen.getByRole("link", { name: /notebooks/i });
    expect(notebooksLink).not.toHaveClass("text-cyan-600");
  });

  test("matches snapshot when user is not logged in", () => {
    mockUsePathname.mockReturnValue("/");
    mockUseAuth.mockReturnValue({ user: null });
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });

  test("matches snapshot when user is logged in", () => {
    mockUsePathname.mockReturnValue("/");
    mockUseAuth.mockReturnValue({ user: { uid: "test-user-id" } });
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });
});
