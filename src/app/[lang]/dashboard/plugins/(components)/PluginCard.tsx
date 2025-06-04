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
    <Link href={href} className="no-underline group block">
      <div className="bg-[#1A1A1A] p-6 rounded-xl transition-all duration-300 h-full flex flex-col group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-cyan-500/20">
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 leading-relaxed flex-grow mb-6 min-h-[60px]">
          {description}
        </p>

        {/* Price and CTA */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <p className="text-2xl font-bold text-gray-500 line-through">{price}</p>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Free
              </span>
            </div>
            <p className="text-sm text-gray-500">per month</p>
          </div>
          <div className="flex items-center text-cyan-400 font-semibold group-hover:text-blue-400 transition-colors">
            <span className="mr-2">Get Started</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PluginCard;
