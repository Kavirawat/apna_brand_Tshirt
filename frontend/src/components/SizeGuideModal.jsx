import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useThemeColor } from '../context/ThemeColorContext';

export default function SizeGuideModal({ isOpen, onClose }) {
  const { themeMode = 'dark' } = useThemeColor?.() || {};
  const isLight = themeMode === 'light';
  const [unit, setUnit] = useState('in');
  const [activeTab, setActiveTab] = useState('tshirt');

  if (!isOpen) return null;

  const toCm = (val) => {
    return (Math.round((parseFloat(val) * 2.54 + Number.EPSILON) * 100) / 100).toFixed(1);
  };

  const formatMeasure = (inchVal) => {
    if (unit === 'cm') return toCm(inchVal);
    return inchVal;
  };

  const sizeData = {
    tshirt: [
      { size: 'XS', chest: 40, length: 27, shoulder: 18 },
      { size: 'S', chest: 42, length: 28, shoulder: 19 },
      { size: 'M', chest: 44, length: 29, shoulder: 20 },
      { size: 'L', chest: 46, length: 30, shoulder: 21 },
      { size: 'XL', chest: 48, length: 31, shoulder: 22 },
      { size: '2XL', chest: 50, length: 32, shoulder: 23 },
      { size: '3XL', chest: 52, length: 33, shoulder: 24 },
    ],
    acidwash: [
      { size: 'XS', chest: 39, length: 27 },
      { size: 'S', chest: 41, length: 28 },
      { size: 'M', chest: 43, length: 29 },
      { size: 'L', chest: 45, length: 30 },
      { size: 'XL', chest: 47, length: 31 },
      { size: '2XL', chest: 49, length: 32 },
    ],
    hoodie: [
      { size: 'S', chest: 44, length: 27, shoulder: 21 },
      { size: 'M', chest: 46, length: 28, shoulder: 22 },
      { size: 'L', chest: 48, length: 29, shoulder: 23 },
      { size: 'XL', chest: 50, length: 30, shoulder: 24 },
      { size: '2XL', chest: 52, length: 31, shoulder: 25 },
    ],
    shirt: [
      { size: 'S', chest: 42, length: 28, shoulder: 19 },
      { size: 'M', chest: 44, length: 29, shoulder: 20 },
      { size: 'L', chest: 46, length: 30, shoulder: 21 },
      { size: 'XL', chest: 48, length: 31, shoulder: 22 },
      { size: '2XL', chest: 50, length: 32, shoulder: 23 },
    ],
    sweatshirt: [
      { size: 'S', chest: 43, length: 27, shoulder: 20 },
      { size: 'M', chest: 45, length: 28, shoulder: 21 },
      { size: 'L', chest: 47, length: 29, shoulder: 22 },
      { size: 'XL', chest: 49, length: 30, shoulder: 23 },
      { size: '2XL', chest: 51, length: 31, shoulder: 24 },
    ],
  };

  const tabs = [
    { id: 'tshirt', label: 'T-SHIRT' },
    { id: 'acidwash', label: 'ACID WASH' },
    { id: 'hoodie', label: 'HOODIE' },
    { id: 'shirt', label: 'SHIRT' },
    { id: 'sweatshirt', label: 'SWEATSHIRT' },
  ];

  const currentRows = sizeData[activeTab] || sizeData.tshirt;
  const hasShoulder = currentRows.some((r) => r.shoulder !== undefined);

  return (
    <div
      className="fixed inset-0 z-[999999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className={`border rounded-2xl w-full max-w-[520px] max-h-[88vh] overflow-hidden shadow-2xl flex flex-col transition-colors ${
          isLight
            ? 'bg-white text-[#111] border-gray-200'
            : 'bg-[#153442] text-white border-[#224b5c]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >

        <div className={`flex items-center justify-between min-h-[54px] px-4 border-b ${
          isLight ? 'border-gray-200 bg-white' : 'border-[#224b5c] bg-[#0f232c]'
        }`}>
          <div className="flex items-center gap-3">
            <span className={`text-[11px] font-bold tracking-[1px] uppercase ${
              isLight ? 'text-[#111]' : 'text-[#f0aa93]'
            }`}>
              SIZE GUIDE
            </span>

            <div className="flex items-center gap-1 text-[9px] font-medium pl-2">
              <button
                type="button"
                onClick={() => setUnit('in')}
                className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                  unit === 'in'
                    ? isLight ? 'text-[#111] font-bold' : 'text-[#f0aa93] font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                IN
              </button>
              <span className="text-gray-400">|</span>
              <button
                type="button"
                onClick={() => setUnit('cm')}
                className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                  unit === 'cm'
                    ? isLight ? 'text-[#111] font-bold' : 'text-[#f0aa93] font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                CM
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`w-8 h-8 flex items-center justify-center text-xl font-light leading-none cursor-pointer ${
              isLight ? 'text-[#111] hover:opacity-70' : 'text-gray-300 hover:text-white'
            }`}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className={`flex items-center overflow-x-auto border-b scrollbar-none px-2 ${
          isLight ? 'border-gray-200 bg-white' : 'border-[#224b5c] bg-[#122832]'
        }`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2.5 text-[8.5px] font-semibold tracking-[0.55px] uppercase whitespace-nowrap relative transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? isLight
                    ? 'text-[#111] font-bold after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2px] after:bg-[#111]'
                    : 'text-[#f0aa93] font-bold after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2px] after:bg-[#f0aa93]'
                  : isLight ? 'text-gray-400 hover:text-gray-700' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <table className="w-full border-collapse table-fixed text-center font-sans">
            <thead>
              <tr className={`text-[8px] sm:text-[8.5px] font-semibold uppercase tracking-[0.65px] ${
                isLight ? 'bg-[#f8f8f8] text-[#777]' : 'bg-[#0f232c] text-[#f0aa93]'
              }`}>
                <th className={`border py-2 ${isLight ? 'border-[#cfcfcf]' : 'border-[#224b5c]'}`}>SIZE</th>
                <th className={`border py-2 ${isLight ? 'border-[#cfcfcf]' : 'border-[#224b5c]'}`}>
                  CHEST ({unit.toUpperCase()})
                </th>
                <th className={`border py-2 ${isLight ? 'border-[#cfcfcf]' : 'border-[#224b5c]'}`}>
                  LENGTH ({unit.toUpperCase()})
                </th>
                {hasShoulder && (
                  <th className={`border py-2 ${isLight ? 'border-[#cfcfcf]' : 'border-[#224b5c]'}`}>
                    SHOULDER ({unit.toUpperCase()})
                  </th>
                )}
              </tr>
            </thead>
            <tbody className={`text-[10px] sm:text-[11px] ${isLight ? 'text-[#222]' : 'text-gray-200'}`}>
              {currentRows.map((row) => (
                <tr key={row.size} className={`transition-colors ${
                  isLight ? 'hover:bg-[#fafafa]' : 'hover:bg-white/5'
                }`}>
                  <td className={`border py-2.5 font-bold ${isLight ? 'border-[#cfcfcf]' : 'border-[#224b5c]'}`}>{row.size}</td>
                  <td className={`border py-2.5 ${isLight ? 'border-[#cfcfcf]' : 'border-[#224b5c]'}`}>{formatMeasure(row.chest)}</td>
                  <td className={`border py-2.5 ${isLight ? 'border-[#cfcfcf]' : 'border-[#224b5c]'}`}>{formatMeasure(row.length)}</td>
                  {hasShoulder && (
                    <td className={`border py-2.5 ${isLight ? 'border-[#cfcfcf]' : 'border-[#224b5c]'}`}>
                      {row.shoulder ? formatMeasure(row.shoulder) : '—'}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <div className={`mt-4 p-2.5 border rounded-xl text-[10px] leading-relaxed ${
            isLight ? 'bg-[#f9f9f9] border-[#e5e5e5] text-[#666]' : 'bg-[#0f232c] border-[#224b5c] text-gray-300'
          }`}>
            <p>
              💡 <strong>Fit Guidance:</strong> All garments follow an authentic drop-shoulder oversized boxy silhouette.
              Order your standard size for the signature relaxed drape, or size down for a classic fitted look.
            </p>
          </div>
        </div>

        <div className={`p-3 border-t flex justify-end ${
          isLight ? 'border-gray-200 bg-[#fafafa]' : 'border-[#224b5c] bg-[#0f232c]'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer ${
              isLight
                ? 'bg-[#111] text-white hover:bg-[#333]'
                : 'bg-[#f0aa93] text-[#122832] hover:bg-white'
            }`}
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
