import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "@/components/layout/Header";

jest.mock("next/image", () => {
  const MockImage = ({
    src,
    alt,
    width,
    height,
    ...props
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    [key: string]: any; 
  }) => {
    return <img src={src} alt={alt} width={width} height={height} {...props} />;
  };
  MockImage.displayName = "Image";
  return MockImage;
});

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/context/CartContext", () => ({
  useCart: jest.fn(),
}));

jest.mock("@/components/layout/UserMenu", () => ({
  UserMenu: () => <div data-testid="user-menu" />,
}));

jest.mock("@/components/layout/CartIcon", () => ({
  CartIcon: () => <div data-testid="cart-icon" />,
}));

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const mockUsePathname = usePathname as jest.Mock;
const mockUseAuth = useAuth as jest.Mock;

describe("Header", () => {
  test("renders login link when user is not logged in", () => {
    mockUsePathname.mockReturnValue("/");
    mockUseAuth.mockReturnValue({
      user: null,
    });

    render(<Header />);

    const loginLink = screen.getByTestId("login-link");
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
    expect(screen.queryByTestId("login-link")).not.toBeInTheDocument();
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
