import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useThemeColor } from '../context/ThemeColorContext';

export default function BottomBar({ onSelectPhilosophy, onOpenStore, onOpenSupport }) {
  const { themeMode = 'dark' } = useThemeColor();
  const isLight = themeMode === 'light';
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('India | INR ₹');

  const currencies = [
    { label: 'India | INR ₹', code: 'INR' },
    { label: 'United States | USD $', code: 'USD' },
    { label: 'United Kingdom | GBP £', code: 'GBP' },
    { label: 'European Union | EUR €', code: 'EUR' },
    { label: 'Canada | CAD $', code: 'CAD' },
    { label: 'Australia | AUD $', code: 'AUD' }
  ];

  const handleLinkClick = (linkName) => {
    if (linkName === 'Get Help with Order' || linkName === 'Contact us') {
      const el = document.querySelector('[aria-label="Open Support Team Desk"]');
      if (el) el.click();
      else if (onOpenSupport) onOpenSupport();
    } else {
      if (onSelectPhilosophy) onSelectPhilosophy();
    }
  };

  return (
    <footer className={`pt-16 pb-12 px-4 sm:px-8 lg:px-14 select-none border-t transition-colors duration-300 ${
      isLight ? 'bg-[#f8fafc] text-gray-900 border-gray-200' : 'bg-[#0e2028] text-white border-[#224b5c]'
    }`}>
      <div className="max-w-[1360px] mx-auto flex flex-col items-center text-center space-y-10">

        <div className="space-y-5">
          <h4 className={`text-xs font-bold tracking-widest uppercase ${
            isLight ? 'text-gray-900' : 'text-white'
          }`}>
            Quick links
          </h4>

          <div className={`flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-3 text-xs ${
            isLight ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {[
              'Shipping Policy',
              'Returns & Refund policy',
              'Our Store Policy',
              'Get Help with Order',
              'About Us',
              'Contact us'
            ].map((link) => (
              <button
                key={link}
                type="button"
                onClick={() => handleLinkClick(link)}
                className={`transition-colors cursor-pointer text-xs font-normal ${
                  isLight ? 'hover:text-black' : 'hover:text-white'
                }`}
              >
                {link}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center space-y-2 pt-4">
          <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">
            Country/region
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className={`px-4 py-2 rounded-full border text-xs font-normal flex items-center gap-2 transition-colors cursor-pointer shadow-sm ${
                isLight
                  ? 'border-gray-300 bg-white hover:bg-gray-50 text-gray-800'
                  : 'border-white/20 bg-white/5 hover:bg-white/10 text-white'
              }`}
            >
              <span>{selectedCurrency}</span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {currencyDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setCurrencyDropdownOpen(false)}
                />
                <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 border rounded-2xl shadow-2xl py-2 z-50 text-xs text-left ${
                  isLight ? 'bg-white border-gray-200 text-gray-800' : 'bg-[#16171d] border-white/15 text-gray-300'
                }`}>
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      type="button"
                      onClick={() => {
                        setSelectedCurrency(curr.label);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 flex items-center justify-between transition-colors ${
                        isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                      } ${
                        selectedCurrency === curr.label ? 'text-[#d4af37] font-semibold' : ''
                      }`}
                    >
                      <span>{curr.label}</span>
                      {selectedCurrency === curr.label && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className={`pt-6 border-t w-full flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono gap-2 ${
          isLight ? 'border-gray-200 text-gray-500' : 'border-white/10 text-gray-500'
        }`}>
          <span>© 2026 APNA BRAND. ALL RIGHTS RESERVED.</span>
          <span className={isLight ? 'text-gray-600' : 'text-gray-600'}>ROOTED IN BHARAT • WORN EVERYWHERE</span>
        </div>

      </div>
    </footer>
  );
}
