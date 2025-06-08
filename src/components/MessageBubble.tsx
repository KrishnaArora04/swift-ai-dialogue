
import { format } from "date-fns";
import { User, Bot } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isImage?: boolean;
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { content, isUser, timestamp, isImage } = message;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex ${isUser ? "flex-row-reverse" : "flex-row"} items-start space-x-2 max-w-[80%]`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-primary text-primary-foreground ml-2" : "bg-muted text-muted-foreground mr-2"
        }`}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>

        {/* Message Content */}
        <div className="flex flex-col">
          <div className={`rounded-lg p-3 ${
            isUser 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-foreground"
          }`}>
            {isImage ? (
              <div className="space-y-2">
                <img 
                  src={content} 
                  alt="Generated image" 
                  className="max-w-full h-auto rounded-md"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/400x300?text=Image+Generation+Error";
                  }}
                />
                <p className="text-sm opacity-75">Generated image</p>
              </div>
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
            )}
          </div>
          <div className={`text-xs text-muted-foreground mt-1 ${isUser ? "text-right" : "text-left"}`}>
            {format(timestamp, "HH:mm")}
          </div>
        </div>
      </div>
    </div>
  );
};
