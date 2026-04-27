'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language || 'en';

  return (
    <footer className="bg-primary pt-16 pb-8 text-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href={`/${lang}`} className="flex items-center space-x-2">
              <Image 
                src="/LOGOMAIN.png" 
                alt="AFERA INNOV ACADEMY" 
                width={180} 
                height={45} 
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering the next generation of leaders through excellence in education, innovation, and research. Join our vibrant community today.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/people/Afera-Armfa/61577031939466/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent" 
                title="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://x.com/ArmfaA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent" 
                title="X (Twitter)"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/company/the-african-road-maintenance-funds-association-armfa/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent" 
                title="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://www.youtube.com/@armfa-afera.africa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent" 
                title="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link href={`/${lang}/about`} className="hover:text-accent transition-colors">About Academy</Link></li>
              <li><Link href={`/${lang}/courses`} className="hover:text-accent transition-colors">Academic Programs</Link></li>
              <li><Link href={`/${lang}/workshops`} className="hover:text-accent transition-colors">Thematic Workshops</Link></li>
              <li><Link href={`/${lang}/contact`} className="hover:text-accent transition-colors">Contact Us</Link></li>
              <li><a href="https://www.armfa.info" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors font-bold text-accent">ARMFA Website</a></li>
              <li><Link href={`/${lang}/login`} className="hover:text-accent transition-colors">Login / Portal</Link></li>
            </ul>
          </div>

          {/* Academics */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Academics</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link href={`/${lang}/courses?type=masters`} className="hover:text-accent transition-colors">Postgraduate Study</Link></li>
              <li><Link href={`/${lang}/courses?type=certificate`} className="hover:text-accent transition-colors">Certifications</Link></li>
              <li><Link href={`/${lang}/onboarding`} className="hover:text-accent transition-colors">New Student Orientation</Link></li>
              <li><Link href={`/${lang}/contact`} className="hover:text-accent transition-colors">Academic Support</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-accent shrink-0" />
                <span>African Road Maintenance Funds Association (ARMFA) Secretariat</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-accent shrink-0" />
                <div className="flex flex-col font-bold text-gray-300">
                  <span>+227 99 81 54 54</span>
                  <span>+254 759 53 61 53</span>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-accent shrink-0" />
                <span>info@aferainnov.africa</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs gap-4">
          <p>© 2026 AFERA INNOV ACADEMY. All rights reserved.</p>
          <p className="font-medium">Developed by <a href="https://www.kkdes.co.ke" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-colors">KKDES</a></p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href={`/${lang}/about`} className="hover:text-white">Privacy Policy</Link>
            <Link href={`/${lang}/about`} className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
