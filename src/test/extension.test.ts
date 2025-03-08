import * as assert from 'assert';
import * as vscode from 'vscode';
import { activate } from '../extension';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('activate should register command', () => {
    const context = {
			subscriptions: [],
		} as unknown as vscode.ExtensionContext;

    activate(context);
    assert.strictEqual(context.subscriptions.length, 1, 'Command should be registered');
  });
});