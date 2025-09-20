import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import FeaturedProducts from "@/components/common/FeaturedProducts";
import * as productUtils from "@/utils/products";
import { Product, Category, AvailabilityStatus, ReturnPolicy } from "@/types/product";

// РЕШЕНИЕ: Добавляем мок для fetch
global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve({}) })
) as jest.Mock;


// Мокируем ProductCard
jest.mock("@/components/products/ProductCard", () => {
  return jest.fn(({ product }) => <div data-testid="product-card">{product.title}</div>);
});

// Мокируем весь модуль с утилитами для продуктов
jest.mock("@/utils/products");

const mockProducts: Product[] = [
    { id: "1", title: "Discounted Pen", category: Category.PENS, price: 1.0, stock: 10, brand: 'brand', description: 'desc', weight: 1, dimensions: {width: 1, height: 1, depth: 1}, warrantyInformation: '', shippingInformation: '', availabilityStatus: AvailabilityStatus.IN_STOCK, returnPolicy: ReturnPolicy.NO_RETURN, minimumOrderQuantity: 1, meta: {createdAt: '', updatedAt: ''}, images: [] },
];

describe("FeaturedProducts", () => {
  beforeEach(() => {
    // Очищаем моки перед каждым тестом
    (productUtils.getDiscountedProducts as jest.Mock).mockClear();
  });

  test("renders loading state initially, then displays products", async () => {
    (productUtils.getDiscountedProducts as jest.Mock).mockResolvedValue(mockProducts);

    render(<FeaturedProducts />);

    expect(screen.getByText("Featured Products")).toBeInTheDocument();
    
    // Ждем, пока компонент обновится с данными
    const productCard = await screen.findByTestId("product-card");
    expect(productCard).toBeInTheDocument();
    expect(screen.getByText("Discounted Pen")).toBeInTheDocument();
  });

  test("renders null if no discounted products are found", async () => {
    (productUtils.getDiscountedProducts as jest.Mock).mockResolvedValue([]);

    const { container } = render(<FeaturedProducts />);
    
    // Ждем, пока промис разрешится, и проверяем, что компонент ничего не отрендерил
    await waitFor(() => {
        expect(container.firstChild).toBeNull();
    });
  });
});