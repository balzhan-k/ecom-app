import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import SelectField from "@/components/common/SelectField";

describe("SelectField", () => {
  const options = [
    { value: "pens", label: "Pens" },
    { value: "notebooks", label: "Notebooks" },
    { value: "staplers", label: "Staplers" },
  ];

  const onChangeMock = jest.fn();

  beforeEach(() => {
    onChangeMock.mockClear();
  });

  test("renders with a label and initial value", () => {
    render(
      <SelectField
        label="Category"
        id="category"
        options={options}
        value="notebooks"
        onChange={onChangeMock}
      />
    );

    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Notebooks" })).toBeInTheDocument();
  });

  test("opens options on click and calls onChange when a new option is selected", async () => {
    const user = userEvent.setup();
    render(
      <SelectField
        label="Category"
        id="category"
        options={options}
        value="notebooks"
        onChange={onChangeMock}
      />
    );

    const listboxButton = screen.getByRole("button", { name: "Notebooks" });
    await user.click(listboxButton);

    const pensOption = await screen.findByRole("option", { name: "Pens" });
    expect(pensOption).toBeInTheDocument();

    await user.click(pensOption);

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith("pens");
  });

  test("displays a placeholder when no value is selected", () => {
    render(
      <SelectField
        label="Category"
        id="category"
        options={options}
        value=""
        onChange={onChangeMock}
      />
    );

    expect(screen.getByText("Select category")).toBeInTheDocument();
  });

  test("displays an error message when error prop is provided", () => {
    const error = { type: "required", message: "Category is required" };
    render(
      <SelectField
        label="Category"
        id="category"
        options={options}
        value=""
        onChange={onChangeMock}
        error={error}
      />
    );

    expect(screen.getByText("Category is required")).toBeInTheDocument();
  });

  test("matches snapshot", () => {
    const { asFragment } = render(
      <SelectField
        label="Category"
        id="category"
        options={options}
        value="notebooks"
        onChange={onChangeMock}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});