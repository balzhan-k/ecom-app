import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import QuantityControl from "@/components/common/QuantityControl";

describe("QuantityControl", () => {
  const onIncreaseMock = jest.fn();
  const onDecreaseMock = jest.fn();

  beforeEach(() => {
    onIncreaseMock.mockClear();
    onDecreaseMock.mockClear();
  });

  test("renders correctly with initial quantity", () => {
    render(
      <QuantityControl
        quantity={5}
        onIncrease={onIncreaseMock}
        onDecrease={onDecreaseMock}
      />
    );

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("calls onIncrease when the '+' button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <QuantityControl
        quantity={5}
        onIncrease={onIncreaseMock}
        onDecrease={onDecreaseMock}
      />
    );

    const increaseButton = screen.getByRole("button", { name: "+" });
    await user.click(increaseButton);

    expect(onIncreaseMock).toHaveBeenCalledTimes(1);
    expect(onDecreaseMock).not.toHaveBeenCalled();
  });

  test("calls onDecrease when the '-' button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <QuantityControl
        quantity={5}
        onIncrease={onIncreaseMock}
        onDecrease={onDecreaseMock}
      />
    );

    const decreaseButton = screen.getByRole("button", { name: "-" });
    await user.click(decreaseButton);

    expect(onDecreaseMock).toHaveBeenCalledTimes(1);
    expect(onIncreaseMock).not.toHaveBeenCalled();
  });

  test("disables the '+' button when quantity reaches maxQuantity", () => {
    render(
      <QuantityControl
        quantity={10}
        maxQuantity={10}
        onIncrease={onIncreaseMock}
        onDecrease={onDecreaseMock}
      />
    );

    const increaseButton = screen.getByRole("button", { name: "+" });
    expect(increaseButton).toBeDisabled();
  });

  test("disables the '-' button when quantity reaches minQuantity", () => {
    render(
      <QuantityControl
        quantity={1}
        minQuantity={1}
        onIncrease={onIncreaseMock}
        onDecrease={onDecreaseMock}
      />
    );

    const decreaseButton = screen.getByRole("button", { name: "-" });
    expect(decreaseButton).toBeDisabled();
  });

  test("matches snapshot", () => {
    const { asFragment } = render(
      <QuantityControl
        quantity={3}
        onIncrease={onIncreaseMock}
        onDecrease={onDecreaseMock}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});