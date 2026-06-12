const { ChildModel } = require('../models/index');

const getParents = async (childId, options) =>
  await ChildModel.findById(childId).populate({
    path: 'parents',
    select: options.firstSelect,
    populate: {
      path: 'parent_id',
      select: options.secondSelect,
    },
  });

module.exports = { getParents };
