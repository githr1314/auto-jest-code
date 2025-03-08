module.exports = {
  preset: 'ts-jest', // 使用 ts-jest 预设
  testEnvironment: 'node', // 测试环境
  testMatch: ['**/__jestTests__/**/*.(test|spec).(ts|js)'], // 匹配 .ts 和 .js 测试文件
  moduleFileExtensions: ['ts', 'js', 'json', 'node'], // 支持的文件扩展名（移除 tsx 和 jsx）
  transform: {
    '^.+\\.ts$': 'ts-jest', // 使用 ts-jest 处理 .ts 文件
    '^.+\\.js$': 'babel-jest', // 使用 babel-jest 处理 .js 文件
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json', // 指定 TypeScript 配置文件
      useESM: true, // 启用 ES 模块支持
    },
  },
};