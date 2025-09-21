import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types/product";
import { Category, AvailabilityStatus, ReturnPolicy } from "@/types/product";

jest.mock(
  "next/image",
  () =>
    ({
      src,
      alt,
      width,
      height,
      fill,
      ...props
    }: {
      src: string;
      alt: string;
      width?: number;
      height?: number;
      fill?: boolean;
      [key: string]: any;
    }) => {
      return (
        <img src={src} alt={alt} width={width} height={height} {...props} />
      );
    }
);

jest.mock("next/navigation", () => require("next-router-mock"));

const mockProduct: Product = {
  id: "101",
  title: "Premium Notebook",
  brand: "Stationery World",
  description: "Hardcover notebook with dotted pages",
  price: 12.5,
  discountPercentage: 15,
  stock: 20,
  category: Category.NOTEBOOKS,
  images: ["https://example.com/notebook.jpg"],
  weight: 100,
  dimensions: {
    width: 10,
    height: 2,
    depth: 15,
  },
  warrantyInformation: "1 year limited warranty",
  shippingInformation: "Ships in 2-3 business days",
  availabilityStatus: AvailabilityStatus.IN_STOCK,
  returnPolicy: ReturnPolicy.DAYS_30,
  minimumOrderQuantity: 1,
  meta: {
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
};

describe("ProductCard", () => {
  test("renders link with correct href", () => {
    render(<ProductCard product={mockProduct} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/categories/products/101");
  });

  test("renders product title from ProductCardBase", () => {
    render(<ProductCard product={mockProduct} />);

    const expectedTitle = `${mockProduct.brand}. ${mockProduct.title}`;
    expect(screen.getByText(expectedTitle)).toBeInTheDocument();
  });

  test("matches snapshot", () => {
    const { asFragment } = render(<ProductCard product={mockProduct} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
