"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const App = () => {
    const [count, setCount] = react_1.default.useState(0);
    const [message, setMessage] = react_1.default.useState('');
    // 发送消息到主进程
    const handleSendMessage = () => {
        console.log('Sending message to Main Process...');
        window.api?.sendMessage('channel1', { message: 'Hello from React!' });
    };
    // 接收主进程的回复
    react_1.default.useEffect(() => {
        const handleReply = (data) => {
            console.log('Reply received from Main Process:', data);
            setMessage(data.message);
        };
        window.api?.onMessage('channel1-reply', handleReply);
        // 清理监听器以避免内存泄漏
        return () => {
            window.api?.removeListener('channel1-reply', handleReply);
        };
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { style: { textAlign: 'center', marginTop: '50px' }, children: [(0, jsx_runtime_1.jsx)("h1", { children: "Electron + React" }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setCount(count + 1), children: ["Count is ", count] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSendMessage, children: "Send Message to Main Process" }), message && (0, jsx_runtime_1.jsxs)("p", { children: ["Reply from Main Process: ", message] })] }));
};
exports.default = App;
