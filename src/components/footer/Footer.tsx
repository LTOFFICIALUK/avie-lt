import Image from "next/image";
import Link from "next/link";
import { Button } from "antd";
import {
  TwitterOutlined,
  MessageOutlined,
  GithubOutlined,
  YoutubeOutlined,
  MailOutlined,
} from "@ant-design/icons";
import FooterLanguageSelect from "./FooterLanguageSelect";

const FOOTER_LINKS = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Watch2Earn", href: "#watch2earn" },
    { label: "NFT Collections", href: "#nft" },
    { label: "Marketplace", href: "#marketplace" },
    { label: "Roadmap", href: "#roadmap" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Press Kit", href: "/press" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Help Center", href: "/help" },
    { label: "Community", href: "/community" },
    { label: "API", href: "/api" },
    { label: "Status", href: "/status" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};

const SOCIALS = [
  { icon: TwitterOutlined, href: "https://x.com/LiveStreamCoin", label: "Twitter" },
  { icon: MessageOutlined, href: "https://discord.gg/HavtfsDSGB", label: "Discord" },
];

export function Footer() {
  return (
    <footer className="w-full  backdrop-blur-lg border-t  border-[var(--color-gray)]">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/icons/avie-logo-notext.png"
                alt="LiveStreamCoin Logo"
                width={40}
                height={40}
                className="w-8 h-8"
              />
              <span className="text-xl font-bold">LiveStreamCoin</span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm mb-4">
              Revolutionizing live streaming with blockchain technology. Watch,
              earn, and build your streaming empire with $LIVE token.
            </p>
            <div className="flex items-center gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg  text-[var(--text-secondary)] hover:text-white ransition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:col-span-4 gap-6">
            <div>
              <h3 className="text-white font-semibold mb-2">Product</h3>
              <ul className="space-y-1.5">
                {FOOTER_LINKS.product.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Company</h3>
              <ul className="space-y-1.5">
                {FOOTER_LINKS.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Resources</h3>
              <ul className="space-y-1.5">
                {FOOTER_LINKS.resources.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Legal</h3>
              <ul className="space-y-1.5">
                {FOOTER_LINKS.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-[var(--color-gray)]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-sm ">
              © {new Date().getFullYear()} LiveStreamCoin. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="text"
                size="small"
                icon={<MailOutlined />}
                className=" hover:text-white"
              >
                Contact Support
              </Button>
              <span className="text-[var(--text-secondary)]">|</span>
              <FooterLanguageSelect />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
