import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import ImageUploadField from "@/components/common/ImageUploadField";

// Мокируем next/image
jest.mock(
  "next/image",
  () =>
    ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />
);


// Мокируем глобальные функции
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ url: "http://example.com/new-image.jpg" }),
  })
) as jest.Mock;

// РЕШЕНИЕ: Добавляем тип : File для аргумента
global.URL.createObjectURL = jest.fn((file: File) => `blob:${file.name}`);

describe("ImageUploadField", () => {
  const onChangeMock = jest.fn();

  beforeEach(() => {
    onChangeMock.mockClear();
    (global.fetch as jest.Mock).mockClear();
  });

  // Добавляем data-testid в компонент для надежного поиска
  const renderComponent = () => {
    render(<ImageUploadField value={[]} onChange={onChangeMock} />);
    // Добавляем data-testid к скрытому input, чтобы его было легче найти
    const input = screen.getByRole('button', { name: /upload photo/i }).previousElementSibling as HTMLInputElement;
    input.setAttribute('data-testid', 'photoUpload');
    return { user: userEvent.setup() };
  };


  test("uploads a file, shows a preview, and calls onChange", async () => {
    const { user } = renderComponent();

    const file = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" });
    const input = screen.getByTestId("photoUpload");

    await user.upload(input, file);

    const previewImage = await screen.findByAltText("Selected Photo Preview 1");
    expect(previewImage).toBeInTheDocument();
    
    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalledWith(["http://example.com/new-image.jpg"]);
    });
  });

  test("renders the upload button", () => {
    render(<ImageUploadField value={[]} onChange={onChangeMock} />);
    expect(screen.getByRole("button", { name: "Upload Photo(s)" })).toBeInTheDocument();
  });

  test("removes an image when the remove button is clicked", async () => {
    const user = userEvent.setup();
    const initialUrls = ["http://example.com/image1.jpg"];
    render(<ImageUploadField value={initialUrls} onChange={onChangeMock} />);

    const removeButton = screen.getByRole("button", { name: "✕" });
    await user.click(removeButton);

    expect(onChangeMock).toHaveBeenCalledWith([]);
    expect(screen.queryByAltText("Selected Photo Preview 1")).not.toBeInTheDocument();
  });
});