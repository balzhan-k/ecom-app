import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { Product, Category } from "@/types/product";

function firestoreTimestampToObject(data: unknown): unknown {
  if (data === null || data === undefined) {
    return data;
  }

  if (data instanceof Timestamp) {
    return data.toDate().toISOString();
  }

  if (Array.isArray(data)) {
    return data.map(firestoreTimestampToObject);
  }

  if (typeof data === "object" && data !== null) {
    const converted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      converted[key] = firestoreTimestampToObject(value);
    }
    return converted;
  }

  return data;
}

export async function getProductsByCategory(
  category: Category
): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products");

    const q = query(productsRef, where("category", "==", category));

    const querySnapshot = await getDocs(q);

    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      const rawData = doc.data();
      const convertedData = firestoreTimestampToObject(rawData);

      const product = {
        id: doc.id,
        ...(convertedData as Record<string, unknown>),
      } as Product;

      products.push(product);
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const productsRef = collection(db, "products");
    const productDoc = doc(productsRef, id);
    const docSnap = await getDoc(productDoc);

    if (docSnap.exists()) {
      const rawData = docSnap.data();
      const convertedData = firestoreTimestampToObject(rawData);

      return {
        id: docSnap.id,
        ...(convertedData as Record<string, unknown>),
      } as Product;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products");
    const querySnapshot = await getDocs(productsRef);

    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      const rawData = doc.data();
      const convertedData = firestoreTimestampToObject(rawData);

      products.push({
        id: doc.id,
        ...(convertedData as Record<string, unknown>),
      } as Product);
    });

    return products;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

export async function getRandomProducts(count: number = 4): Promise<Product[]> {
  try {
    const allProducts = await getAllProducts();

    // Перемешиваем массив товаров и берем первые count элементов
    const shuffled = allProducts.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  } catch (error) {
    console.error("Error fetching random products:", error);
    return [];
  }
}
