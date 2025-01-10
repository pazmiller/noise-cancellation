import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // 引入 React 主组件
import './index.css'; // 引入样式（如果有）

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
