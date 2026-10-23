import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function SizeGuideModal({ isOpen, onClose }) {
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
      className="fixed inset-0 z-[999999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white text-[#111] border border-[#111] rounded-[9px] w-full max-w-[520px] max-h-[88vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex items-center justify-between min-h-[54px] px-4 border-b border-[#dedede]">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold tracking-[1px] uppercase text-[#111]">
              SIZE GUIDE
            </span>

            <div className="flex items-center gap-1 text-[9px] font-medium pl-2">
              <button
                type="button"
                onClick={() => setUnit('in')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  unit === 'in' ? 'text-[#111] font-bold' : 'text-[#999] hover:text-[#333]'
                }`}
              >
                IN
              </button>
              <span className="text-[#d0d0d0]">|</span>
              <button
                type="button"
                onClick={() => setUnit('cm')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  unit === 'cm' ? 'text-[#111] font-bold' : 'text-[#999] hover:text-[#333]'
                }`}
              >
                CM
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#111] hover:opacity-70 text-2xl font-light leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="flex items-center overflow-x-auto border-b border-[#dedede] bg-white scrollbar-none px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2.5 text-[8.5px] font-semibold tracking-[0.55px] uppercase whitespace-nowrap relative transition-colors ${
                activeTab === tab.id
                  ? 'text-[#111] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2px] after:bg-[#111]'
                  : 'text-[#999] hover:text-[#444]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <table className="w-full border-collapse table-fixed text-center font-sans">
            <thead>
              <tr className="bg-[#f8f8f8] text-[#777] text-[8px] sm:text-[8.5px] font-semibold uppercase tracking-[0.65px]">
                <th className="border border-[#cfcfcf] py-2">SIZE</th>
                <th className="border border-[#cfcfcf] py-2">
                  CHEST ({unit.toUpperCase()})
                </th>
                <th className="border border-[#cfcfcf] py-2">
                  LENGTH ({unit.toUpperCase()})
                </th>
                {hasShoulder && (
                  <th className="border border-[#cfcfcf] py-2">
                    SHOULDER ({unit.toUpperCase()})
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="text-[10px] sm:text-[11px] text-[#222]">
              {currentRows.map((row) => (
                <tr key={row.size} className="hover:bg-[#fafafa] transition-colors">
                  <td className="border border-[#cfcfcf] py-2.5 font-bold">{row.size}</td>
                  <td className="border border-[#cfcfcf] py-2.5">{formatMeasure(row.chest)}</td>
                  <td className="border border-[#cfcfcf] py-2.5">{formatMeasure(row.length)}</td>
                  {hasShoulder && (
                    <td className="border border-[#cfcfcf] py-2.5">
                      {row.shoulder ? formatMeasure(row.shoulder) : '—'}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded text-[10px] text-[#666] leading-relaxed">
            <p>
              💡 <strong>Fit Guidance:</strong> All garments follow an authentic drop-shoulder oversized boxy silhouette.
              Order your standard size for the signature relaxed drape, or size down for a classic fitted look.
            </p>
          </div>
        </div>

        <div className="p-3 border-t border-[#dedede] bg-[#fafafa] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#111] text-white text-[10px] font-semibold uppercase tracking-wider rounded hover:bg-[#333] transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
