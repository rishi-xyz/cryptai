import { Chat } from '@/src/components/platform/chat';
import { generateUUID } from '@/src/lib/utils';

const ChatPage = async () => {
  const id = generateUUID();
  return <Chat key={id} id={id} initialMessages={[]} />;
};

export default ChatPage;
