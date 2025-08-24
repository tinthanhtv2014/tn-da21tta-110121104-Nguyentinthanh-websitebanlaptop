const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Baserepository = require("base-repository");
const commentRepository = new Baserepository("Comment");
const createComment = async (data) => {
  try {
    let input = commentRepository.getModels("Comment");
    input = commentRepository.autoMapWithModel(data);

    const comment = await commentRepository.createAsync(input);
    return comment;
  } catch (error) {
    throw new Error(error.message || "Failed to create spotlight");
  }
};

const getAllComment = async (
  search,
  pageCurrent,
  pageSize,
  sortList = [],
  optionExtend = []
) => {
  try {
    console.log("sor", sortList);
    const filter = await commentRepository.reneRateInputFilter();
    if (search) {
      filter.searchValue = normalizeSearch(search);
    }
    filter.searchKey = ["name"];
    filter.pageSize = pageSize;
    filter.pageCurrent = pageCurrent;
    filter.orderBy = [{ updateDate: "desc" }];
    filter.sortList = sortList;
    return await commentRepository.toListAsync(filter);
  } catch (error) {
    throw new Error(error.message || "Failed to get spotlights");
  }
};

const getSpotlightById = async (id) => {
  try {
    const spotlight = await prisma.spotlight.findUnique({
      where: { id: parseInt(id) },
      include: {
        products: {
          include: { product: true },
        },
      },
    });
    if (!spotlight) throw new Error("Spotlight not found");
    return spotlight;
  } catch (error) {
    throw new Error(error.message || "Failed to get spotlight by id");
  }
};

const updateComment = async (id, data) => {
  try {
    const comment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data,
    });
    return comment;
  } catch (error) {
    throw new Error(error.message || "Failed to update comment");
  }
};

const deleteComment = async (id) => {
  try {
    const deleted = await prisma.comment.delete({
      where: { id: parseInt(id) },
    });
    return deleted;
  } catch (error) {
    throw new Error(error.message || "Failed to delete comment");
  }
};
module.exports = {
  createComment,
  getAllComment,
  getSpotlightById,
  updateComment,
  deleteComment,
};
