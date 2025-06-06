import Link from "next/link";
import React from "react";
import { FiArrowRight } from "react-icons/fi";

interface Props {
  title: string;
  description: string;
  price: string;
  href: string;
}

const PluginCard = ({ title, description, price, href }: Props) => {
  return (
    <Link href={href} className="no-underline group block h-full">
      <div className="bg-[#1A1A1A] p-4 sm:p-6 rounded-xl transition-all duration-300 h-full flex flex-col group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-cyan-500/20">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-cyan-400 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-400 leading-relaxed flex-grow mb-4 sm:mb-6 min-h-[80px] sm:min-h-[100px]">
          {description}
        </p>

        {/* Price and CTA */}
        <div className="mt-auto">
          {/* Price Section */}
          <div className="mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
              <p className="text-xl sm:text-2xl font-bold text-gray-500 line-through">{price}</p>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                Free
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">per month</p>
          </div>
          
          {/* CTA Text */}
          <div className="flex items-center text-cyan-400 font-semibold group-hover:text-blue-400 transition-colors">
            <span className="mr-2 text-sm sm:text-base">Get Started</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PluginCard;
