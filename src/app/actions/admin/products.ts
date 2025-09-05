"use server";
import "server-only";

import { collections, db } from "@/lib/firebase";
import { setDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { del } from "@vercel/blob";
import { productSchema } from "@/validations/productSchema";
import { ProductFormState } from "@/components/admin/ProductForm";
import { Product } from "@/types/product";
import {
  extractFormData,
  convertRawDataToInputs,
  removeUndefined,
} from "@/utils/productForm";
import {
  buildMetaForCreate,
  buildMetaForUpdate,
  buildFinalDocument,
  makeSuccessState,
  makeErrorState,
  ensureUniqueTitleOrError,
} from "./helpers";
import { toCents } from "@/utils/formatters";
import { stripe } from "@/lib/stripe";

export async function addNewProductAction(
  currentState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const rawData = extractFormData(formData);
  const isEditMode = !!rawData.id;

  const result = productSchema.safeParse(rawData);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return makeErrorState(
      "Please correct the form input",
      convertRawDataToInputs(rawData),
      errors
    );
  }

  if (result.data.images.length === 0) {
    return makeErrorState("At least one image is required.", result.data, {
      images: ["At least one image is required."],
    });
  }

  try {
    if (isEditMode) {
      const productId = rawData.id as string;
      const existingProductDoc = doc(db, collections.products, productId);
      const existingProductSnap = await getDoc(existingProductDoc);

      if (!existingProductSnap.exists()) {
        return {
          success: false,
          message: "Product not found.",
          inputs: result.data,
          errors: { id: ["Product not found"] },
        };
      }

      const existingProduct = existingProductSnap.data() as Product;

      if (existingProduct.title !== result.data.title) {
        const dup = await ensureUniqueTitleOrError(
          result.data.title,
          productId,
          result.data
        );
        if (dup) return dup;
      }

      const cleanData = removeUndefined(result.data);
      const meta = buildMetaForUpdate(existingProduct.meta?.createdAt);

      let stripeProductId = (
        existingProduct as Product & {
          stripeProductId?: string;
        }
      ).stripeProductId;

      if (stripeProductId) {
        await stripe.products.update(stripeProductId, {
          name: result.data.title,
          description: result.data.description,
          images: result.data.images?.slice(0, 8),
        });
      } else {
        const stripeProduct = await stripe.products.create({
          name: result.data.title,
          description: result.data.description,
          images: result.data.images?.slice(0, 8),
        });
        stripeProductId = stripeProduct.id;
      }

      let stripePriceId = (
        existingProduct as Product & {
          stripePriceId?: string;
        }
      ).stripePriceId;

      const priceInCents = toCents(result.data.price);
      const priceChanged =
        !stripePriceId || existingProduct.price !== result.data.price;

      if (priceChanged) {
        const stripePrice = await stripe.prices.create({
          unit_amount: priceInCents,
          currency: "usd",
          product: stripeProductId!,
        });
        stripePriceId = stripePrice.id;
      }

      const finalData = buildFinalDocument(
        {
          ...(cleanData as Record<string, unknown>),
          stripeProductId,
          stripePriceId,
        },
        productId,
        meta
      );

      await setDoc(doc(db, collections.products, productId), finalData);

      return makeSuccessState("The product is updated successfully", {
        ...result.data,
        meta: {
          createdAt:
            existingProduct.meta?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        id: productId,
      });
    } else {
      const id = Date.now().toString();

      const dup = await ensureUniqueTitleOrError(
        result.data.title,
        undefined,
        result.data
      );
      if (dup) return dup;

      const cleanData = removeUndefined(result.data);
      const meta = buildMetaForCreate();

      const stripeProduct = await stripe.products.create({
        name: result.data.title,
        description: result.data.description,
        images: result.data.images?.slice(0, 8),
      });

      const priceInCents = toCents(result.data.price);
      const stripePrice = await stripe.prices.create({
        unit_amount: priceInCents,
        currency: "usd",
        product: stripeProduct.id,
      });

      const finalData = buildFinalDocument(
        {
          ...(cleanData as Record<string, unknown>),
          stripeProductId: stripeProduct.id,
          stripePriceId: stripePrice.id,
        },
        id,
        meta
      );

      await setDoc(doc(db, collections.products, id), finalData);

      return makeSuccessState("The product is created successfully", {
        ...result.data,
        meta: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        id,
      });
    }
  } catch (err) {
    console.error("Error saving product to Firebase", err);

    return makeErrorState(
      isEditMode
        ? "Failed updating the product in the database"
        : "Failed creating a new product in the database",
      {
        ...result.data,
        meta: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        id: isEditMode ? rawData.id : undefined,
      }
    );
  }
}

// Backward-compatible export for components importing `AddNewProductAction`
export { addNewProductAction as AddNewProductAction };

async function deleteImagesFromBlob(imageUrls: string[]) {
  const deletePromises = imageUrls.map(async (url) => {
    try {
      const blobUrl = new URL(url);
      const pathname = blobUrl.pathname;

      await del(pathname);
      console.log(`Successfully deleted image: ${url}`);
    } catch (error) {
      console.error(`Failed to delete image ${url}:`, error);
      throw error;
    }
  });
  await Promise.all(deletePromises);
}

export async function DeleteProductAction(
  currentState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const rawData = extractFormData(formData);

  if (!rawData.id) {
    return {
      success: false,
      message: "Product ID is required",
      inputs: {},
      errors: { id: ["Product ID is required"] },
    };
  }
  const productId = rawData.id as string;

  try {
    const productDoc = doc(db, collections.products, productId);
    const productSnap = await getDoc(productDoc);

    if (!productSnap.exists()) {
      return {
        success: false,
        message: "Product not found",
        inputs: {},
        errors: { id: ["Product not found"] },
      };
    }

    const productData = productSnap.data() as Product;
    const imageUrls = productData.images || [];

    if (imageUrls.length > 0) {
      try {
        console.log("Deleting images:", imageUrls);
        await deleteImagesFromBlob(imageUrls);
        console.log("All images deleted successfully");
      } catch (imageError) {
        console.error("Error deleting images:", imageError);
      }
    }

    await deleteDoc(productDoc);

    return {
      success: true,
      message: "Product deleted successfully",
      inputs: {},
    };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      message: "Failed to delete product",
      inputs: {},
    };
  }
}
