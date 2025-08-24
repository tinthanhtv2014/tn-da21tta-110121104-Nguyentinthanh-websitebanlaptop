const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Baserepository = require("base-repository");
const feedbackRepository = new Baserepository("Feedback");
const createFeedback = async (data) => {
  try {
    let input = feedbackRepository.getModels("Feedback");
    input = feedbackRepository.autoMapWithModel(data);

    const comment = await feedbackRepository.createAsync(input);
    return comment;
  } catch (error) {
    throw new Error(error.message || "Failed to create spotlight");
  }
};

const getAllFeedback = async (
  search,
  pageCurrent,
  pageSize,
  sortList = [],
  optionExtend = []
) => {
  try {
    console.log("sor", sortList);
    const filter = await feedbackRepository.reneRateInputFilter();
    if (search) {
      filter.searchValue = normalizeSearch(search);
    }
    filter.searchKey = ["name"];
    filter.pageSize = pageSize;
    filter.pageCurrent = pageCurrent;
    filter.orderBy = [{ updateDate: "desc" }];
    filter.sortList = sortList;
    return await feedbackRepository.toListAsync(filter);
  } catch (error) {
    throw new Error(error.message || "Failed to get spotlights");
  }
};

const deleteFeedback = async (id) => {
  try {
    const deleted = await prisma.feedback.delete({
      where: { id: parseInt(id) },
    });
    return deleted;
  } catch (error) {
    throw new Error(error.message || "Failed to delete comment");
  }
};

module.exports = {
  createFeedback,
  getAllFeedback,

  deleteFeedback,
};
