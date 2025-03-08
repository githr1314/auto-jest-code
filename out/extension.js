"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.callDeepSeekAPI = callDeepSeekAPI;
exports.findFilesInDirectory = findFilesInDirectory;
exports.getTestFilePath = getTestFilePath;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("./utils");
const config_1 = require("./config");
function activate(context) {
    console.log('Jest Test Generator extension is now active!');
    let disposable = vscode.commands.registerCommand('extension.generateJestTests', async (uri) => {
        console.log('Generate Jest Tests command triggered for:', uri.fsPath);
        // 读取用户配置
        const config = vscode.workspace.getConfiguration('jestTestGenerator');
        let deepseekApiUrl = config.get('deepseekApiUrl', '');
        let deepseekApiKey = config.get('deepseekApiKey', '');
        // 如果未配置 API URL，弹出输入框让用户填写
        if (!deepseekApiUrl) {
            deepseekApiUrl = await vscode.window.showInputBox({
                prompt: 'Enter DeepSeek API URL',
                placeHolder: config_1.DEFAULT_API_URL,
                ignoreFocusOut: true,
            }) || '';
            if (!deepseekApiUrl) {
                vscode.window.showErrorMessage('DeepSeek API URL is required.');
                return;
            }
            // 保存用户输入的 API URL
            await config.update('deepseekApiUrl', deepseekApiUrl, vscode.ConfigurationTarget.Global);
        }
        // 如果未配置 API Key，弹出输入框让用户填写
        if (!deepseekApiKey) {
            deepseekApiKey = await vscode.window.showInputBox({
                prompt: 'Enter DeepSeek API Key',
                placeHolder: 'Your API Key',
                ignoreFocusOut: true,
            }) || '';
            if (!deepseekApiKey) {
                vscode.window.showErrorMessage('DeepSeek API Key is required.');
                return;
            }
            // 保存用户输入的 API Key
            await config.update('deepseekApiKey', deepseekApiKey, vscode.ConfigurationTarget.Global);
        }
        // 判断资源类型（文件或文件夹）
        const stat = fs.statSync(uri.fsPath);
        let files = [];
        if (stat.isDirectory()) {
            // 如果是文件夹，递归查找所有符合条件的文件
            files = findFilesInDirectory(uri.fsPath, config_1.SUPPORTED_EXTENSIONS, config_1.IGNORE_PATTERNS);
        }
        else if (stat.isFile() && config_1.SUPPORTED_EXTENSIONS.includes(path.extname(uri.fsPath))) {
            // 如果是文件且符合扩展名要求，直接添加到文件列表
            files = [uri.fsPath];
        }
        else {
            vscode.window.showWarningMessage('Selected resource is not a supported file or folder.');
            return;
        }
        if (files.length) {
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Generating Jest tests...',
                cancellable: false,
            }, async (progress) => {
                for (const file of files) {
                    progress.report({ message: `Processing ${path.basename(file)}...` });
                    try {
                        const fileName = path.basename(file, path.extname(file));
                        const code = fs.readFileSync(file, 'utf-8');
                        const testCode = await callDeepSeekAPI(fileName, code, deepseekApiUrl, deepseekApiKey);
                        if (testCode) {
                            const testFilePath = getTestFilePath(file);
                            fs.writeFileSync(testFilePath, testCode, 'utf-8');
                            vscode.window.showInformationMessage(`Tests generated for ${path.basename(file)}`);
                        }
                    }
                    catch (error) {
                        vscode.window.showErrorMessage(`Failed to generate tests for ${path.basename(file)}: ${error}`);
                    }
                }
            });
            vscode.window.showInformationMessage('Jest tests generated successfully!');
        }
        else {
            vscode.window.showWarningMessage('No supported files found!');
        }
    });
    context.subscriptions.push(disposable);
}
async function callDeepSeekAPI(fileName, code, apiUrl, apiKey) {
    try {
        const response = await axios_1.default.post(apiUrl, JSON.stringify({
            "messages": [
                {
                    "content": `
            信息1:你是一个根据传入js或者ts代码生成jest单元测试的工具；
            信息2:返回的内容只有代码、代码注释或者代码建议，以json返回，放到字段tests中；
            信息3:返回的单元测试代码中拼接引入函数的路径为'../${fileName}';
            `,
                    "role": "system"
                },
                {
                    "content": code,
                    "role": "user"
                }
            ],
            "model": "deepseek-chat",
            "frequency_penalty": 0,
            "max_tokens": 2048,
            "presence_penalty": 0,
            "response_format": {
                "type": "json_object"
            },
            "stop": null,
            "stream": false,
            "stream_options": null,
            "temperature": 1,
            "top_p": 1,
            "tools": null,
            "tool_choice": "none",
            "logprobs": false,
            "top_logprobs": null
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
        });
        const responseData = response.data;
        if (responseData.choices && responseData.choices[0] && responseData.choices[0].message) {
            const messageContent = responseData.choices[0].message.content;
            try {
                // 解析 messageContent 为 JSON
                const testsJson = JSON.parse(messageContent);
                // 提取 tests 字段
                if (testsJson.tests) {
                    return testsJson.tests;
                }
                else {
                    console.error('No tests found in the response.');
                }
            }
            catch (error) {
                console.error('Failed to parse message content as JSON:', error);
            }
        }
        else {
            throw new Error('Invalid response format: ' + responseData);
        }
        return JSON.stringify(response.data);
    }
    catch (error) {
        // 打印完整的错误信息
        if (axios_1.default.isAxiosError(error)) {
            console.error('Axios error details:', {
                message: error.message,
                url: error.config?.url,
                method: error.config?.method,
                data: error.config?.data,
                response: error.response?.data,
            });
        }
        else {
            console.error('Unexpected error:', error);
        }
        throw new Error('Failed to call DeepSeek API. Please check the URL and API Key.');
    }
}
function findFilesInDirectory(dir, extensions, ignoreExtensions) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(findFilesInDirectory(filePath, extensions, ignoreExtensions));
        }
        else if (extensions.includes(path.extname(filePath)) && !(0, utils_1.containsPattern)(filePath, ignoreExtensions)) {
            results.push(filePath);
        }
    });
    return results;
}
function getTestFilePath(filePath) {
    const dir = path.dirname(filePath);
    const fileName = path.basename(filePath, path.extname(filePath));
    const testDir = path.join(dir, '__jestTests__');
    if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
    }
    return path.join(testDir, `${fileName}.test.js`);
}
function deactivate() {
    console.log('Jest Test Generator extension is now deactivated.');
}
//# sourceMappingURL=extension.js.map