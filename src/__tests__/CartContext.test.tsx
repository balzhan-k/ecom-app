import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "@/context/CartContext";

describe("CartContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  const testItem = {
    id: "1",
    name: "Test Product",
    price: 100,
    thumbnail: "img.png",
    stock: 5,
  };

  beforeEach(() => {
    localStorage.clear(); 
  });

  test("adds item to cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(testItem, 2);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0]).toMatchObject({
      ...testItem,
      quantity: 2,
    });
  });

  test("increases quantity of an existing item", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(testItem, 1);
      result.current.increaseQuantity("1");
    });

    expect(result.current.cart[0].quantity).toBe(2);
  });

  test("decreases quantity but not below 1", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(testItem, 2);
      result.current.decreaseQuantity("1");
    });

    expect(result.current.cart[0].quantity).toBe(1);

    act(() => {
      result.current.decreaseQuantity("1");
    });

    expect(result.current.cart[0].quantity).toBe(1);
  });

  test("removes item from cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(testItem, 1);
      result.current.removeFromCart("1");
    });

    expect(result.current.cart).toHaveLength(0);
  });

  test("clears the entire cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(testItem, 1);
      result.current.addToCart(
        { ...testItem, id: "2", name: "Second Product" },
        1
      );
      result.current.clearCart();
    });

    expect(result.current.cart).toHaveLength(0);
  });

  test("calculates total items correctly", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(testItem, 2);
      result.current.addToCart(
        { ...testItem, id: "2", name: "Second Product" },
        3
      );
    });

    expect(result.current.getTotalItems()).toBe(5);
  });

  test("calculates total price correctly", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(testItem, 2); // 2 * 100 = 200
      result.current.addToCart(
        { ...testItem, id: "2", name: "Second Product", price: 50 },
        3
      ); 
    });

    expect(result.current.getTotalPrice()).toBe(350);
  });
});
