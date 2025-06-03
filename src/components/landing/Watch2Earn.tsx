import {
  MessageOutlined,
  MoneyCollectOutlined,
  PlayCircleOutlined,
  WalletOutlined,
} from "@ant-design/icons";

const EARNING_STEPS = [
  {
    icon: WalletOutlined,
    title: "Connect & Start Earning",
    description:
      "Link your Web3 wallet and begin your earning journey. Get instant access to rewards for watching and engaging with your favorite streamers. Earn $LIVE tokens based on your watch time and participation.",
  },
  {
    icon: PlayCircleOutlined,
    title: "Watch & Interact",
    description:
      "Tune in to your favorite streamers and earn while you watch. Like, share, and follow creators to earn bonus rewards. The more you engage, the more you earn - it's that simple!",
  },
  {
    icon: MessageOutlined,
    title: "Join the Community",
    description:
      "Participate in chat discussions, special streaming events, and exclusive creator moments. Earn additional rewards through community engagement and unlock special NFT drops during featured events.",
  },
  {
    icon: MoneyCollectOutlined,
    title: "Earn & Grow",
    description:
      "Convert your earned $LIVE tokens to other cryptocurrencies or use them within the ecosystem. Stake your earnings, trade NFTs, and unlock exclusive perks as you build your streaming empire.",
  },
];

export function Watch2Earn() {
  return (
    <div className="w-full max-w-[1800px] mx-auto px-2 sm:px-3 md:px-4 py-16 sm:py-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
          Watch2Earn with LiveStreamCoin
        </h2>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
          Turn your streaming entertainment into rewards. Start earning $LIVE
          tokens by watching and engaging with your favorite content.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {EARNING_STEPS.map((step, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm hover:bg-zinc-900/70 transition-all duration-300"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center">
                <step.icon
                  style={{ fontSize: 20, color: "var(--color-brand)" }}
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
