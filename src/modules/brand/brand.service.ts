import { prisma } from "../../prisma/prisma";

interface CreateBrandData {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  isActive?: boolean;
}

const createBrand = async (data: CreateBrandData) => {
  return prisma.brand.create({
    data,
  });
};

const getBrands = async () => {
  return prisma.brand.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      products: true,
    },
  });
};

const getBrandById = async (id: string) => {
  return prisma.brand.findUnique({
    where: {
      id,
    },
    include: {
      products: true,
    },
  });
};

const updateBrand = async (
  id: string,
  data: Partial<CreateBrandData>
) => {
  return prisma.brand.update({
    where: {
      id,
    },
    data,
  });
};

const deleteBrand = async (id: string) => {
  const brand = await prisma.brand.findUnique({
    where: {
      id,
    },
    include: {
      products: true,
    },
  });

  if (!brand) {
    throw new Error("Brand not found");
  }

  if (brand.products.length > 0) {
    throw new Error(
      "Cannot delete brand because it has products"
    );
  }

  return prisma.brand.delete({
    where: {
      id,
    },
  });
};

export const brandService = {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};