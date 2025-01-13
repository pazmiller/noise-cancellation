export interface ElectronAPI {
    sendMessage: (channel: string, data: any) => void;
    onMessage: (channel: string, callback: (data: any) => void) => void;
    removeListener: (channel: string, callback: (data: any) => void) => void; // 添加 removeListener
  }
  
  declare global {
    interface Window {
      api: ElectronAPI;
    }
  }
  