import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import InputField from "@/components/common/InputField";
import { useForm } from "react-hook-form";
import { FC } from "react";

const TestHost: FC<{ type?: string; error?: any }> = ({ type, error }) => {
  const { register } = useForm();
  return (
    <InputField
      label="Test Label"
      id="test-input"
      type={type || "text"}
      placeholder="Test Placeholder"
      register={register("testInput")}
      error={error}
    />
  );
};

describe("InputField", () => {
  test("renders a text input correctly", () => {
    render(<TestHost />);

    const input = screen.getByLabelText("Test Label");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Test Placeholder");
  });

  test("renders a textarea correctly", () => {
    render(<TestHost type="textarea" />);

    const textarea = screen.getByLabelText("Test Label");
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  test("displays an error message when provided", () => {
    const error = { type: "required", message: "This field is required" };
    render(<TestHost error={error} />);

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  test("matches snapshot", () => {
    const { asFragment } = render(<TestHost />);
    expect(asFragment()).toMatchSnapshot();
  });
});
