import { render, screen } from "@testing-library/react";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types/product";
import { Category, AvailabilityStatus, ReturnPolicy } from "@/types/product";

jest.mock("next/image", () => (props: any) => {
  return <img {...props} alt={props.alt} />;
});

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
  test("рендерит ссылку с правильным href", () => {
    render(<ProductCard product={mockProduct} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/categories/products/101");
  });

  test("рендерит заголовок продукта из ProductCardBase", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
  });

  test("совпадает со снапшотом", () => {
    const { asFragment } = render(<ProductCard product={mockProduct} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
