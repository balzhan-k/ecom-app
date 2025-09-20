import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Button from "@/components/common/Button";

describe("Button", () => {
  const onClickMock = jest.fn();

  beforeEach(() => {
    onClickMock.mockClear();
  });

  test("renders with children", () => {
    render(<Button onClick={onClickMock}>Click Me</Button>);
    expect(screen.getByRole("button", { name: "Click Me" })).toBeInTheDocument();
  });

  test("calls onClick handler when clicked", async () => {
    const user = userEvent.setup();
    render(<Button onClick={onClickMock}>Click Me</Button>);

    await user.click(screen.getByRole("button", { name: "Click Me" }));
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  test("is disabled when disabled prop is true", () => {
    render(<Button onClick={onClickMock} disabled>Click Me</Button>);
    
    const button = screen.getByRole("button", { name: "Click Me" });
    expect(button).toBeDisabled();
  });

  test("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    render(<Button onClick={onClickMock} disabled>Click Me</Button>);

    await user.click(screen.getByRole("button", { name: "Click Me" }));
    expect(onClickMock).not.toHaveBeenCalled();
  });

  test("matches snapshot", () => {
    const { asFragment } = render(<Button onClick={onClickMock}>Snapshot Button</Button>);
    expect(asFragment()).toMatchSnapshot();
  });
});