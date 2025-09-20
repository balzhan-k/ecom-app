import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductGrid from "@/components/products/ProductGrid";
import { Product, Category, AvailabilityStatus, ReturnPolicy } from "@/types/product";

jest.mock("@/components/products/ProductCard", () => {
  return jest.fn(({ product }) => <div data-testid="product-card">{product.title}</div>);
});

const mockProducts: Product[] = [
  { id: "1", title: "Pen", category: Category.PENS, price: 1.0, stock: 10, brand: 'brand', description: 'desc', weight: 1, dimensions: {width: 1, height: 1, depth: 1}, warrantyInformation: '', shippingInformation: '', availabilityStatus: AvailabilityStatus.IN_STOCK, returnPolicy: ReturnPolicy.NO_RETURN, minimumOrderQuantity: 1, meta: {createdAt: '', updatedAt: ''}, images: [] },
  { id: "2", title: "Notebook", category: Category.NOTEBOOKS, price: 2.5, stock: 5, brand: 'brand', description: 'desc', weight: 1, dimensions: {width: 1, height: 1, depth: 1}, warrantyInformation: '', shippingInformation: '', availabilityStatus: AvailabilityStatus.IN_STOCK, returnPolicy: ReturnPolicy.NO_RETURN, minimumOrderQuantity: 1, meta: {createdAt: '', updatedAt: ''}, images: [] },
];

describe("ProductGrid", () => {
  test("renders a grid of products", () => {
    render(<ProductGrid products={mockProducts} />);

    const productCards = screen.getAllByTestId("product-card");
    expect(productCards).toHaveLength(2);
    expect(screen.getByText("Pen")).toBeInTheDocument();
    expect(screen.getByText("Notebook")).toBeInTheDocument();
  });

  test("renders a message when no products are provided", () => {
    render(<ProductGrid products={[]} />);

    expect(screen.getByText("No products found in this category.")).toBeInTheDocument();
    expect(screen.queryByTestId("product-card")).not.toBeInTheDocument();
  });

  test("matches snapshot with products", () => {
    const { asFragment } = render(<ProductGrid products={mockProducts} />);
    expect(asFragment()).toMatchSnapshot();
  });
});