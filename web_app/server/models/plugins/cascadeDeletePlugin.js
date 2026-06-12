const mongoose = require('mongoose');

module.exports = function cascadeDeletePlugin(schema, options) {
  const targets = Array.isArray(options) ? options : [options];

  schema.pre(['deleteOne', 'findOneAndDelete', 'deleteMany'], { document: true, query: true }, async function (next) {
    const session = this.options?.session || this.$session?.();

    let docIds = [];

    if (this instanceof mongoose.Document) {
      docIds = [this._id];
    } else {
      const filter = this.getFilter();

      const docsToDelete = await this.model.find(filter).session(session);

      if (!docsToDelete || docsToDelete.length === 0) return next();

      docIds = docsToDelete.map((doc) => doc._id);
    }

    const deletePromises = targets.map(({ modelName, foreignKey }) => {
      const TargetModel = mongoose.model(modelName);

      return TargetModel.deleteMany({
        [foreignKey]: { $in: docIds },
      }).session(session);
    });

    await Promise.all(deletePromises);

    next();
  });
};
