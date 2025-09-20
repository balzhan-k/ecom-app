import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import ImageUploadField from "@/components/common/ImageUploadField";
import { fireEvent } from "@testing-library/react";

global.URL.createObjectURL = jest.fn((file: File) => `blob:${file.name}`);

describe("ImageUploadField", () => {
  const onChangeMock = jest.fn();

  beforeEach(() => {
    onChangeMock.mockClear();
    (global.fetch as jest.Mock).mockClear();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ url: "http://example.com/new-image.jpg" }),
    });
  });

  test("uploads a file, shows a preview, and calls onChange", async () => {
    const user = userEvent.setup();
    render(<ImageUploadField value={[]} onChange={onChangeMock} />);

    const uploadButton = screen.getByRole("button", {
      name: /Upload Photo\(s\)/i,
    });
    await user.click(uploadButton);

    const file = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" });
    const input = screen.getByTestId("photoUpload");

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(
        screen.getByAltText("Selected Photo Preview 1")
      ).toBeInTheDocument();
    });

    expect(onChangeMock).toHaveBeenCalledWith([
      "http://example.com/new-image.jpg",
    ]);
  });
});
