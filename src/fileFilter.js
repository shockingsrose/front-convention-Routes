
const getRawType = data =>
  Object.prototype.toString.call(data).match(/^\[object\s(.*)\]$/)[1];

const filterIncludes = (files, rule) => {
  if (getRawType(rule) === 'RegExp') {
    return files.filter(({ fullPath }) => rule.test(fullPath));
  }

  if (getRawType(rule) === 'String') {
    return files.filter(({ fullPath }) => rule === fullPath);
  }

  if (typeof rule === 'function') {
    return files.filter(fileData => rule(fileData));
  }

  return [];
};

const filterExcludes = (files, rule) => {
  if (getRawType(rule) === 'RegExp') {
    return files.filter(({ fullPath }) => !rule.test(fullPath));
  }

  if (getRawType(rule) === 'String') {
    return files.filter(({ fullPath }) => rule !== fullPath);
  }

  if (typeof rule === 'function') {
    return files.filter(fileData => !rule(fileData));
  }
};

export default (fileList, { layoutStack, includes, excludes }) => {

  let filterFileList = fileList;
  // includes
  if (includes.length > 0) {
    filterFileList = includes.reduce(
      (files, rule) => [...files, ...filterIncludes(fileList, rule)],
      []
    );
  }


  filterFileList = excludes.reduce(
    (files, rule) => filterExcludes(files, rule),
    filterFileList
  );

  console.log(filterFileList);

  return filterFileList || [];
};