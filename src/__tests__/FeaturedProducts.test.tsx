import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import FeaturedProducts from "@/components/common/FeaturedProducts";
import * as productUtils from "@/utils/products";
import {
  Product,
  Category,
  AvailabilityStatus,
  ReturnPolicy,
} from "@/types/product";

// Мокируем ProductCard
jest.mock("@/components/products/ProductCard", () => {
  return jest.fn(({ product }) => (
    <div data-testid="product-card">{product.title}</div>
  ));
});

// Мокируем модуль с утилитами для продуктов
jest.mock("@/utils/products");

const mockProducts: Product[] = [
  {
    id: "1",
    title: "Discounted Pen",
    category: Category.PENS,
    price: 1.0,
    stock: 10,
    brand: "brand",
    description: "desc",
    weight: 1,
    dimensions: { width: 1, height: 1, depth: 1 },
    warrantyInformation: "",
    shippingInformation: "",
    availabilityStatus: AvailabilityStatus.IN_STOCK,
    returnPolicy: ReturnPolicy.NO_RETURN,
    minimumOrderQuantity: 1,
    meta: { createdAt: "", updatedAt: "" },
    images: [],
  },
];

describe("FeaturedProducts", () => {
  beforeEach(() => {
    // Очищаем мок перед каждым тестом для чистоты
    (productUtils.getDiscountedProducts as jest.Mock).mockClear();
  });

  test("displays products after loading", async () => {
    (productUtils.getDiscountedProducts as jest.Mock).mockResolvedValue(
      mockProducts
    );

    render(<FeaturedProducts />);

    // Ждем, пока карточка продукта появится на экране
    const productCard = await screen.findByTestId("product-card");
    expect(productCard).toBeInTheDocument();
    expect(screen.getByText("Discounted Pen")).toBeInTheDocument();
  });

  test("renders null if no products are found", async () => {
    (productUtils.getDiscountedProducts as jest.Mock).mockResolvedValue([]);
    const { container } = render(<FeaturedProducts />);
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });
});
