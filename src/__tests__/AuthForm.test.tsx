import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthForm } from "@/components/auth/AuthForm";

const onSubmitMock = jest.fn();
const onGoogleAuthMock = jest.fn();
const loadingMock = false;

describe("AuthForm", () => {
  it("snapshot for login form", () => {
    render(
      <AuthForm
        type={"login"}
        onSubmit={onSubmitMock}
        onGoogleAuth={onGoogleAuthMock}
        loading={loadingMock}
      />
    );
    expect(screen.getByTestId("auth-form")).toMatchSnapshot();
  });
  it("snapshot for register form", () => {
    render(
      <AuthForm
        type={"register"}
        onSubmit={onSubmitMock}
        onGoogleAuth={onGoogleAuthMock}
        loading={loadingMock}
      />
    );
    expect(screen.getByTestId("auth-form")).toMatchSnapshot();
  });

  beforeEach(() => {
    onSubmitMock.mockClear();
    onGoogleAuthMock.mockClear();
  });

  describe("Login form", () => {
    it("renders login form correctly", () => {
      render(
        <AuthForm
          type={"login"}
          onSubmit={onSubmitMock}
          onGoogleAuth={onGoogleAuthMock}
          loading={loadingMock}
        />
      );

      expect(screen.getByTestId("auth-form")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Sign In" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Sign In" })
      ).toBeInTheDocument();
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Sign Up" })).toBeInTheDocument();
      expect(
        screen.queryByText("Already have an account?")
      ).not.toBeInTheDocument();
    });

    it("calls onSubmit with email and password on form submission", async () => {
      const user = userEvent.setup();
      render(
        <AuthForm
          type="login"
          onSubmit={onSubmitMock}
          onGoogleAuth={onGoogleAuthMock}
          loading={false}
        />
      );

      await user.type(screen.getByLabelText("Email"), "test@example.com");
      await user.type(screen.getByLabelText("Password"), "password123");
      await user.click(screen.getByRole("button", { name: "Sign In" }));

      expect(onSubmitMock).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
    });

    it("shows an error if email or password fields are empty", async () => {
      const user = userEvent.setup();
      render(
        <AuthForm
          type="login"
          onSubmit={onSubmitMock}
          onGoogleAuth={onGoogleAuthMock}
          loading={false}
        />
      );

      await user.click(screen.getByRole("button", { name: "Sign In" }));

      expect(
        await screen.findByText("Please fill in all fields")
      ).toBeInTheDocument();
      expect(onSubmitMock).not.toHaveBeenCalled();
    });
  });

  describe("Register form", () => {
    it("renders register form correctly", () => {
      render(
        <AuthForm
          type={"register"}
          onSubmit={onSubmitMock}
          onGoogleAuth={onGoogleAuthMock}
          loading={loadingMock}
        />
      );

      expect(
        screen.getByRole("heading", { name: "Create Account" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Sign Up" })
      ).toBeInTheDocument();
      expect(screen.getByText("Already have an account?")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Sign In" })).toBeInTheDocument();
      expect(
        screen.queryByText("Don't have an account?")
      ).not.toBeInTheDocument();
    });

    it("shows an error if passwords do not match", async () => {
      const user = userEvent.setup();
      render(
        <AuthForm
          type="register"
          onSubmit={onSubmitMock}
          onGoogleAuth={onGoogleAuthMock}
          loading={false}
        />
      );

      await user.type(screen.getByLabelText("Email"), "test@example.com");
      await user.type(screen.getByLabelText("Password"), "password123");
      await user.type(screen.getByLabelText("Confirm Password"), "password456");
      await user.click(screen.getByRole("button", { name: "Sign Up" }));

      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
      expect(onSubmitMock).not.toHaveBeenCalled();
    });

    it("shows an error if password is too short during registration", async () => {
      const user = userEvent.setup();
      render(
        <AuthForm
          type="register"
          onSubmit={onSubmitMock}
          onGoogleAuth={onGoogleAuthMock}
          loading={false}
        />
      );

      await user.type(screen.getByLabelText("Email"), "test@example.com");
      await user.type(screen.getByLabelText("Password"), "123");
      await user.type(screen.getByLabelText("Confirm Password"), "123");
      await user.click(screen.getByRole("button", { name: "Sign Up" }));

      expect(
        screen.getByText("Password must be at least 6 characters long")
      ).toBeInTheDocument();
      expect(onSubmitMock).not.toHaveBeenCalled();
    });
  });

  describe("General error handling", () => {
    it("shows a general error message if onSubmit fails", async () => {
      const user = userEvent.setup();
      onSubmitMock.mockImplementationOnce(() => {
        throw new Error("Test error message");
      });

      render(
        <AuthForm
          type="login"
          onSubmit={onSubmitMock}
          onGoogleAuth={onGoogleAuthMock}
          loading={false}
        />
      );

      await user.type(screen.getByLabelText("Email"), "test@example.com");
      await user.type(screen.getByLabelText("Password"), "password123");
      await user.click(screen.getByRole("button", { name: "Sign In" }));

      expect(screen.getByText("Test error message")).toBeInTheDocument();
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("Loading state", () => {
    it("disables buttons and shows loading text", () => {
      render(
        <AuthForm
          type="login"
          onSubmit={onSubmitMock}
          onGoogleAuth={onGoogleAuthMock}
          loading={true}
        />
      );
      const submitButton = screen.getByRole("button", { name: "Loading..." });
      expect(submitButton).toBeDisabled();

      const googleButton = screen.getByRole("button", { name: /google/i });
      expect(googleButton).toBeDisabled();
    });
  });
});
