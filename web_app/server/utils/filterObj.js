module.exports = (obj, ...allowFields) => {
	const newObj = {};
	// biome-ignore lint/complexity/noForEach: <explanation>
	Object.keys(obj).forEach((el) => {
		if (allowFields.includes(el)) {
			newObj[el] = obj[el];
		}
	});
	return newObj;
};
