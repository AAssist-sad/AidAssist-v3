import React from 'react';
import { Heart, Mail, Phone, MapPin, Shield, FileText, HelpCircle, ExternalLink, Globe, Users, Settings } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Centre d\'aide', href: '#help', icon: HelpCircle },
    { label: 'Contact', href: '#contact', icon: Mail },
    { label: 'Sécurité', href: '#security', icon: Shield },
    { label: 'Communauté', href: '#community', icon: Users }
  ];

  return (


    <footer className="bg-white/95 backdrop-blur-xl border-t border-gray-200 px-6 py-4 mt-auto shadow-sm">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Left side - Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <div className="text-center lg:text-left">
            <span className="text-lg font-bold text-gray-900 tracking-tight">AidAssist</span>
            <p className="text-xs text-gray-600 font-medium">© {currentYear} - Plateforme d'aide</p>
          </div>
        </div>

        {/* Center - Quick Links */}
        <div className="flex items-center gap-2 lg:gap-4">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <a
                key={index}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 focus-ring"
                title={link.label}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{link.label}</span>
              </a>
            );
          })}
        </div>

        {/* Right side - Status & Info */}
        <div className="flex items-center gap-4">
          {/* Status Indicators */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600 font-medium">Système opérationnel</span>
            </div>
            <div className="hidden lg:flex items-center gap-1">
              <Shield className="w-3 h-3 text-green-500" />
              <span className="text-xs text-gray-600 font-medium">RGPD</span>
            </div>
          </div>

          {/* Version */}
          <div className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">
            v2.1.0
          </div>
        </div>
      </div>
    </footer>
  );
};