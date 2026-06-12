const getLocalFile = async (path) => {
  const response = await fetch(path);
  const blob = await response.blob();

  const fileName = path.split("/").pop();
  const fileType = blob.type;

  const file = new File([blob], fileName, { type: fileType });

  const dataTransfer = new DataTransfer();

  dataTransfer.items.add(file);

  return [file];
};

export { getLocalFile };
