import { Video } from "@/types/videos";
import VideoCard, { VideoCardSkeleton } from "./VideoCard";

interface VideoCardGridProps {
  videos: Video[];
  title?: string;
  isLoading?: boolean;
  skeletonCount?: number;
}

export function VideoCardGridSkeleton({ 
  title, 
  skeletonCount = 8 
}: {
  title?: string;
  skeletonCount?: number;
}) {
  return (
    <div className="flex flex-col gap-4">
      {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(skeletonCount).fill(0).map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

const VideoCardGrid = ({ videos, title, isLoading = false, skeletonCount = 8 }: VideoCardGridProps) => {
  // Show skeleton during loading state
  if (isLoading) {
    return <VideoCardGridSkeleton title={title} skeletonCount={skeletonCount} />;
  }

  // Show empty state if no videos
  if (videos.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}
        <div className="text-[var(--text-secondary)] text-center py-12 border border-[var(--color-gray)]/20 rounded-md">
          No videos available
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video.vodUrl} video={video} />
        ))}
      </div>
    </div>
  );
};

export default VideoCardGrid;
