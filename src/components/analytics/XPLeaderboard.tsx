import React from 'react';
import { Card, Tabs, Empty } from 'antd';
import { CrownOutlined, UserOutlined, TrophyOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { LeaderboardEntry } from '@/types/xp';
import Image from 'next/image';

interface XPLeaderboardProps {
  weeklyData: LeaderboardEntry[];
  allTimeData: LeaderboardEntry[];
  loading?: boolean;
  limit?: number;
  userRank?: { weekly: number | null; allTime: number | null };
  lang?: string;
}

const XPLeaderboard: React.FC<XPLeaderboardProps> = ({
  weeklyData = [],
  allTimeData = [],
  loading = false,
  limit = 10,
  userRank,
  lang = 'en',
}) => {
  const renderLeaderboard = (data: LeaderboardEntry[]) => {
    if (data.length === 0) {
      return <Empty description="No leaderboard data available" className="py-6" />;
    }

    const limitedData = data.slice(0, limit);
    
    return (
      <div className="divide-y divide-zinc-700/50">
        {limitedData.map((entry, index) => (
          <div 
            key={entry.userId} 
            className={`flex items-center justify-between py-3
              ${entry.isCurrentUser ? 'bg-zinc-700/30 -mx-4 px-4' : ''}`}
          >
            <div className="flex items-center overflow-hidden">
              <div className="w-8 text-center flex-shrink-0">
                {index === 0 ? (
                  <CrownOutlined style={{ color: '#FFD700', fontSize: '18px' }} />
                ) : index === 1 ? (
                  <CrownOutlined style={{ color: '#C0C0C0', fontSize: '16px' }} />
                ) : index === 2 ? (
                  <CrownOutlined style={{ color: '#CD7F32', fontSize: '16px' }} />
                ) : (
                  <span className="text-zinc-400">#{index + 1}</span>
                )}
              </div>
              
              <div className="flex items-center ml-3 min-w-0 overflow-hidden">
                <div className="relative h-8 w-8 rounded-full overflow-hidden bg-zinc-700 flex-shrink-0">
                  {entry.avatarUrl ? (
                    <Image
                      src={entry.avatarUrl}
                      alt={entry.displayName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full">
                      <UserOutlined className="text-zinc-400" />
                    </div>
                  )}
                </div>
                <Link href={`/${lang}/profile/${entry.displayName}`} className="hover:text-[var(--color-brand)] ml-2 transition-colors truncate">
                  {entry.displayName}
                </Link>
                {entry.isCurrentUser && (
                  <span className="ml-2 text-xs text-[var(--color-brand)] flex-shrink-0">(You)</span>
                )}
              </div>
            </div>
            
            <div className="font-medium text-[var(--color-brand)] flex-shrink-0 ml-2">
              {entry.xp.toLocaleString()} XP
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Mobile-optimized tab labels
  const mobileTabItems = [
    {
      key: 'weekly',
      label: (
        <div className="flex items-center">
          <TrophyOutlined />
          <span className="ml-1">Weekly</span>
        </div>
      ),
      children: loading ? (
        <div className="py-8 text-center text-zinc-400">
          <div className="inline-block animate-spin mr-2">⟳</div>
          Loading...
        </div>
      ) : (
        renderLeaderboard(weeklyData)
      ),
    },
    {
      key: 'allTime',
      label: (
        <div className="flex items-center">
          <TrophyOutlined />
          <span className="ml-1">All Time</span>
        </div>
      ),
      children: loading ? (
        <div className="py-8 text-center text-zinc-400">
          <div className="inline-block animate-spin mr-2">⟳</div>
          Loading...
        </div>
      ) : (
        renderLeaderboard(allTimeData)
      ),
    },
  ];

  // Desktop tab labels with more details
  const desktopTabItems = [
    {
      key: 'weekly',
      label: (
        <div className="flex items-center gap-1">
          <TrophyOutlined />
          <span>This Week</span>
          {userRank?.weekly && (
            <span className="ml-2 text-xs bg-zinc-800 px-2 py-0.5 rounded-full">
              Your Rank: #{userRank.weekly}
            </span>
          )}
        </div>
      ),
      children: loading ? (
        <div className="py-8 text-center text-zinc-400">
          <div className="inline-block animate-spin mr-2">⟳</div>
          Loading leaderboard...
        </div>
      ) : (
        renderLeaderboard(weeklyData)
      ),
    },
    {
      key: 'allTime',
      label: (
        <div className="flex items-center gap-1">
          <TrophyOutlined />
          <span>All Time</span>
          {userRank?.allTime && (
            <span className="ml-2 text-xs bg-zinc-800 px-2 py-0.5 rounded-full">
              Your Rank: #{userRank.allTime}
            </span>
          )}
        </div>
      ),
      children: loading ? (
        <div className="py-8 text-center text-zinc-400">
          <div className="inline-block animate-spin mr-2">⟳</div>
          Loading leaderboard...
        </div>
      ) : (
        renderLeaderboard(allTimeData)
      ),
    },
  ];

  return (
    <Card 
      title={
        <div className="flex items-center">
          <TrophyOutlined className="mr-2 text-[var(--color-brand)]" />
          <span>AP Leaderboard</span>
        </div>
      }
      className="shadow-sm bg-zinc-800/40 border-zinc-700"
      extra={
        <Link href="/leaderboard" className="text-[var(--color-brand)] hover:underline text-sm">
          View Full Leaderboard →
        </Link>
      }
      bordered={false}
    >
      {/* Mobile view */}
      <div className="md:hidden">
        <Tabs 
          items={mobileTabItems} 
          defaultActiveKey="weekly"
          className="leaderboard-tabs mobile-leaderboard-tabs"
        />
      </div>
      
      {/* Desktop view */}
      <div className="hidden md:block">
        <Tabs 
          items={desktopTabItems} 
          defaultActiveKey="weekly"
          className="leaderboard-tabs"
        />
      </div>
    </Card>
  );
};

export default XPLeaderboard; 