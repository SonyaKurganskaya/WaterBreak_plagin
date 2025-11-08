import * as vscode from 'vscode';

let timer: NodeJS.Timeout|undefined;
let statusBar: vscode.StatusBarItem;

const messages = [
  'Ты совсем высох! Срочно выпей воды', 'Кажется, ты давно не пил воду...',
  'Пора освежиться и попить воды!',
  'Твой организм превращается в пустыню! Срочно выпей воды',
  'Может хотя бы глоточек воды????'
];

function showNotification() {
  const randomIndex = Math.floor(Math.random() * messages.length);
  vscode.window.showWarningMessage(messages[randomIndex]);
}

function toggleTimer() {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
    statusBar.text = 'waterbreak: выкл';
    statusBar.tooltip = 'Вкл напоминания';
    vscode.window.showInformationMessage('Напоминания выключены');
  } else {
    showNotification();
    timer = setInterval(showNotification, 20 * 60 * 1000);
    statusBar.text = 'waterbreak: вкл';
    statusBar.tooltip = 'Выкл напоминания';
    vscode.window.showInformationMessage('Напоминания включены');
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Плагин "waterbreak" активирован!');

  statusBar =
      vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBar.text = 'waterbreak: выкл';
  statusBar.command = 'waterbreak.toggle';
  statusBar.tooltip = 'Нажми для вкл/выкл напоминаний';
  statusBar.show();

  const command =
      vscode.commands.registerCommand('waterbreak.toggle', toggleTimer);
  context.subscriptions.push(command, statusBar);
}

export function deactivate() {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
  statusBar.dispose();
}