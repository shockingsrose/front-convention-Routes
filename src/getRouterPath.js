const transform = {
  config: {
    folder: [
      {
        include: /\[([^$]+)(\$?)\]/g,
        replaceCallback: (match, p1, p2) => {
          const result = `:${p1}`;
          return p2 ? `${result}?` : result;
        },
      },
    ],
    // 顺序执行
    filename: [
      {
        include: /\[([^$]+)(\$?)\]/g,
        replaceCallback: (match, p1, p2) => {
          const result = `:${p1}`;
          return p2 ? `${result}?` : result;
        },
      },
      {
        include: /\.(j|t)sx?$/,
        replaceCallback: () => '',
      },
      
    ],
  },
  exec: (config, name) =>
    config.reduce(
      (rlt, { include, replaceCallback }) =>
        include.test(rlt) ? rlt.replace(include, replaceCallback) : rlt,
      name
    ),
};

// 生成routerPath
export default (folders, filename) => {
  const relativeFolderPath = folders
    .map(name => transform.exec(transform.config.folder, name))
    .join('/');

  const filePath = transform.exec(transform.config.filename, filename);

  let routerPath = '';
  // Feature 隐藏/index
  if (filePath !== 'index') {
    routerPath = filePath;
  }

  if (relativeFolderPath) {
    routerPath = routerPath ? `/${relativeFolderPath}/${routerPath}` : `/${relativeFolderPath}`;
  }

  return routerPath;
};