# Auto Jest Code

![Version](https://img.shields.io/badge/version-0.0.4-blue)
![VSCode Version](https://img.shields.io/badge/vscode-%5E1.96.0-blue)

基于deepseek的一个自动为 JavaScript 和 TypeScript 文件生成 Jest 单元测试代码的 VSCode 插件（实验）。

---

## 功能

- **自动生成 Jest 单元测试代码**：根据选定的 JavaScript 或 TypeScript 文件，自动生成对应的 Jest 单元测试代码。
- **支持文件夹和单个文件**：可以右键点击文件夹或文件生成测试代码。
- **自定义 API 配置**：支持配置 DeepSeek API 的 URL 和 API Key。
- **测试代码保存到指定目录**：生成的测试代码会保存到 `__jestTests__` 目录中。

---

## 安装

1. 打开 VSCode。
2. 进入扩展市场（`Ctrl + Shift + X` 或 `Cmd + Shift + X`）。
3. 搜索 `Auto Jest Code` 并安装。

---

## 使用

### 1. 配置 DeepSeek API
1. 打开 VSCode 的设置（`Ctrl + ,` 或 `Cmd + ,`）。
2. 搜索 `Jest Test Generator`。
3. 配置 `DeepSeek API URL` 和 `DeepSeek API Key`。

### 2. 生成测试代码
1. 在资源管理器中右键点击一个 JavaScript 或 TypeScript 文件，或者一个包含这些文件的文件夹。
2. 选择 `Generate Jest Tests`。
3. 生成的测试代码将保存到 `__jestTests__` 目录中。

---

## 配置

### DeepSeek API URL
- **默认值**：`https://api.deepseek.com/chat/completions`
- **描述**：DeepSeek API 的 URL。

### DeepSeek API Key
- **默认值**：空
- **描述**：DeepSeek API 的密钥。

---

## 示例

### 生成测试代码
假设你有一个文件 `src/utils/sum.js`，内容如下：

```javascript
function sum(a, b) {
  return a + b;
}

module.exports = sum;
```

右键点击该文件并选择 `Generate Jest Tests`，插件会生成以下测试代码并保存到 `src/utils/__jestTests__/sum.test.js`：

```javascript
describe('sum', () => {
  test('should return the sum of two numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
```
---

## 致谢

- [VSCode](https://code.visualstudio.com/)：提供了强大的扩展开发支持。
- [DeepSeek API](https://api.deepseek.com)：用于生成单元测试代码。# auto-jest-code
