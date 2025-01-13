"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const allowedChannels = ['channel1', 'channel1-reply'];
electron_1.contextBridge.exposeInMainWorld('api', {
    sendMessage: (channel, data) => {
        if (allowedChannels.includes(channel)) {
            console.log(`[Preload] Sending message on ${channel}:`, data);
            electron_1.ipcRenderer.send(channel, data);
        }
        else {
            console.warn(`[Preload] Blocked unauthorized channel: ${channel}`);
        }
    },
    onMessage: (channel, callback) => {
        if (allowedChannels.includes(channel)) {
            console.log(`[Preload] Listening on channel ${channel}`);
            electron_1.ipcRenderer.on(channel, (_, data) => callback(data));
        }
        else {
            console.warn(`[Preload] Blocked unauthorized channel: ${channel}`);
        }
    },
    removeListener: (channel, callback) => {
        if (allowedChannels.includes(channel)) {
            console.log(`[Preload] Removing listener on channel ${channel}`);
            electron_1.ipcRenderer.removeListener(channel, callback);
        }
        else {
            console.warn(`[Preload] Blocked unauthorized channel: ${channel}`);
        }
    },
});
