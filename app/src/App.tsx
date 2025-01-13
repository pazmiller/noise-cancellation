import React from 'react';

const App: React.FC = () => {
  const [count, setCount] = React.useState(0);
  const [message, setMessage] = React.useState('');

  // 发送消息到主进程
  const handleSendMessage = () => {
    console.log('Sending message to Main Process...');
    window.api?.sendMessage('channel1', { message: 'Hello from React!' });
  };

  // 接收主进程的回复
  React.useEffect(() => {
    const handleReply = (data: any) => {
      console.log('Reply received from Main Process:', data);
      setMessage(data.message);
    };

    window.api?.onMessage('channel1-reply', handleReply);

    // 清理监听器以避免内存泄漏
    return () => {
      window.api?.removeListener('channel1-reply', handleReply);
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Electron + React</h1>
      <button onClick={() => setCount(count + 1)}>Count is {count}</button>
      <button onClick={handleSendMessage}>Send Message to Main Process</button>
      {message && <p>Reply from Main Process: {message}</p>}
    </div>
  );
};

export default App;
