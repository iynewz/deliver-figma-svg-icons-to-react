const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const { pascalCase } = require("change-case");
const Promise = require("bluebird");

const { api, getIconJSXTemplate } = require("./utils");
const { exit } = require("process");

const Icons24Dir = path.resolve(__dirname, "../src/components/ZIcons24");
const Icons14Dir = path.resolve(__dirname, "../src/components/ZIcons14");

const get24IconFolderPath = (name) =>
  path.resolve(Icons24Dir, pascalCase(name));

const get14IconFolderPath = (name) =>
  path.resolve(Icons14Dir, pascalCase(name));

const writeFile = Promise.promisify(fs.writeFile);

/**
 * clear ZIcons24 and ZIcons14 dir except ZIcon.jsx
 *
 */
const clearIconsDir = () => {
  exec(`rm -rf ${Icons24Dir} -v !(ZIcon.jsx)`);
  exec(`rm -rf ${Icons14Dir} -v !(ZIcon.jsx)`);
};

/**
 * generate icon component
 * [iconName].jsx and [iconName].svg files
 *
 * @param iconNode
 * @return {Promise<void>}
 */
const generateIcon = async (iconNode) => {
  const iconUrl = await api.getSvgImageUrl(iconNode.id);

  const iconNameNative = pascalCase(iconNode.name);

  // restructure the icon name.
  // e.g. 24AlertErrorFilled -> AlertErrorFilled24Icon
  const iconName =
    iconNameNative.substring(2) + iconNameNative.substring(0, 2) + "Icon";

  let iconFolderPath = get24IconFolderPath(iconName);

  try {
    if (iconNode.name.startsWith("14")) {
      iconFolderPath = get14IconFolderPath(iconName);
    }
  } catch {
    console.log("error catched", iconNode);
    exit(-1);
  }

  if (!fs.existsSync(iconFolderPath)) {
    fs.mkdirSync(iconFolderPath);
  }

  const { data: iconContent } = await api.getImageContent(iconUrl);
  // we need to remove the default svg tags in each iconContent, and customize the wrapping svg tags for ZIcons later. So pass in iconContent as parameter here.
  const iconJSXTemplate = getIconJSXTemplate(iconName, iconContent);

  await Promise.all([
    writeFile(path.resolve(iconFolderPath, `${iconName}.svg`), iconContent, {
      encoding: "utf8",
    }),
    writeFile(
      path.resolve(iconFolderPath, `${iconName}.jsx`),
      iconJSXTemplate,
      { encoding: "utf8" }
    ),
  ]);

  console.log(`${iconName} was written success!`);
};

/**
 * generate icons components
 *
 * @param {[Object]} iconNodesArr - array of icon nodes from frame
 * @return {Promise<void>}
 */
const generateIcons = async (iconNodesArr) => {
  await Promise.map(iconNodesArr, generateIcon, {
    concurrency: Number.parseInt(process.env.CONCURRENCY),
  });
};

/**
 * generate index.js with imports
 *
 * @param iconNodesArr - array of icon nodes from frame
 */
const generateImports = (iconNodesArr, iconsDir) => {
  let fileWithImportsPath = path.resolve(iconsDir, "index.js");

  const importsContent = iconNodesArr
    .map((iconNode) => {
      const iconNameNative = pascalCase(iconNode.name);
      // restructure the icon name for ZIcons.
      // e.g. 24AlertErrorFilled -> AlertErrorFilled24Icon
      const iconName =
        iconNameNative.substring(2) + iconNameNative.substring(0, 2) + "Icon";

      return `export * from './${iconName}/${iconName}';`;
    })
    .join("\n");

  fs.writeFileSync(fileWithImportsPath, importsContent, { encoding: "utf8" });
  console.log(`imports was written success!`);
};

const main = async () => {
  clearIconsDir();

  const iconNodesArr1 = await api.getNodeChildren(
    process.env.FRAME_WITH_ICONS_ID.split(", ")[0]
  );
  const iconNodesArr2 = await api.getNodeChildren(
    process.env.FRAME_WITH_ICONS_ID.split(", ")[1]
  );

  await Promise.all([
    generateIcons(iconNodesArr1),
    generateImports(iconNodesArr1, Icons24Dir),
    generateIcons(iconNodesArr2),
    generateImports(iconNodesArr2, Icons14Dir),
  ]);
};

module.exports = main;
