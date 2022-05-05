import { lazy } from 'react';
import asyncComponent from './asyncComponent';
import fileFilter from './fileFilter';
import getRouterPath from './getRouterPath';

const defaultOptions = {
  // 排除文件
  excludes: [
    ({ folders, filename }) =>
      [folders, filename].find(folder => /^(\.|_)/.test(folder)),
    ({ folders, filename }) => /d\.ts$/.test(filename),
    ({ folders, filename }) => /(test|spec|e2e)\.(j|t)sx?$/.test(filename),
    ({ folders, filename }) =>
      [folders, filename].find(folder => /components?/.test(folder)),
    ({ folders, filename }) =>
      [folders, filename].find(folder => /utils?/.test(folder)),
  ],
  // TODO 优先级低于excludes？
  includes: [],
  // 组件拓展名
  extension: /\.((j|t)sx?|vue)$/,
};

// modules: string[]
async function generateRouter(modules, options = {}) {

  if (typeof options !== 'object') {
    throw new Error('options should be object type');
  }

  const { includes, excludes, extension } = { ...defaultOptions, ...options };

  const layoutStack = [];

  const fileList = await Promise.all(Object.keys(modules).map(async path => {

    console.log(path);
    const list = path.split('/');
    // 文件夹
    const folders = list.slice(1, -1);
    // 文件名
    const filename = list[list.length - 1];
    // Component
    const { component } = await asyncComponent(modules[path]);
    // const component = modules[path].default;

    const meta = component.meta || {};

    // 嵌套路由
    // if (/^_layout/.test(filename)) {
    //   layoutStack.push({ component, folderPath: folders.join('/'), path: getRouterPath(folders, 'index') });
    //   return;
    // }

    return { component, folders, filename, fullPath: path, meta };
  }))

  // TODO .filter(Boolean);

  // 特殊路由 （404） 需要保证404在数组的最后一项
  const specialRouteConfig = [
    // ...specialRoute
    {
      test: ({ filename }) => /^404/.test(filename) && extension.test(filename),
      getRoute: ({ component }) => ({ path: '', component })
    }
  ]

  const specialRoutes = specialRouteConfig
    .map(({ test, getRoute }) => {
      const module = fileList.find((file) => test(file));
      return module ? getRoute(module) : null;
    })
    .filter(Boolean);

  const componentFileList = fileList.filter((file) => !specialRouteConfig.find(({ test }) => test(file)));

  const pageRoutes = [];
  fileFilter(componentFileList, { includes, excludes })
    .forEach(({ component, folders, filename }) => {

      let pageRoute;
      const pageFolderPath = folders.join('/');
      if (layoutStack.find(({ folderPath }) => folderPath === pageFolderPath)) {
        pageRoute = pageRoutes.find(() => { })
      } else {
        pageRoute = {
          path: getRouterPath(folders, filename),
          component,
        }
      }



      pageRoutes.push(pageRoute)
    });


  return [...pageRoutes, ...specialRoutes];
}

export default generateRouter;

// export { dynamic } from './dynamic';