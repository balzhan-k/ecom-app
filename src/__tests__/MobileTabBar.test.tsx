import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MobileTabBar from "@/components/layout/MobileTabBar";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

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

const mockUsePathname = usePathname as jest.Mock;
const mockUseAuth = useAuth as jest.Mock;
const mockUseCart = useCart as jest.Mock;

describe("MobileTabBar", () => {
  it("renders correctly for a non-logged-in user", () => {
    mockUsePathname.mockReturnValue("/");
    mockUseAuth.mockReturnValue({ user: null, userData: null });
    mockUseCart.mockReturnValue({ getTotalItems: () => 0 });

    render(<MobileTabBar />);

    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cart/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /orders/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /admin/i })
    ).not.toBeInTheDocument();
  });

  it("renders correctly for a logged-in user", () => {
    mockUsePathname.mockReturnValue("/");
    mockUseAuth.mockReturnValue({
      user: { uid: "1", email: "user@example.com" },
      userData: { role: "user" },
    });
    mockUseCart.mockReturnValue({ getTotalItems: () => 0 });

    render(<MobileTabBar />);

    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /orders/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cart/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /login/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /admin/i })
    ).not.toBeInTheDocument();
  });

  it("renders correctly for an admin user", () => {
    mockUsePathname.mockReturnValue("/");
    mockUseAuth.mockReturnValue({
      user: { uid: "1", email: "admin@example.com" },
      userData: { role: "admin" },
    });
    mockUseCart.mockReturnValue({ getTotalItems: () => 0 });

    render(<MobileTabBar />);

    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /admin/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cart/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /login/i })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /orders/i })).toBeInTheDocument();
  });

  it("applies active class to the correct tab", () => {
    mockUsePathname.mockReturnValue("/cart");
    mockUseAuth.mockReturnValue({ user: null, userData: null });
    mockUseCart.mockReturnValue({ getTotalItems: () => 0 });

    render(<MobileTabBar />);

    const cartLink = screen.getByRole("link", { name: /cart/i });

    expect(cartLink).toHaveTextContent("Cart");
    const cartSpan = screen.getByText("Cart");
    expect(cartSpan).toHaveClass("text-cyan-600");

    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toHaveTextContent("Home");
    const homeSpan = screen.getByText("Home");
    expect(homeSpan).not.toHaveClass("text-cyan-600");
  });

  it("shows the total items in the cart icon", () => {
    mockUsePathname.mockReturnValue("/");
    mockUseAuth.mockReturnValue({ user: null, userData: null });
    mockUseCart.mockReturnValue({ getTotalItems: () => 5 });

    render(<MobileTabBar />);

    const cartLink = screen.getByRole("link", { name: /cart/i });
    expect(cartLink).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("matches snapshot for a logged-in user", () => {
    mockUsePathname.mockReturnValue("/orders");
    mockUseAuth.mockReturnValue({
      user: { uid: "1", email: "user@example.com" },
      userData: { role: "user" },
    });
    mockUseCart.mockReturnValue({ getTotalItems: () => 2 });

    const { asFragment } = render(<MobileTabBar />);
    expect(asFragment()).toMatchSnapshot();
  });
});
