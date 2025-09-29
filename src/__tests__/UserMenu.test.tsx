import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { UserMenu } from "@/components/layout/UserMenu";

const mockPush = jest.fn();
const mockLogout = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Импортируем мокированную версию useAuth и приводим ее к типу Jest.Mock
import { useAuth } from "@/context/AuthContext"; // Импортируем useAuth
const mockUseAuth = useAuth as jest.Mock; // Приводим к типу Jest.Mock

describe("UserMenu", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockLogout.mockClear();
    mockUseAuth.mockClear();
  });

  test("does not render when user is not logged in", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      userData: null,
      logout: mockLogout,
    });
    render(<UserMenu />);
    expect(screen.queryByTestId("user-menu")).not.toBeInTheDocument();
  });

  test("renders correctly for a regular user", () => {
    mockUseAuth.mockReturnValue({
      user: { uid: "test-user-id", email: "user@example.com" },
      userData: { role: "user", email: "user@example.com" },
      logout: mockLogout,
    });
    render(<UserMenu />);

    const menuButton = screen.getByRole("button", { name: "user@example.com" });
    fireEvent.click(menuButton);

    expect(screen.getByText("My Orders")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
    expect(screen.queryByText("Admin Dashboard")).not.toBeInTheDocument();
  });

  test("renders correctly for an admin user", () => {
    mockUseAuth.mockReturnValue({
      user: { uid: "admin-id", email: "admin@example.com" },
      userData: { role: "admin", email: "admin@example.com" },
      logout: mockLogout,
    });
    render(<UserMenu />);

    const menuButton = screen.getByRole("button", {
      name: "admin@example.com",
    });
    fireEvent.click(menuButton);

    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
    expect(screen.queryByText("My Orders")).not.toBeInTheDocument();
  });

  test("calls logout and redirects to home on sign out", async () => {
    mockUseAuth.mockReturnValue({
      user: { uid: "test-user-id", email: "user@example.com" },
      userData: { role: "user", email: "user@example.com" },
      logout: mockLogout,
    });
    render(<UserMenu />);

    const menuButton = screen.getByRole("button", { name: "user@example.com" });
    fireEvent.click(menuButton);

    const signOutButton = screen.getByRole("button", { name: /sign out/i });
    fireEvent.click(signOutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/"));
  });

  test("redirects to admin dashboard on click for admin user", async () => {
    mockUseAuth.mockReturnValue({
      user: { uid: "admin-id", email: "admin@example.com" },
      userData: { role: "admin", email: "admin@example.com" },
      logout: mockLogout,
    });
    render(<UserMenu />);

    const menuButton = screen.getByRole("button", {
      name: "admin@example.com",
    });
    fireEvent.click(menuButton);

    const adminButton = screen.getByRole("button", { name: "Admin Dashboard" });
    fireEvent.click(adminButton);

    expect(mockPush).toHaveBeenCalledWith("/admin");
  });

  test("matches snapshot for regular user when menu is open", () => {
    mockUseAuth.mockReturnValue({
      user: { uid: "test-user-id", email: "user@example.com" },
      userData: { role: "user", email: "user@example.com" },
      logout: mockLogout,
    });
    const { asFragment } = render(<UserMenu />);
    fireEvent.click(screen.getByRole("button", { name: "user@example.com" }));
    expect(asFragment()).toMatchSnapshot();
  });

  test("matches snapshot for admin user when menu is open", () => {
    mockUseAuth.mockReturnValue({
      user: { uid: "admin-id", email: "admin@example.com" },
      userData: { role: "admin", email: "admin@example.com" },
      logout: mockLogout,
    });
    const { asFragment } = render(<UserMenu />);
    fireEvent.click(screen.getByRole("button", { name: "admin@example.com" }));
    expect(asFragment()).toMatchSnapshot();
  });
});
