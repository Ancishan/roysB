import { prisma } from "../../prisma/prisma";

interface CreateTagData {
  name: string;
  slug: string;
}


// --------------------------------------------------
// CREATE TAG
// --------------------------------------------------

const createTag = async (
  data: CreateTagData
) => {
  return prisma.tag.create({
    data,
  });
};


// --------------------------------------------------
// GET ALL TAGS
// --------------------------------------------------

const getTags = async () => {
  return prisma.tag.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
  });
};


// --------------------------------------------------
// GET TAG BY ID
// --------------------------------------------------

const getTagById = async (
  id: string
) => {
  return prisma.tag.findUnique({
    where: {
      id,
    },

    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
  });
};


// --------------------------------------------------
// UPDATE TAG
// --------------------------------------------------

const updateTag = async (
  id: string,
  data: Partial<CreateTagData>
) => {
  return prisma.tag.update({
    where: {
      id,
    },

    data,
  });
};


// --------------------------------------------------
// DELETE TAG
// --------------------------------------------------

const deleteTag = async (
  id: string
) => {
  const existingTag =
    await prisma.tag.findUnique({
      where: {
        id,
      },

      include: {
        products: true,
      },
    });

  if (!existingTag) {
    throw new Error("Tag not found");
  }

  return prisma.tag.delete({
    where: {
      id,
    },
  });
};


export const tagService = {
  createTag,
  getTags,
  getTagById,
  updateTag,
  deleteTag,
};