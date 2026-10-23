import React, { createContext, useContext, useState, useEffect } from 'react';

export const COLOR_PALETTES = {
  'Black': {
    name: 'Black',
    hex: '#111113',
    accent: '#d4af37',
    bgGradient: 'radial-gradient(ellipse at 50% 15%, #222228 0%, #0d0d10 60%, #060607 100%)',
    ambientGlow: 'rgba(212, 175, 55, 0.22)',
    cardBg: '#151518',
    borderGlow: 'rgba(212, 175, 55, 0.35)',
    tagBg: '#25252e',
    textColor: '#f5f5f7',
    tagline: 'VOID & ABSOLUTE • सर्वं खल्विदं ब्रह्म'
  },
  'Off White': {
    name: 'Off White',
    hex: '#e8e4dc',
    accent: '#d6a843',
    bgGradient: 'radial-gradient(ellipse at 50% 15%, #2d2b26 0%, #171512 60%, #0c0b09 100%)',
    ambientGlow: 'rgba(232, 228, 220, 0.25)',
    cardBg: '#22201b',
    borderGlow: 'rgba(232, 228, 220, 0.4)',
    tagBg: '#343128',
    textColor: '#faf8f5',
    tagline: 'PURITY & SATVA • विशुद्ध चेतना'
  },
  'White': {
    name: 'White',
    hex: '#f5f5f5',
    accent: '#c5a059',
    bgGradient: 'radial-gradient(ellipse at 50% 15%, #2a2e36 0%, #14161a 60%, #0a0b0d 100%)',
    ambientGlow: 'rgba(245, 245, 245, 0.25)',
    cardBg: '#1c1f26',
    borderGlow: 'rgba(255, 255, 255, 0.35)',
    tagBg: '#2a303b',
    textColor: '#ffffff',
    tagline: 'TRANSCENDENCE • अतीन्द्रिय सत्य'
  },
  'Baby Pink': {
    name: 'Baby Pink',
    hex: '#f4c2c2',
    accent: '#f28b9d',
    bgGradient: 'radial-gradient(ellipse at 50% 15%, #3d1b26 0%, #1f0b13 60%, #0e0407 100%)',
    ambientGlow: 'rgba(244, 194, 194, 0.35)',
    cardBg: '#2a111a',
    borderGlow: 'rgba(244, 194, 194, 0.45)',
    tagBg: '#441a29',
    textColor: '#fdeff3',
    tagline: 'MAYA & LOTUS • माया कमल'
  },
  'Lavender': {
    name: 'Lavender',
    hex: '#c8b6e2',
    accent: '#ad87e8',
    bgGradient: 'radial-gradient(ellipse at 50% 15%, #311c47 0%, #180b26 60%, #0a0312 100%)',
    ambientGlow: 'rgba(200, 182, 226, 0.35)',
    cardBg: '#241236',
    borderGlow: 'rgba(200, 182, 226, 0.45)',
    tagBg: '#3d1d5a',
    textColor: '#f5effe',
    tagline: 'MYSTICISM & AURA • रहस्य चेतना'
  },
  'Maroon': {
    name: 'Maroon',
    hex: '#6b1724',
    accent: '#ff4d6d',
    bgGradient: 'radial-gradient(ellipse at 50% 15%, #460c18 0%, #24040a 60%, #100104 100%)',
    ambientGlow: 'rgba(230, 57, 70, 0.35)',
    cardBg: '#2b070e',
    borderGlow: 'rgba(255, 77, 109, 0.45)',
    tagBg: '#490e18',
    textColor: '#feeaec',
    tagline: 'AGNI & SACRED FIRE • पावक अग्नि'
  },
  'Navy Blue': {
    name: 'Navy Blue',
    hex: '#1e293b',
    accent: '#38bdf8',
    bgGradient: 'radial-gradient(ellipse at 50% 15%, #0f2742 0%, #081526 60%, #030812 100%)',
    ambientGlow: 'rgba(56, 189, 248, 0.35)',
    cardBg: '#0f1f33',
    borderGlow: 'rgba(56, 189, 248, 0.45)',
    tagBg: '#183457',
    textColor: '#e0f2fe',
    tagline: 'INDRA & CELESTIAL • वज्र धारी'
  }
};

const ThemeColorContext = createContext();

export const ThemeColorProvider = ({ children }) => {
  const [currentColor, setCurrentColor] = useState(COLOR_PALETTES['Black']);
  const [isDynamicLocked, setIsDynamicLocked] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-bg-gradient', currentColor.bgGradient);
    root.style.setProperty('--theme-accent', currentColor.accent);
    root.style.setProperty('--theme-glow', currentColor.ambientGlow);
    root.style.setProperty('--theme-card-bg', currentColor.cardBg);
    root.style.setProperty('--theme-border-glow', currentColor.borderGlow);
    root.style.setProperty('--theme-text', currentColor.textColor);
    root.style.setProperty('--theme-tag-bg', currentColor.tagBg);
  }, [currentColor]);

  const setThemeByColorName = (colorName) => {
    if (!colorName) return;
    const key = Object.keys(COLOR_PALETTES).find(k =>
      colorName.toLowerCase().includes(k.toLowerCase())
    ) || 'Black';

    setCurrentColor(COLOR_PALETTES[key]);
  };

  const setThemeByProduct = (product) => {
    if (!product) return;
    if (product.primaryColor && product.primaryColor.name) {
      setThemeByColorName(product.primaryColor.name);
    } else if (product.colors && product.colors.length > 0) {
      setThemeByColorName(product.colors[0].name || product.colors[0]);
    }
  };

  const resetToDefault = () => {
    if (!isDynamicLocked) {
      setCurrentColor(COLOR_PALETTES['Black']);
    }
  };

  return (
    <ThemeColorContext.Provider value={{
      currentColor,
      setCurrentColor,
      setThemeByColorName,
      setThemeByProduct,
      resetToDefault,
      isDynamicLocked,
      setIsDynamicLocked,
      palettes: COLOR_PALETTES
    }}>
      {children}
    </ThemeColorContext.Provider>
  );
};

export const useThemeColor = () => {
  const context = useContext(ThemeColorContext);
  if (!context) {
    return {
      currentColor: COLOR_PALETTES['Black'],
      setCurrentColor: () => {},
      setThemeByColorName: () => {},
      setThemeByProduct: () => {},
      resetToDefault: () => {},
      isDynamicLocked: false,
      setIsDynamicLocked: () => {},
      palettes: COLOR_PALETTES
    };
  }
  return context;
};
