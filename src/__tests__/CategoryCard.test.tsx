import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CategoryCard from "@/components/categories/CategoryCard";
import { Category } from "@/types/product";

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe("CategoryCard", () => {
  test("renders the category card with the correct link and name", () => {
    render(<CategoryCard category={Category.NOTEBOOKS} />);

    expect(screen.getByText(Category.NOTEBOOKS)).toBeInTheDocument();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/categories/notebooks");
  });

  test("handles categories with slashes correctly", () => {
    render(<CategoryCard category={Category.STAPLERS_STAPLES} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/categories/staplers-staples");
  });

  test("matches snapshot", () => {
    const { asFragment } = render(<CategoryCard category={Category.PENS} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
