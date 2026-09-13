import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  Type,
  Key,
  Save,
  RotateCcw,
  Download,
  Upload,
  Check,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Globe,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  User,
  LogOut,
  Building2,
  Plus,
  Pencil,
  MapPin,
  Phone,
  MessageSquare,
  Info,
  Search,
} from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { SiteTextConfig, DEFAULT_SITE_TEXT } from '../utils/siteConfig';
import { ManualLodgingEntry } from '../types';
import {
  getManualLodgings,
  addManualLodging,
  updateManualLodging,
  deleteManualLodging,
  resetManualLodgingsToDefault,
  saveManualLodgings,
} from '../utils/manualLodgings';

const STANDARD_TRAILHEAD_CHOICES = [
  '武陵農場',
  '雪山登山口',
  '勝光登山口',
  '思源埡口',
  '南湖大山登山口',
  '屯原登山口',
  '塔塔加登山口',
  '玉山登山口',
  '向陽登山口',
  '嘉明湖登山口',
  '合歡山登山口',
  '小風口',
  '松雪樓',
  '東埔登山口',
  '八通關登山口',
  '戒茂斯登山口',
  '觀霧',
  '大鹿林道',
  '鎮西堡登山口',
  '司馬庫斯',
];

const ADMIN_USERNAME = 'yy661003';
const ADMIN_PASSWORD = 'yy661003';
const AUTH_STORAGE_KEY = 'd0_admin_authenticated';

export const AdminPanel: React.FC = () => {
  const {
    isAdminOpen,
    closeAdmin,
    siteText,
    updateSiteText,
    resetToDefaultText,
    apiKey,
    updateApiKey,
    hasCustomKey,
    hasEnvKey,
  } = useSiteConfig();

  // 登入驗證狀態（使用 sessionStorage 保存當前連線狀態）
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    }
    return false;
  });

  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'text' | 'manualLodgings' | 'apiKey'>('text');
  const [formData, setFormData] = useState<SiteTextConfig>(siteText);
  const [keyInput, setKeyInput] = useState<string>(apiKey);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState<boolean>(false);
  const [keySavedSuccess, setKeySavedSuccess] = useState<boolean>(false);

  // 在地口碑住宿管理狀態
  const [manualLodgings, setManualLodgings] = useState<ManualLodgingEntry[]>([]);
  const [manualFilterText, setManualFilterText] = useState<string>('');
  const [isManualFormOpen, setIsManualFormOpen] = useState<boolean>(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [formName, setFormName] = useState<string>('');
  const [formTrailhead, setFormTrailhead] = useState<string>('武陵農場');
  const [formIsCustomTrailhead, setFormIsCustomTrailhead] = useState<boolean>(false);
  const [formCustomTrailhead, setFormCustomTrailhead] = useState<string>('');
  const [formContact, setFormContact] = useState<string>('');
  const [formNotes, setFormNotes] = useState<string>('');
  const [formLatitude, setFormLatitude] = useState<string>('');
  const [formLongitude, setFormLongitude] = useState<string>('');
  const [formDriveDescription, setFormDriveDescription] = useState<string>('');
  const [manualSuccessMsg, setManualSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isAdminOpen) {
      setFormData(siteText);
      setKeyInput(apiKey);
      setIsSavedSuccess(false);
      setKeySavedSuccess(false);
      setLoginError(null);
      setManualLodgings(getManualLodgings());
    }
  }, [isAdminOpen, siteText, apiKey]);

  if (!isAdminOpen) return null;

  // 登入處理
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim() === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError(null);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      }
    } else {
      setLoginError('帳號或密碼錯誤，請重新輸入！');
    }
  };

  // 登出處理
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const handleFieldChange = (field: keyof SiteTextConfig, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveText = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteText(formData);
    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
    }, 2000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('確定要將前台所有文字恢復為原廠預設值嗎？')) {
      resetToDefaultText();
      setFormData(DEFAULT_SITE_TEXT);
      setIsSavedSuccess(true);
      setTimeout(() => {
        setIsSavedSuccess(false);
      }, 2000);
    }
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    updateApiKey(keyInput);
    setKeySavedSuccess(true);
    setTimeout(() => {
      setKeySavedSuccess(false);
    }, 2000);
  };

  const handleClearKey = () => {
    if (window.confirm('確定要清除已儲存的 API 金鑰嗎？')) {
      updateApiKey('');
      setKeyInput('');
      setKeySavedSuccess(true);
      setTimeout(() => {
        setKeySavedSuccess(false);
      }, 2000);
    }
  };

  // 匯出設定 JSON
  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'd0_site_text_config.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 匯入設定 JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          setFormData((prev) => ({ ...prev, ...parsed }));
          updateSiteText(parsed);
          setIsSavedSuccess(true);
          setTimeout(() => {
            setIsSavedSuccess(false);
          }, 2000);
        } catch {
          alert('匯入的 JSON 格式不正確');
        }
      };
    }
  };

  // 開啟新增在地口碑住宿表單
  const handleOpenAddManual = () => {
    setEditingEntryId(null);
    setFormName('');
    setFormTrailhead('武陵農場');
    setFormIsCustomTrailhead(false);
    setFormCustomTrailhead('');
    setFormContact('');
    setFormNotes('');
    setFormLatitude('');
    setFormLongitude('');
    setFormDriveDescription('');
    setIsManualFormOpen(true);
  };

  // 開啟編輯在地口碑住宿表單
  const handleOpenEditManual = (entry: ManualLodgingEntry) => {
    setEditingEntryId(entry.id);
    setFormName(entry.name || '');
    if (STANDARD_TRAILHEAD_CHOICES.includes(entry.trailheadName)) {
      setFormIsCustomTrailhead(false);
      setFormTrailhead(entry.trailheadName);
      setFormCustomTrailhead('');
    } else {
      setFormIsCustomTrailhead(true);
      setFormTrailhead('自訂');
      setFormCustomTrailhead(entry.trailheadName);
    }
    setFormContact(entry.contact || '');
    setFormNotes(entry.notes || '');
    setFormLatitude(entry.latitude !== undefined ? String(entry.latitude) : '');
    setFormLongitude(entry.longitude !== undefined ? String(entry.longitude) : '');
    setFormDriveDescription(entry.driveDescription || '');
    setIsManualFormOpen(true);
  };

  // 儲存口碑住宿項目
  const handleSaveManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTrailhead = formIsCustomTrailhead ? formCustomTrailhead.trim() : formTrailhead.trim();
    if (!formName.trim()) {
      alert('請填寫住宿名稱！');
      return;
    }
    if (!finalTrailhead) {
      alert('請選擇或填寫所屬登山口！');
      return;
    }

    const latVal = formLatitude.trim() ? parseFloat(formLatitude.trim()) : undefined;
    const lngVal = formLongitude.trim() ? parseFloat(formLongitude.trim()) : undefined;
    const validLat = typeof latVal === 'number' && Number.isFinite(latVal) ? latVal : undefined;
    const validLng = typeof lngVal === 'number' && Number.isFinite(lngVal) ? lngVal : undefined;

    if (editingEntryId) {
      updateManualLodging(editingEntryId, {
        name: formName.trim(),
        trailheadName: finalTrailhead,
        contact: formContact.trim(),
        notes: formNotes.trim() || undefined,
        latitude: validLat,
        longitude: validLng,
        driveDescription: formDriveDescription.trim() || undefined,
      });
      setManualSuccessMsg('已成功更新口碑住宿項目！');
    } else {
      addManualLodging({
        name: formName.trim(),
        trailheadName: finalTrailhead,
        contact: formContact.trim(),
        notes: formNotes.trim() || undefined,
        latitude: validLat,
        longitude: validLng,
        driveDescription: formDriveDescription.trim() || undefined,
      });
      setManualSuccessMsg('已成功新增口碑住宿項目！');
    }

    setManualLodgings(getManualLodgings());
    setIsManualFormOpen(false);
    setTimeout(() => {
      setManualSuccessMsg(null);
    }, 3000);
  };

  // 刪除口碑住宿項目
  const handleDeleteManualEntry = (id: string, name: string) => {
    if (window.confirm(`確定要刪除「${name}」這筆在地口碑住宿嗎？`)) {
      deleteManualLodging(id);
      setManualLodgings(getManualLodgings());
      setManualSuccessMsg('已刪除口碑住宿項目');
      setTimeout(() => setManualSuccessMsg(null), 2500);
    }
  };

  // 恢復預設口碑住宿示範資料
  const handleResetManualDefaults = () => {
    if (window.confirm('確定要將在地口碑住宿清單恢復為系統預設示範資料嗎？（含武陵客棧與勝光方便屋）')) {
      resetManualLodgingsToDefault();
      setManualLodgings(getManualLodgings());
      setManualSuccessMsg('已重設為預設口碑住宿清單！');
      setTimeout(() => setManualSuccessMsg(null), 2500);
    }
  };

  // 匯出口碑住宿 JSON
  const handleExportManualJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(manualLodgings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'd0_manual_lodgings.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 匯入口碑住宿 JSON
  const handleImportManualJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            saveManualLodgings(parsed);
            setManualLodgings(parsed);
            setManualSuccessMsg('已成功匯入口碑住宿資料！');
            setTimeout(() => setManualSuccessMsg(null), 2500);
          } else {
            alert('匯入的檔案非陣列格式');
          }
        } catch {
          alert('匯入的 JSON 格式不正確');
        }
      };
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        id="admin-login-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/65 backdrop-blur-xs"
        onClick={closeAdmin}
      >
        <div
          id="admin-login-container"
          className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-md w-full p-6 sm:p-7 text-stone-900 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 關閉按鈕 */}
          <button
            type="button"
            onClick={closeAdmin}
            className="absolute right-4 top-4 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 登入標題 */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="p-3.5 rounded-2xl bg-emerald-700 text-white shadow-md mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">後台管理員登入</h2>
            <p className="text-xs text-stone-500 mt-1">請輸入管理員帳號與密碼以進入系統後台</p>
          </div>

          {/* 錯誤提示 */}
          {loginError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* 登入表單 */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-username"
                className="block text-xs font-semibold text-stone-700 mb-1.5"
              >
                管理員帳號
              </label>
              <div className="relative">
                <input
                  id="admin-username"
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="請輸入帳號"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                  autoFocus
                  required
                />
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-stone-700 mb-1.5"
              >
                管理員密碼
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showLoginPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="請輸入密碼"
                  className="w-full pl-9 pr-10 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                  required
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>驗證並登入後台</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      id="admin-panel-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/65 backdrop-blur-xs"
      onClick={closeAdmin}
    >
      <div
        id="admin-panel-container"
        className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col text-stone-900 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 後台標題列 */}
        <div className="px-5 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-700 text-white shadow-xs">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-stone-900 leading-tight">
                  系統後台管理系統
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                  <User className="w-3 h-3" />
                  已登入：yy661003
                </span>
              </div>
              <p className="text-xs text-stone-500">
                自由編輯前台所有文字標題與設定 Google Maps API 金鑰
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 hover:border-rose-300 border border-transparent transition-colors flex items-center gap-1 cursor-pointer"
              title="登出管理員"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>登出</span>
            </button>

            <button
              type="button"
              onClick={closeAdmin}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
              aria-label="關閉後台"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 分頁切換 */}
        <div className="flex border-b border-stone-200 bg-white px-5 pt-2 gap-2 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === 'text'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>前台文字內容編輯</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manualLodgings')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === 'manualLodgings'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>在地口碑住宿管理</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === 'manualLodgings'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              {manualLodgings.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('apiKey')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors shrink-0 cursor-pointer ${
              activeTab === 'apiKey'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>API 金鑰與連線設定</span>
          </button>
        </div>

        {/* 內容區塊（可捲動） */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: 前台文字編輯 */}
          {activeTab === 'text' && (
            <form onSubmit={handleSaveText} className="space-y-6">
              {/* 群組 1：網站標題與頁尾 */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-4">
                <div className="flex items-center gap-2 text-stone-800 font-bold text-sm border-b border-stone-200 pb-2">
                  <Globe className="w-4 h-4 text-emerald-700" />
                  <span>1. 網站全域標題與頁尾</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      網站主標題
                    </label>
                    <input
                      type="text"
                      value={formData.headerTitle}
                      onChange={(e) => handleFieldChange('headerTitle', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      網站副標題
                    </label>
                    <input
                      type="text"
                      value={formData.headerSubtitle}
                      onChange={(e) => handleFieldChange('headerSubtitle', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      頁尾版權宣告文字
                    </label>
                    <input
                      type="text"
                      value={formData.footerCopyright}
                      onChange={(e) => handleFieldChange('footerCopyright', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* 群組 2：搜尋表單欄位 */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-4">
                <div className="flex items-center gap-2 text-stone-800 font-bold text-sm border-b border-stone-200 pb-2">
                  <Type className="w-4 h-4 text-emerald-700" />
                  <span>2. 搜尋條件區塊文字</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      搜尋區塊標題
                    </label>
                    <input
                      type="text"
                      value={formData.searchSectionTitle}
                      onChange={(e) => handleFieldChange('searchSectionTitle', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      登山口欄位標籤
                    </label>
                    <input
                      type="text"
                      value={formData.trailheadLabel}
                      onChange={(e) => handleFieldChange('trailheadLabel', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      登山口輸入框提示（Placeholder）
                    </label>
                    <input
                      type="text"
                      value={formData.trailheadPlaceholder}
                      onChange={(e) => handleFieldChange('trailheadPlaceholder', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      快速填入登山口按鈕（請以半形逗號 , 分隔）
                    </label>
                    <input
                      type="text"
                      value={formData.quickFillOptions}
                      onChange={(e) => handleFieldChange('quickFillOptions', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      車程欄位標籤
                    </label>
                    <input
                      type="text"
                      value={formData.driveTimeLabel}
                      onChange={(e) => handleFieldChange('driveTimeLabel', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      價格等級欄位標籤
                    </label>
                    <input
                      type="text"
                      value={formData.priceLabel}
                      onChange={(e) => handleFieldChange('priceLabel', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      最低評分欄位標籤
                    </label>
                    <input
                      type="text"
                      value={formData.ratingLabel}
                      onChange={(e) => handleFieldChange('ratingLabel', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      住宿類型欄位標籤
                    </label>
                    <input
                      type="text"
                      value={formData.lodgingTypeLabel}
                      onChange={(e) => handleFieldChange('lodgingTypeLabel', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      開始搜尋按鈕文字
                    </label>
                    <input
                      type="text"
                      value={formData.searchButtonText}
                      onChange={(e) => handleFieldChange('searchButtonText', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* 群組 3：提示標語與免責文字 */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-4">
                <div className="flex items-center gap-2 text-stone-800 font-bold text-sm border-b border-stone-200 pb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>3. 搜尋狀態提示與警語</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      即時 Google 資料成功提示標籤
                    </label>
                    <input
                      type="text"
                      value={formData.googleLiveBadgeText}
                      onChange={(e) => handleFieldChange('googleLiveBadgeText', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      離線備援資料警示標題
                    </label>
                    <input
                      type="text"
                      value={formData.offlineFallbackTitle}
                      onChange={(e) => handleFieldChange('offlineFallbackTitle', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      山區粗估車程免責警語
                    </label>
                    <input
                      type="text"
                      value={formData.offlineDriveWarning}
                      onChange={(e) => handleFieldChange('offlineDriveWarning', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      查無符合條件住宿之說明
                    </label>
                    <input
                      type="text"
                      value={formData.noResultsMessage}
                      onChange={(e) => handleFieldChange('noResultsMessage', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      查無自訂登山口定位說明
                    </label>
                    <input
                      type="text"
                      value={formData.geocodingErrorMessage}
                      onChange={(e) => handleFieldChange('geocodingErrorMessage', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* 儲存與匯出/匯入工具列 */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    恢復原廠預設
                  </button>

                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="匯出為 JSON 備份"
                  >
                    <Download className="w-3.5 h-3.5" />
                    匯出 JSON
                  </button>

                  <label className="px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    匯入 JSON
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJson}
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  {isSavedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      已更新前台文字！
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      儲存前台文字
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: 在地口碑住宿管理 */}
          {activeTab === 'manualLodgings' && (
            <div className="space-y-5">
              {/* 說明與操作列 */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm sm:text-base">
                        在地口碑住宿資料庫
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                        非 Google 即時收錄
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      手動收錄只能透過 Facebook 私訊、電話聯繫的山區接駁站、部落通鋪與方便屋
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenAddManual}
                    className="shrink-0 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>新增口碑住宿</span>
                  </button>
                </div>

                {/* 搜尋過濾與工具列 */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-stone-200">
                  <div className="relative flex-1 max-w-xs">
                    <input
                      type="text"
                      value={manualFilterText}
                      onChange={(e) => setManualFilterText(e.target.value)}
                      placeholder="搜尋名稱、登山口或備註..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={handleResetManualDefaults}
                      className="px-2.5 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      title="重設為預設示範資料（武陵客棧、勝光方便屋）"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>預設示範</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportManualJson}
                      className="px-2.5 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      title="匯出為 JSON 備份"
                    >
                      <Download className="w-3 h-3" />
                      <span>匯出</span>
                    </button>

                    <label className="px-2.5 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer">
                      <Upload className="w-3 h-3" />
                      <span>匯入</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportManualJson}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* 成功提示訊息 */}
              {manualSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{manualSuccessMsg}</span>
                </div>
              )}

              {/* 新增 / 編輯 表單 Modal / 展開區塊 */}
              {isManualFormOpen && (
                <form
                  onSubmit={handleSaveManualEntry}
                  className="p-4 sm:p-5 rounded-xl border-2 border-emerald-600/40 bg-emerald-50/20 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2.5">
                    <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                      <Building2 className="w-4 h-4 text-emerald-700" />
                      <span>{editingEntryId ? '編輯在地口碑住宿' : '新增在地口碑住宿項目'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsManualFormOpen(false)}
                      className="text-stone-400 hover:text-stone-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 住宿名稱 */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        住宿名稱 <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="例如：武陵客棧-登山旅遊協助站"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-medium"
                        required
                        autoFocus
                      />
                    </div>

                    {/* 所屬登山口 */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        所屬登山口 <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <select
                          value={formIsCustomTrailhead ? '__custom__' : formTrailhead}
                          onChange={(e) => {
                            if (e.target.value === '__custom__') {
                              setFormIsCustomTrailhead(true);
                            } else {
                              setFormIsCustomTrailhead(false);
                              setFormTrailhead(e.target.value);
                            }
                          }}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                        >
                          <optgroup label="常見登山口清單">
                            {STANDARD_TRAILHEAD_CHOICES.map((th) => (
                              <option key={th} value={th}>
                                ⛰️ {th}
                              </option>
                            ))}
                          </optgroup>
                          <option value="__custom__">✏️ 自行輸入其他登山口名稱...</option>
                        </select>

                        {formIsCustomTrailhead && (
                          <input
                            type="text"
                            value={formCustomTrailhead}
                            onChange={(e) => setFormCustomTrailhead(e.target.value)}
                            placeholder="請輸入登山口名稱（例如：合歡西北峰登山口）"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-emerald-400 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                            required
                          />
                        )}
                      </div>
                    </div>

                    {/* 聯絡方式 */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        聯絡方式（可填寫 Facebook 專頁連結、電話、Line ID 等）
                      </label>
                      <textarea
                        rows={2}
                        value={formContact}
                        onChange={(e) => setFormContact(e.target.value)}
                        placeholder="例如：Facebook 專頁私訊：https://www.facebook.com/wulinginn / 電話：0912-345678"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                        required
                      />
                    </div>

                    {/* 備註說明 */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        備註說明（例如：僅接受私訊預約、無法線上查詢空房、通鋪衛浴設備等）
                      </label>
                      <textarea
                        rows={2}
                        value={formNotes}
                        onChange={(e) => setFormNotes(e.target.value)}
                        placeholder="例如：僅接受 Facebook 私訊預約、無法線上查詢即時空房。提供行前通鋪與登山口接駁。"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    {/* 大概車程 / 距離描述 */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        大概車程／距離描述（自由文字，無座標時用以參考）
                      </label>
                      <input
                        type="text"
                        value={formDriveDescription}
                        onChange={(e) => setFormDriveDescription(e.target.value)}
                        placeholder="例如：距武陵農場登山口約 12-15 分鐘車程（位於台7甲線約53K處）"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    {/* 大概座標（選填） */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        大概緯度（Latitude，選填）
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formLatitude}
                        onChange={(e) => setFormLatitude(e.target.value)}
                        placeholder="例如：24.3468"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        大概經度（Longitude，選填）
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formLongitude}
                        onChange={(e) => setFormLongitude(e.target.value)}
                        placeholder="例如：121.3135"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2 text-[11px] text-stone-500 bg-stone-100 p-2.5 rounded-lg flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                      <span>
                        座標為選填欄位。有填寫座標的項目，將在前台地圖上以專屬紫色圖釘標示；若未填寫座標，僅於搜尋結果頁以文字卡片列出，不影響正常瀏覽。
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-200">
                    <button
                      type="button"
                      onClick={() => setIsManualFormOpen(false)}
                      className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800 bg-white border border-stone-200 rounded-xl transition-colors cursor-pointer"
                    >
                      取消
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingEntryId ? '儲存變更' : '確定新增'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* 現存口碑住宿清單 */}
              <div className="space-y-3">
                {manualLodgings
                  .filter((item) => {
                    if (!manualFilterText.trim()) return true;
                    const q = manualFilterText.toLowerCase();
                    return (
                      item.name.toLowerCase().includes(q) ||
                      item.trailheadName.toLowerCase().includes(q) ||
                      item.contact.toLowerCase().includes(q) ||
                      (item.notes && item.notes.toLowerCase().includes(q)) ||
                      (item.driveDescription && item.driveDescription.toLowerCase().includes(q))
                    );
                  })
                  .map((item) => {
                    const hasCoords =
                      typeof item.latitude === 'number' &&
                      Number.isFinite(item.latitude) &&
                      typeof item.longitude === 'number' &&
                      Number.isFinite(item.longitude);

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl border border-stone-200 bg-white hover:border-stone-300 transition-colors space-y-2.5 shadow-2xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-stone-900 text-sm sm:text-base">
                              {item.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              ⛰️ {item.trailheadName}
                            </span>
                            {hasCoords ? (
                              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-purple-600" />
                                <span>
                                  {item.latitude?.toFixed(4)}, {item.longitude?.toFixed(4)}
                                </span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-stone-100 text-stone-600">
                                📝 純文字列表
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => handleOpenEditManual(item)}
                              className="px-2.5 py-1 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Pencil className="w-3 h-3 text-stone-600" />
                              <span>編輯</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteManualEntry(item.id, item.name)}
                              className="px-2.5 py-1 text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3 text-rose-600" />
                              <span>刪除</span>
                            </button>
                          </div>
                        </div>

                        {/* 聯絡資訊 */}
                        <div className="text-xs text-stone-700 flex items-start gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                          <span className="font-semibold text-stone-800 shrink-0">聯絡方式：</span>
                          <span className="break-all">{item.contact}</span>
                        </div>

                        {/* 大概車程 */}
                        {item.driveDescription && (
                          <div className="text-xs text-amber-800 flex items-start gap-1.5">
                            <span className="shrink-0">🚗</span>
                            <span className="font-semibold text-stone-800 shrink-0">車程／位置：</span>
                            <span>{item.driveDescription}</span>
                          </div>
                        )}

                        {/* 備註說明 */}
                        {item.notes && (
                          <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200/60 leading-relaxed">
                            <span className="font-semibold text-stone-700">備註：</span>
                            {item.notes}
                          </div>
                        )}
                      </div>
                    );
                  })}

                {manualLodgings.length === 0 && (
                  <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200 text-stone-500 text-xs">
                    目前尚未建立任何在地口碑住宿項目。點選上方「新增口碑住宿」或「預設示範」快速載入。
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: API 金鑰與連線設定 */}
          {activeTab === 'apiKey' && (
            <div className="space-y-6">
              {/* 金鑰狀態卡片 */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-emerald-700" />
                    Google Maps Platform API 金鑰
                  </span>
                  {hasCustomKey ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      已儲存本機金鑰
                    </span>
                  ) : hasEnvKey ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      使用環境變數金鑰
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                      未設定（離線備援中）
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveKey} className="space-y-3">
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                      placeholder="請輸入 AIzaSy... 開頭的 Google Maps API 金鑰"
                      className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-mono"
                      autoComplete="off"
                      spellCheck="false"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    {hasCustomKey ? (
                      <button
                        type="button"
                        onClick={handleClearKey}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        清除已存金鑰
                      </button>
                    ) : (
                      <div />
                    )}

                    <button
                      type="submit"
                      className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      {keySavedSuccess ? (
                        <>
                          <Check className="w-4 h-4" />
                          金鑰已生效！
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          儲存並套用金鑰
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* 測試環境與實際佈署環境不同排查重點 */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-xs text-amber-950 space-y-3">
                <div className="font-bold text-sm text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>重要：測試環境與實際佈署網址不同的排查指南</span>
                </div>

                <div className="space-y-2 text-amber-900 leading-relaxed">
                  <p>
                    如果您在<strong>實際佈署網址</strong>或<strong>分享網址</strong>遇到「403 授權失敗」，通常是因為 Google Cloud 憑證設定了限制：
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 pl-1 font-medium">
                    <li>
                      <strong>應用程式限制（HTTP 參照網址）</strong>：若您的金鑰限制了特定網站網址，更換域名（例如從測試環境切換到正式佈署網址）時，Google 會直接封鎖請求。
                      <br />
                      <span className="text-emerald-800 font-bold">
                        👉 建議在 Google Cloud Console 憑證管理中，將「應用程式限制」暫時設為「無（None）」或將實際佈署的域名加入白名單。
                      </span>
                    </li>
                    <li>
                      <strong>API 限制</strong>：若限制了 API，請務必確認已勾選<strong>「Places API (New)」</strong>、<strong>「Geocoding API」</strong>與<strong>「Routes API」</strong>。
                    </li>
                    <li>
                      <strong>帳單帳戶</strong>：請確認該 Google Cloud 專案已綁定帳單帳戶（每月有 200 美元免費額度，不會扣款，但未綁定帳單時 Google 會全面拒絕新版 API 呼叫）。
                    </li>
                  </ol>
                </div>
              </div>

              {/* 服務清單 */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 text-xs text-stone-700 space-y-2">
                <div className="font-bold text-stone-900">
                  📌 系統使用的 3 大 Google Maps Platform 服務：
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <div className="p-2.5 rounded-lg bg-white border border-stone-200">
                    <div className="font-bold text-emerald-800">Places API (New)</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">搜尋周邊即時旅宿與真實評級</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-stone-200">
                    <div className="font-bold text-emerald-800">Routes API</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">高山蜿蜒產業道路真實車程與距離</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-stone-200">
                    <div className="font-bold text-emerald-800">Geocoding API</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">自訂輸入百岳登山口真實座標編碼</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
