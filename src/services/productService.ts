// services/productService.ts
import axiosClient from "@/lib/axiosClient";
import type {
  Product,
  ProductCreateInput,
  ProductUpdateInput,
  VariantInput,
} from "@/types/product";

export const productService = {
  async fetchProducts(
    page = 1,
    limit = 10
  ): Promise<{ items: Product[]; total: number }> {
    const res = await axiosClient.get(`/api/products`, {
      params: { page, limit },
    });
    return res.data;
  },

  async createProduct(data: ProductCreateInput): Promise<Product> {
    const formData = new FormData();

    // stringify all fields except files
    const productData = {
      name: data.name,
      brand: data.brand,
      description: data.description,
      categoryId: data.categoryId,
      gender: data.gender,
      price: data.price,
      newPrice: data.newPrice,
    };
    formData.append("data", JSON.stringify(productData));

    // files
    if (data.image) formData.append("image", data.image);

    const res = await axiosClient.post(`/api/products`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  },

  async updateProduct(data: ProductUpdateInput): Promise<Product> {
    const formData = new FormData();

    // stringify fields except files
    const productData: any = {};
    if (data.name) productData.name = data.name;
    if (data.brand) productData.brand = data.brand;
    if (data.description) productData.description = data.description;
    if (data.categoryId) productData.categoryId = data.categoryId;
    if (data.gender) productData.gender = data.gender;
    if (data.price !== undefined) productData.price = data.price;
    if (data.newPrice !== undefined) productData.newPrice = data.newPrice;

    formData.append("data", JSON.stringify(productData));

    // files
    if (data.image) formData.append("image", data.image);

    const res = await axiosClient.put(`/api/products/${data.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  },

  async createVariants(productId: string, variants: VariantInput[]) {
    const formData = new FormData();

    // stringify variant data except files
    formData.append(
      "variants",
      JSON.stringify(
        variants.map((v) => ({
          color: v.color,
          size: v.size,
          qte: v.qte,
          id: v.id,
        }))
      )
    );

    // append variant images
    variants.forEach((variant, idx) => {
      variant.images.forEach((img) => {
        if (img instanceof File) {
          formData.append(`variantImages[${idx}][]`, img);
        }
      });
    });

    await axiosClient.post(`/api/products/${productId}/variants`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async updateVariants(productId: string, variants: VariantInput[]) {
    const formData = new FormData();

    // stringify variant data except files
    formData.append(
      "variants",
      JSON.stringify(
        variants.map((v) => ({
          id: v.id,
          color: v.color,
          size: v.size,
          qte: v.qte,
        }))
      )
    );

    // append variant images
    variants.forEach((variant, idx) => {
      variant.images.forEach((img) => {
        if (img instanceof File) {
          formData.append(`variantImages[${idx}][]`, img);
        }
      });
    });

    await axiosClient.put(`/api/variants/bulk/${productId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
