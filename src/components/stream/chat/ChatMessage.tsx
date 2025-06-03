import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Avatar, Typography } from 'antd';
import { 
  HeartOutlined, 
  DollarCircleOutlined, 
  NotificationOutlined 
} from '@ant-design/icons';
import { SiTwitch, SiKick } from 'react-icons/si';
import { FaRobot } from 'react-icons/fa';

const { Text } = Typography;

// Tip za sporočilo
export interface Message {
  id?: string;
  username: string;
  message: string;
  timestamp: Date;
  avatarUrl?: string;
  isSystem?: boolean;
  messageType?: string;
  messageClass?: string;
  isHighlighted?: boolean;
  metadata?: Record<string, any>;
  platform?: string;
  userId?: string;
}

interface ChatMessageProps {
  message: Message;
  onEmojiClick?: (emoji: string) => void;
  currentUserId?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onEmojiClick, currentUserId }) => {
  const { lang } = useParams();
  
  // Določi ali gre za sistemsko sporočilo, obvestilo ali donacijo
  const isSystemMessage = message.isSystem === true;
  const isFollowNotification = message.messageType === 'notification' && message.metadata?.notificationType === 'follow';
  const isDonationMessage = message.messageType === 'donation';
  
  // Določi platformo sporočila
  const isKick = message.platform?.toLowerCase() === 'kick';
  const isTwitch = message.platform?.toLowerCase() === 'twitch';
  const isExternalPlatform = isKick || isTwitch;
  
  // Check if this is a system user that shouldn't have profile links
  const isSystemUser = message.username.toLowerCase() === 'system' || isSystemMessage;
  
  // Izberi ikono glede na tip sporočila
  let MessageIcon = null;
  let iconColor = '';
  let iconBgColor = '';
  
  if (isFollowNotification) {
    MessageIcon = HeartOutlined;
    iconColor = '#1890ff';
    iconBgColor = 'rgba(24, 144, 255, 0.3)';
  } else if (isDonationMessage) {
    MessageIcon = DollarCircleOutlined;
    iconColor = '#52c41a';
    iconBgColor = 'rgba(82, 196, 26, 0.3)';
  } else if (isSystemMessage) {
    MessageIcon = NotificationOutlined;
    iconColor = '#1890ff';
    iconBgColor = 'rgba(24, 144, 255, 0.3)';
  } else if (isKick) {
    MessageIcon = SiKick;
    iconColor = '#53fc18';
    iconBgColor = 'rgba(83, 252, 24, 0.2)';
  } else if (isTwitch) {
    MessageIcon = SiTwitch;
    iconColor = '#9146FF';
    iconBgColor = 'rgba(145, 70, 255, 0.2)';
  } else if (message.username.toLowerCase() === 'system') {
    MessageIcon = FaRobot;
    iconColor = '#84eef5';
    iconBgColor = 'rgba(132, 238, 245, 0.2)';
  }

  // Pripravi URL za avatar
  const avatarUrl = message.avatarUrl 
    ? (message.avatarUrl.startsWith('http') 
        ? message.avatarUrl 
        : `https://backend.avie.live/public/${message.avatarUrl}`)
    : `https://api.dicebear.com/6.x/pixel-art/svg?seed=${message.username}`;

  // Preveri, ali gre za sporočilo trenutnega uporabnika
  const isCurrentUser = currentUserId && message.userId === currentUserId;

  // Create profile link
  const profileLink = `/${lang}/profile/${message.username}`;

  // Avatar component with conditional linking
  const AvatarComponent = () => {
    const avatar = (
      <Avatar 
        size={36} 
        src={!isExternalPlatform ? avatarUrl : undefined}
        style={{ 
          backgroundColor: isSystemMessage ? '#1890ff' : '#2d2d2d',
          border: isSystemMessage ? '1px solid #1890ff' : '1px solid #3a3a3a',
          cursor: !isSystemUser && !isExternalPlatform ? 'pointer' : 'default'
        }}
      >
        {message.username[0]?.toUpperCase() || '?'}
      </Avatar>
    );

    if (isSystemUser || isExternalPlatform) {
      return avatar;
    }

    return (
      <Link href={profileLink} className="hover:opacity-80 transition-opacity">
        {avatar}
      </Link>
    );
  };

  // Username component with conditional linking
  const UsernameComponent = () => {
    const username = (
      <Text style={{ 
        fontSize: '14px', 
        fontWeight: 600, 
        color: isSystemMessage ? 
               (isFollowNotification ? '#1890ff' : 
                isDonationMessage ? '#52c41a' : 
                '#84eef5') : 
               isKick ? '#53fc18' :
               isTwitch ? '#9146FF' :
               '#fff', 
        margin: 0,
        cursor: !isSystemUser && !isExternalPlatform ? 'pointer' : 'default'
      }} className="truncate max-w-[120px]">
        {message.username}
      </Text>
    );

    if (isSystemUser || isExternalPlatform) {
      return username;
    }

    return (
      <Link href={profileLink} className="hover:opacity-80 transition-opacity">
        {username}
      </Link>
    );
  };

  return (
    <div 
      className={`flex items-start gap-2 ${message.isHighlighted ? 'py-2 px-3 bg-opacity-20 rounded-lg' : ''} ${
        isFollowNotification ? 'bg-blue-900 bg-opacity-20 border border-blue-700 border-opacity-30 rounded-lg py-2 px-3' : 
        isDonationMessage ? 'bg-green-900 bg-opacity-20 border border-green-700 border-opacity-30 rounded-lg py-2 px-3' : 
        isKick ? 'border-l-2 border-[#53fc18] pl-2' :
        isTwitch ? 'border-l-2 border-[#9146FF] pl-2' :
        ''
      }`}
    >
      {/* Prikaži ikono ali avatar */}
      {MessageIcon ? (
        <div 
          className="flex items-center justify-center rounded-full"
          style={{ 
            width: 36, 
            height: 36, 
            backgroundColor: iconBgColor,
            color: iconColor
          }}
        >
          <MessageIcon style={{ fontSize: 20 }} />
        </div>
      ) : (
        <AvatarComponent />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <UsernameComponent />
          <Text style={{ 
            fontSize: '12px', 
            color: 'rgba(255,255,255,0.5)', 
            margin: 0 
          }}>
            {new Date(message.timestamp).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
          
          {/* Prikaz značke platforme */}
          {isExternalPlatform && (
            <Text style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
              via {isKick ? 'Kick' : isTwitch ? 'Twitch' : ''}
            </Text>
          )}
        </div>
        <Text style={{ 
          fontSize: '14px', 
          color: isSystemMessage ? 
                (isFollowNotification ? '#1890ff' : 
                 isDonationMessage ? '#52c41a' : 
                 '#84eef5') : 
                'rgba(255,255,255,0.8)', 
          margin: 0, 
          wordBreak: 'break-word', 
          fontWeight: isSystemMessage ? 500 : 400 
        }}>
          {message.message.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g).map((text, i) => {
            if (text.match(/([\uD800-\uDBFF][\uDC00-\uDFFF])/)) {
              return (
                <span
                  key={i}
                  className="cursor-pointer hover:scale-125 inline-block transition-transform"
                  onClick={() => onEmojiClick && onEmojiClick(text)}
                >
                  {text}
                </span>
              );
            }
            return text;
          })}
        </Text>
      </div>
    </div>
  );
};

export default ChatMessage; 