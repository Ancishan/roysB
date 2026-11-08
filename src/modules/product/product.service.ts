import { prisma } from "../../prisma/prisma";

interface CreateProductData {
  name: string;

  slug: string;

  sku: string;

  shortDescription?: string;

  description?: string;

  categoryId: string;

  brandId?: string;

  price: number;

  discountPrice?: number;

  stock?: number;

  lowStockAlert?: number;

  material?: string;

  weight?: number;

  warranty?: string;

  isActive?: boolean;

  isFeatured?: boolean;

  isNewArrival?: boolean;

  metaTitle?: string;

  metaDescription?: string;

  images?: {
    url: string;

    altText?: string;

    sortOrder?: number;

    isPrimary?: boolean;
  }[];

  variants?: {
    sku: string;

    color?: string;

    size?: string;

    price?: number;

    stock: number;

    image?: string;
  }[];

  tagIds?: string[];
}

interface UpdateProductData {
  name?: string;

  slug?: string;

  sku?: string;

  shortDescription?: string;

  description?: string;

  categoryId?: string;

  brandId?: string;

  price?: number;

  discountPrice?: number;

  stock?: number;

  lowStockAlert?: number;

  material?: string;

  weight?: number;

  warranty?: string;

  isActive?: boolean;

  isFeatured?: boolean;

  isNewArrival?: boolean;

  metaTitle?: string;

  metaDescription?: string;

  images?: {
    url: string;

    altText?: string;

    sortOrder?: number;

    isPrimary?: boolean;
  }[];

  variants?: {
    sku: string;

    color?: string;

    size?: string;

    price?: number;

    stock: number;

    image?: string;
  }[];

  tagIds?: string[];
}

// --------------------------------------------------
// CREATE PRODUCT
// --------------------------------------------------

const createProduct = async (data: CreateProductData) => {
  // duplicate check

  const existingProduct = await prisma.product.findFirst({
    where: {
      OR: [
        {
          slug: data.slug,
        },

        {
          sku: data.sku,
        },
      ],
    },
  });

  if (existingProduct) {
    throw new Error("Product slug or SKU already exists");
  }

  const {
    images,

    variants,

    tagIds,

    ...productData
  } = data;

  return prisma.product.create({
    data: {
      ...productData,

      images: images
        ? {
            create: images,
          }
        : undefined,

      variants: variants
        ? {
            create: variants,
          }
        : undefined,

      tags: tagIds
        ? {
            create: tagIds.map((tagId) => ({
              tagId,
            })),
          }
        : undefined,
    },

    include: {
      category: true,

      brand: true,

      images: true,

      variants: true,

      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
};

// --------------------------------------------------
// GET ALL PRODUCTS
// --------------------------------------------------

const getProducts = async () => {
  return prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      category: true,

      brand: true,

      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },

      variants: true,

      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
};

// --------------------------------------------------
// GET PRODUCT BY ID
// --------------------------------------------------

const getProductById = async (id: string) => {
  return prisma.product.findUnique({
    where: {
      id,
    },

    include: {
      category: true,

      brand: true,

      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },

      variants: true,

      tags: {
        include: {
          tag: true,
        },
      },

      reviews: {
        where: {
          isApproved: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
};

// --------------------------------------------------
// UPDATE PRODUCT
// --------------------------------------------------

const updateProduct = async (
  id: string,

  data: UpdateProductData,
) => {
  const {
    images,

    variants,

    tagIds,

    ...productData
  } = data;

  return prisma.$transaction(async (tx) => {
    // check product

    const existingProduct = await tx.product.findUnique({
      where: {
        id,
      },
    });

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    // duplicate slug sku check

    if (data.slug || data.sku) {
      const duplicateProduct = await tx.product.findFirst({
        where: {
          OR: [
            data.slug
              ? {
                  slug: data.slug,
                }
              : undefined,

            data.sku
              ? {
                  sku: data.sku,
                }
              : undefined,
          ].filter(Boolean) as any,

          NOT: {
            id,
          },
        },
      });

      if (duplicateProduct) {
        throw new Error("Product slug or SKU already exists");
      }
    }

    // update basic data

    await tx.product.update({
      where: {
        id,
      },

      data: productData,
    });

    // update images

    if (images !== undefined) {
      await tx.productImage.deleteMany({
        where: {
          productId: id,
        },
      });

      if (images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((image) => ({
            productId: id,

            url: image.url,

            altText: image.altText,

            sortOrder: image.sortOrder ?? 0,

            isPrimary: image.isPrimary ?? false,
          })),
        });
      }
    }

    // update variants

    if (variants !== undefined) {
      await tx.productVariant.deleteMany({
        where: {
          productId: id,
        },
      });

      if (variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map((variant) => ({
            productId: id,

            sku: variant.sku,

            color: variant.color,

            size: variant.size,

            price: variant.price,

            stock: variant.stock,

            image: variant.image,
          })),
        });
      }
    }

    // update tags

    if (tagIds !== undefined) {
      await tx.productTag.deleteMany({
        where: {
          productId: id,
        },
      });

      if (tagIds.length > 0) {
        await tx.productTag.createMany({
          data: tagIds.map((tagId) => ({
            productId: id,

            tagId,
          })),
        });
      }
    }

    // return updated product

    return tx.product.findUnique({
      where: {
        id,
      },

      include: {
        category: true,

        brand: true,

        images: true,

        variants: true,

        tags: {
          include: {
            tag: true,
          },
        },

        reviews: {
          where: {
            isApproved: true,
          },
        },
      },
    });
  });
};

// --------------------------------------------------
// DELETE PRODUCT
// --------------------------------------------------

const deleteProduct = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return prisma.$transaction(async (tx) => {
    // delete order items first
    await tx.orderItem.deleteMany({
      where: {
        productId: id,
      },
    });

    // delete reviews
    await tx.review.deleteMany({
      where: {
        productId: id,
      },
    });

    // delete product images
    await tx.productImage.deleteMany({
      where: {
        productId: id,
      },
    });

    // delete variants
    await tx.productVariant.deleteMany({
      where: {
        productId: id,
      },
    });

    // delete tags
    await tx.productTag.deleteMany({
      where: {
        productId: id,
      },
    });

    // finally delete product
    return tx.product.delete({
      where: {
        id,
      },
    });
  });
};

export const productService = {
  createProduct,

  getProducts,

  getProductById,

  updateProduct,

  deleteProduct,
};
