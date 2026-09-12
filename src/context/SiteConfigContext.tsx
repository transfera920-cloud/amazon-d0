import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteTextConfig, getSiteTextConfig, saveSiteTextConfig, resetSiteTextConfig } from '../utils/siteConfig';
import { getGoogleMapsApiKey, setGoogleMapsApiKey, hasCustomApiKey, hasEnvApiKey } from '../utils/apiKey';

interface SiteConfigContextType {
  siteText: SiteTextConfig;
  updateSiteText: (newConfig: Partial<SiteTextConfig>) => void;
  resetToDefaultText: () => void;
  apiKey: string;
  updateApiKey: (newKey: string) => void;
  hasCustomKey: boolean;
  hasEnvKey: boolean;
  isAdminOpen: boolean;
  openAdmin: () => void;
  closeAdmin: () => void;
}

const SiteConfigContext = createContext<SiteConfigContextType | null>(null);

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteText, setSiteText] = useState<SiteTextConfig>(getSiteTextConfig());
  const [apiKey, setApiKey] = useState<string>(getGoogleMapsApiKey());
  const [hasCustomKey, setHasCustomKey] = useState<boolean>(hasCustomApiKey());
  const [hasEnvKey, setHasEnvKeyState] = useState<boolean>(hasEnvApiKey());
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleTextChange = () => {
      setSiteText(getSiteTextConfig());
    };
    const handleKeyChange = () => {
      setApiKey(getGoogleMapsApiKey());
      setHasCustomKey(hasCustomApiKey());
      setHasEnvKeyState(hasEnvApiKey());
    };

    window.addEventListener('site-text-changed', handleTextChange);
    window.addEventListener('google-api-key-changed', handleKeyChange);

    // 支援 URL query ?admin=true 自動打開後台
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || params.get('admin') === '1') {
        setIsAdminOpen(true);
      }
    }

    return () => {
      window.removeEventListener('site-text-changed', handleTextChange);
      window.removeEventListener('google-api-key-changed', handleKeyChange);
    };
  }, []);

  const updateSiteText = (newConfig: Partial<SiteTextConfig>) => {
    saveSiteTextConfig(newConfig);
    setSiteText(getSiteTextConfig());
  };

  const resetToDefaultText = () => {
    resetSiteTextConfig();
    setSiteText(getSiteTextConfig());
  };

  const updateApiKey = (newKey: string) => {
    setGoogleMapsApiKey(newKey);
    setApiKey(getGoogleMapsApiKey());
    setHasCustomKey(hasCustomApiKey());
  };

  return (
    <SiteConfigContext.Provider
      value={{
        siteText,
        updateSiteText,
        resetToDefaultText,
        apiKey,
        updateApiKey,
        hasCustomKey,
        hasEnvKey,
        isAdminOpen,
        openAdmin: () => setIsAdminOpen(true),
        closeAdmin: () => setIsAdminOpen(false),
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
};

export function useSiteConfig(): SiteConfigContextType {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
}
