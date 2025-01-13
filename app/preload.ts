import { contextBridge, ipcRenderer } from 'electron';

const allowedChannels = ['channel1', 'channel1-reply'];

contextBridge.exposeInMainWorld('api', {
  sendMessage: (channel: string, data: any) => {
    if (allowedChannels.includes(channel)) {
      console.log(`[Preload] Sending message on ${channel}:`, data);
      ipcRenderer.send(channel, data);
    } else {
      console.warn(`[Preload] Blocked unauthorized channel: ${channel}`);
    }
  },

  onMessage: (channel: string, callback: (data: any) => void) => {
    if (allowedChannels.includes(channel)) {
      console.log(`[Preload] Listening on channel ${channel}`);
      ipcRenderer.on(channel, (_, data) => callback(data));
    } else {
      console.warn(`[Preload] Blocked unauthorized channel: ${channel}`);
    }
  },

  removeListener: (channel: string, callback: (data: any) => void) => {
    if (allowedChannels.includes(channel)) {
      console.log(`[Preload] Removing listener on channel ${channel}`);
      ipcRenderer.removeListener(channel, callback as any);
    } else {
      console.warn(`[Preload] Blocked unauthorized channel: ${channel}`);
    }
  },
});
