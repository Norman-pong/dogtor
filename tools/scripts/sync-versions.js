const fs = require('fs');
const path = require('path');

// 读取根目录的package.json获取版本号
const rootPackageJsonPath = path.resolve(__dirname, '../../package.json');
const rootPackageJson = JSON.parse(
  fs.readFileSync(rootPackageJsonPath, 'utf8'),
);
const rootVersion = rootPackageJson.version;

console.log(`将使用根目录版本号: ${rootVersion}`);

// 需要更新版本号的目录
const directoriesToUpdate = [
  path.resolve(__dirname, '../../apps'),
  path.resolve(__dirname, '../../packages'),
];

// 更新package.json中的版本号
function updatePackageJsonVersion(packageJsonPath) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // 保存原始版本号用于日志输出
    const oldVersion = packageJson.version;

    // 只有版本号不同时才更新
    if (oldVersion !== rootVersion) {
      packageJson.version = rootVersion;
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2) + '\n',
        'utf8',
      );
      console.log(
        `更新 ${packageJsonPath.replace(path.resolve(__dirname, '../../'), '')} 版本号: ${oldVersion} -> ${rootVersion}`,
      );
    } else {
      return;
    }
  } catch (error) {
    console.error(`更新 ${packageJsonPath} 失败:`, error.message);
  }
}

// 递归查找所有package.json文件
function findAndUpdatePackageJson(directory) {
  if (!fs.existsSync(directory)) {
    console.warn(`目录不存在: ${directory}`);
    return;
  }

  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory() && !file.startsWith('.')) {
      // 递归处理子目录
      findAndUpdatePackageJson(fullPath);
    } else if (file === 'package.json') {
      // 更新package.json文件
      updatePackageJsonVersion(fullPath);
    }
  }
}

// 执行更新
console.log('开始同步版本号...');
directoriesToUpdate.forEach((dir) => findAndUpdatePackageJson(dir));
console.log('版本号同步完成！');
