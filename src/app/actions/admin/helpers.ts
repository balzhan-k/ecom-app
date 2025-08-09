import { collections, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { ProductFormState } from "@/components/admin/ProductForm";
import { removeUndefined } from "@/utils/productForm";

export function buildMetaForCreate() {
  return {
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export function buildMetaForUpdate(existingCreatedAt?: unknown) {
  return {
    createdAt: existingCreatedAt || serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export function buildFinalDocument(cleanData: any, id: string, meta: any) {
  return removeUndefined({
    ...cleanData,
    meta,
    id,
  });
}

export function makeSuccessState(
  message: string,
  inputs: any
): ProductFormState {
  return {
    success: true,
    message,
    inputs,
  };
}

export function makeErrorState(
  message: string,
  inputs: any = {},
  errors: Record<string, string[]> = {}
): ProductFormState {
  return {
    success: false,
    message,
    inputs,
    errors,
  };
}

export async function ensureUniqueTitleOrError(
  title: string,
  currentId?: string,
  inputsOnError: any = {}
): Promise<ProductFormState | null> {
  const productsRef = collection(db, collections.products);
  const q = query(productsRef, where("title", "==", title));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  if (currentId) {
    const hasOther = snapshot.docs.some((d) => d.id !== currentId);
    if (!hasOther) {
      return null;
    }
  }

  return makeErrorState(
    "A product with this title already exists.",
    inputsOnError,
    { title: ["A product with this title already exists."] }
  );
}
