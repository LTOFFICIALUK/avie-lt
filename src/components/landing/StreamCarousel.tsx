import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import Image from "next/image";
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const MOCK_STREAMS = [
  {
    id: 1,
    username: "@gamer123",
    avatar: "/images/avatars/stream1.png",
    preview: "/images/stream-thumbnails/stream1.png",
    isLive: true,
    viewers: 69,
    title: "Gaming Marathon",
    followers: "50K",
    videos: 75,
    verified: true,
  },
  {
    id: 2,
    username: "@cryptotrader",
    avatar: "/images/avatars/stream2.png",
    preview: "/images/stream-thumbnails/stream2.png",
    isLive: true,
    viewers: 856,
    title: "Live Trading Session",
    followers: "85K",
    videos: 95,
    verified: true,
  },
  {
    id: 3,
    username: "@livestreamcoin",
    avatar: "/images/avatars/stream5.png",
    preview: "/images/stream-thumbnails/stream5.png",
    isLive: true,
    viewers: 1234,
    title: "Building the future of streaming",
    followers: "120K",
    videos: 120,
    verified: true,
  },
  {
    id: 4,
    username: "@nftartist",
    avatar: "/images/avatars/stream3.png",
    preview: "/images/stream-thumbnails/stream3.png",
    isLive: true,
    viewers: 2341,
    title: "Creating NFT Collection",
    followers: "95K",
    videos: 110,
    verified: true,
  },
  {
    id: 5,
    username: "@67-AI",
    avatar: "/images/avatars/stream4.png",
    preview: "/images/stream-thumbnails/stream4.jpg",
    isLive: true,
    viewers: 676767,
    title: "Building the future of streaming",
    followers: "67K",
    videos: 67,
    verified: false,
  },
  {
    id: 6,
    username: "@67-AI",
    avatar: "/images/avatars/stream4.png",
    preview: "/images/stream-thumbnails/stream4.jpg",
    isLive: true,
    viewers: 676767,
    title: "Building the future of streaming",
    followers: "67K",
    videos: 67,
    verified: false,
  },
];

const StreamCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType>(null);

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <div>
      <div className="w-full  mx-auto py-8 flex items-center gap-10">
        <Button
          onClick={handlePrev}
          style={{ backgroundColor: "transparent", border: "transparent" }}
        >
          <LeftOutlined style={{ color: "#ffffff" }} />
        </Button>
        <Swiper
          onSwiper={(swiper: SwiperType) => {
            swiperRef.current = swiper;
          }}
          onActiveIndexChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
          }}
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={3}
          spaceBetween={20}
          loop={true}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: true,
          }}
          modules={[EffectCoverflow, Pagination]}
          className="w-full"
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {MOCK_STREAMS.map((stream) => (
            <SwiperSlide key={stream.id}>
              <div className="relative rounded-lg overflow-hidden shadow-xl bg-[var(--bg-primary)] transition-all duration-300">
                <div className="relative h-[300px] w-full">
                  <Image
                    src={stream.preview}
                    alt={stream.title}
                    fill
                    className="object-cover transition-all duration-300"
                  />
                  {stream.isLive && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                      LIVE
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--background)]/90 to-transparent">
                    <div className="flex items-center gap-2">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={stream.avatar}
                          alt={stream.username}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">
                            {stream.username}
                          </span>
                          {stream.verified && (
                            <span className="text-blue-500">✓</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-300">
                          {stream.viewers.toLocaleString()} viewers
                        </div>
                      </div>
                    </div>
                    <h3 className="mt-2 font-medium text-white">
                      {stream.title}
                    </h3>
                    <div className="mt-2 flex gap-4 text-sm text-[var(--accent)]">
                      <span>{stream.followers} followers</span>
                      <span>{stream.videos} videos</span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <Button
          onClick={handleNext}
          style={{ backgroundColor: "transparent", border: "transparent" }}
        >
          <RightOutlined style={{ color: "#ffffff" }} />
        </Button>
      </div>
      {/* Pagination Indicators */}
      <div className="flex justify-center gap-1.5 sm:gap-2 -mt-4 sm:mt-2">
        {MOCK_STREAMS.map((_, index) => (
          <button
            key={index}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "bg-[var(--color-accent)]"
                : "bg-gray-600 hover:bg-gray-500"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default StreamCarousel;
