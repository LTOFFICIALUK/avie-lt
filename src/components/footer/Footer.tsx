"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input, Button, message } from "antd";
import {
  SendOutlined,
  DiscordOutlined,
  XOutlined,
  MailOutlined,
  RocketOutlined,
  FileTextOutlined,
  TrophyOutlined,
  TeamOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  HeartOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const FOOTER_LINKS = {
  platform: [
    { label: "Home", href: "/" },
    { label: "Whitepaper", href: "/whitepaper" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "AP Reward System", href: "/AP-reward-system" },
    { label: "Community", href: "/community" },
  ],
  company: [
    { label: "About AVIE", href: "/about" },
    { label: "Brand Kit", href: "/brand-kit/AVIE-Brand-Kit.zip", isDownload: true },
    { label: "Policies", href: "/policy" },
    { label: "Support", href: "/support" },
  ],
};

const SOCIAL_LINKS = [
  { 
    icon: DiscordOutlined, 
    href: "https://discord.gg/gpWuwPpWxp", 
    label: "Discord",
    color: "hover:text-indigo-400"
  },
  { 
    icon: SendOutlined, 
    href: "https://t.me/+ADEbvu_yTFs1ZTI0", 
    label: "Telegram",
    color: "hover:text-blue-400"
  },
  { 
    icon: XOutlined, 
    href: "https://x.com/aviestreaming", 
    label: "AVIE's X",
    color: "hover:text-gray-300"
  },
  { 
    icon: XOutlined, 
    href: "https://x.com/LiveStreamCoin", 
    label: "Founder X",
    color: "hover:text-amber-400"
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    // Force white placeholder after component mounts
    if (inputRef.current) {
      const input = inputRef.current.input || inputRef.current;
      if (input) {
        input.style.setProperty('--placeholder-color', 'white', 'important');
        // Create and inject CSS to override placeholder
        const style = document.createElement('style');
        style.textContent = `
          .footer-email-input input::placeholder {
            color: white !important;
            opacity: 1 !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  const handleEmailSubmit = async () => {
    if (!email || !email.includes('@')) {
      message.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with actual email marketing API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('Successfully subscribed to our newsletter!');
      setEmail("");
    } catch (error) {
      message.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="w-full bg-gradient-to-b from-gray-900/50 to-black backdrop-blur-lg border-t border-purple-500/20">
      {/* Footer-specific CSS to override any global link styles and autofill styling */}
      <style jsx global>{`
        footer a {
          color: white !important;
          text-decoration: none !important;
        }
        footer a:visited {
          color: white !important;
        }
        footer a:link {
          color: white !important;
        }
        footer a:hover {
          text-decoration: none !important;
        }
        footer p {
          color: white !important;
        }
        footer span {
          color: white !important;
        }
        
        /* Prevent autofill styling changes */
        footer input:-webkit-autofill,
        footer input:-webkit-autofill:hover,
        footer input:-webkit-autofill:focus,
        footer input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px rgba(31, 41, 55, 0.5) inset !important;
          -webkit-text-fill-color: white !important;
          background-color: rgba(31, 41, 55, 0.5) !important;
          color: white !important;
          border-color: rgba(107, 114, 128, 0.3) !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        
        footer input {
          color: white !important;
        }
        
        footer input::placeholder {
          color: white !important;
        }
        
        /* More specific selectors for Ant Design Input */
        footer .ant-input::placeholder {
          color: white !important;
        }
        
        footer .ant-input::-webkit-input-placeholder {
          color: white !important;
        }
        
        footer .ant-input::-moz-placeholder {
          color: white !important;
        }
        
        footer .ant-input:-ms-input-placeholder {
          color: white !important;
        }
        
        /* Even more specific for our email input */
        footer .footer-email-input input::placeholder {
          color: white !important;
          opacity: 1 !important;
        }
        
        footer .footer-email-input .ant-input::placeholder {
          color: white !important;
          opacity: 1 !important;
        }
        
        /* Ultra specific selectors */
        .footer-email-input input::placeholder {
          color: white !important;
          opacity: 1 !important;
        }
        
        .footer-email-input .ant-input::placeholder {
          color: white !important;
          opacity: 1 !important;
        }
        
        .footer-email-input .ant-input::-webkit-input-placeholder {
          color: white !important;
          opacity: 1 !important;
        }
        
        .footer-email-input .ant-input::-moz-placeholder {
          color: white !important;
          opacity: 1 !important;
        }
        
        .footer-email-input .ant-input:-ms-input-placeholder {
          color: white !important;
          opacity: 1 !important;
        }
      `}</style>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter CTA Section */}
        <div className="py-12 border-b border-gray-700/30">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Stay Updated with AVIE
              </h3>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Be the first to know about new features, updates, and exclusive opportunities in the AVIE ecosystem.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                ref={inputRef}
                size="large"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onPressEnter={handleEmailSubmit}
                className="flex-1 footer-email-input"
                style={{
                  backgroundColor: 'rgba(31, 41, 55, 0.5)',
                  borderColor: 'rgba(107, 114, 128, 0.3)',
                  color: 'white'
                }}
              />
              <button
                onClick={handleEmailSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MailOutlined className="mr-2" />
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-3">
              Join our growing community of streamers and viewers
            </p>
          </div>
        </div>

                 {/* Main Footer Content */}
         <div className="py-12">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
             
             {/* Brand Section */}
             <div className="lg:col-span-1">
               <div className="flex items-center justify-start -mb-10 -mt-12.5">
                 <Image
                   src="/icons/footer-logo.png"
                   alt="AVIE Logo"
                   width={160}
                   height={160}
                   className="w-40 h-40 object-contain"
                 />
               </div>
               <p className="text-white text-sm leading-relaxed mt-1">
                 Revolutionizing live streaming with blockchain technology. Create, connect, and earn on the future of decentralized entertainment.
               </p>
             </div>

             {/* Link Lists Container - Moved Right */}
             <div className="lg:col-span-3 lg:ml-16">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                 {/* Platform Links */}
                 <div>
                   <h3 className="text-white font-semibold mb-4">Platform</h3>
                   <ul className="space-y-3">
                     {FOOTER_LINKS.platform.map((link) => (
                       <li key={link.label}>
                         <Link
                           href={link.href}
                           className="text-sm text-white hover:text-purple-400 transition-colors duration-200"
                           style={{ color: 'white' }}
                         >
                           {link.label}
                         </Link>
                       </li>
                     ))}
                   </ul>
                 </div>

                 {/* Company Links */}
                 <div>
                   <h3 className="text-white font-semibold mb-4">Company</h3>
                   <ul className="space-y-3">
                     {FOOTER_LINKS.company.map((link) => (
                       <li key={link.label}>
                         {link.isDownload ? (
                           <a
                             href={link.href}
                             download
                             className="text-sm text-white hover:text-blue-400 transition-colors duration-200"
                             style={{ color: 'white' }}
                           >
                             {link.label}
                           </a>
                         ) : (
                           <Link
                             href={link.href}
                             className="text-sm text-white hover:text-blue-400 transition-colors duration-200"
                             style={{ color: 'white' }}
                           >
                             {link.label}
                           </Link>
                         )}
                       </li>
                     ))}
                   </ul>
                 </div>

                 {/* Social Links Column */}
                 <div>
                   <h3 className="text-white font-semibold mb-4">Follow Us</h3>
                   <ul className="space-y-3">
                     {SOCIAL_LINKS.map((social) => (
                       <li key={social.label}>
                         <a
                           href={social.href}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-sm text-white hover:text-green-400 transition-colors duration-200"
                           style={{ color: 'white' }}
                         >
                           {social.label}
                         </a>
                       </li>
                     ))}
                   </ul>
                 </div>
               </div>
             </div>
           </div>
         </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-700/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                         <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-white">
               <p>© {new Date().getFullYear()} AVIE Platform. All rights reserved.</p>
               <div className="hidden sm:block w-1 h-1 bg-gray-600 rounded-full"></div>
               <p>Built with <HeartOutlined className="text-red-400 mx-1" /> for the streaming community</p>
             </div>
             
             <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-sm text-white">
                 <ThunderboltOutlined className="text-purple-400" />
                 <span>Powered by Solana</span>
               </div>
               <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
               <div className="flex items-center gap-2 text-sm text-white">
                 <GlobalOutlined className="text-blue-400" />
                 <span>Global Platform</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
