import { prisma } from "../../prisma/prisma";

interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  parentId?: string;
}

const createCategory = async (data: CreateCategoryData) => {
  const existing =
await prisma.category.findUnique({
  where:{
    slug:data.slug
  }
});


if(existing){

 throw new Error(
 "Category slug already exists"
 );

}
  return prisma.category.create({
    data,
  });
};

const getCategories = async () => {
  return prisma.category.findMany({
    where: {
      parentId: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      children: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
};

const getCategoryById = async (id: string) => {
  return prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      children: true,
      products: true,
    },
  });
};

const updateCategory = async (
  id: string,
  data: Partial<CreateCategoryData>
) => {


  // Check category exists
  const category =
    await prisma.category.findUnique({

      where: {
        id,
      },

    });



  if (!category) {

    throw new Error(
      "Category not found"
    );

  }



  // Check duplicate slug
  if (data.slug) {

    const existingCategory =
      await prisma.category.findUnique({

        where: {
          slug: data.slug,
        },

      });



    if (
      existingCategory &&
      existingCategory.id !== id
    ) {

      throw new Error(
        "Category slug already exists"
      );

    }

  }



  // Update category
  return prisma.category.update({

    where: {
      id,
    },

    data,

  });

};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      children: true,
      products: true,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  if (category.children.length > 0) {
    throw new Error(
      "Cannot delete category because it has subcategories"
    );
  }

  if (category.products.length > 0) {
    throw new Error(
      "Cannot delete category because it has products"
    );
  }

  return prisma.category.delete({
    where: {
      id,
    },
  });
};

export const categoryService = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};