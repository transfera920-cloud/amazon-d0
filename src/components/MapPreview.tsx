import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LodgingPlace } from '../types';

interface MapPreviewProps {
  trailheadName: string;
  latitude: number;
  longitude: number;
  driveTime: string;
  lodgings: LodgingPlace[];
  isLoadingLodgings?: boolean;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  trailheadName,
  latitude,
  longitude,
  driveTime,
  lodgings,
  isLoadingLodgings = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const trailheadMarkerRef = useRef<L.Marker | null>(null);
  const lodgingMarkersLayerRef = useRef<L.LayerGroup | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  // 根據車程估計地圖上的參考半徑（公尺）
  const getRadiusMeters = (time: string): number => {
    switch (time) {
      case '30m':
        return 18000;
      case '60m':
        return 35000;
      case '90m':
        return 50000;
      case '120m':
        return 68000;
      case 'any':
      default:
        return 55000;
    }
  };

  // 1. 初始化地圖與登山口圖層
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: 11,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map);

      // 自訂登山口標記（醒目高對比山岳圖示）
      const trailheadIcon = L.divIcon({
        className: 'trailhead-marker-pin',
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            background-color: #047857;
            color: white;
            border-radius: 50%;
            border: 3px solid #ffffff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            font-size: 19px;
            cursor: pointer;
          ">
            ⛰️
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -19],
      });

      const trailheadMarker = L.marker([latitude, longitude], {
        icon: trailheadIcon,
        zIndexOffset: 1000,
      }).addTo(map);

      trailheadMarker.bindPopup(`
        <div style="padding: 4px; font-family: sans-serif;">
          <div style="font-size: 11px; color: #047857; font-weight: bold; margin-bottom: 2px;">登山口起點</div>
          <div style="font-size: 15px; font-weight: bold; color: #1c1917;">${trailheadName}</div>
          <div style="font-size: 12px; color: #78716c; margin-top: 3px;">D0 住宿搜尋參考中心點</div>
        </div>
      `);

      trailheadMarkerRef.current = trailheadMarker;

      // 車程搜尋半徑圈
      const circle = L.circle([latitude, longitude], {
        radius: getRadiusMeters(driveTime),
        color: '#059669',
        fillColor: '#10b981',
        fillOpacity: 0.1,
        weight: 1.5,
        dashArray: '5, 8',
      }).addTo(map);
      circleRef.current = circle;

      // 住宿點圖層群組
      const lodgingLayer = L.layerGroup().addTo(map);
      lodgingMarkersLayerRef.current = lodgingLayer;

      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    } else {
      // 地圖已存在，更新登山口座標與半徑圈
      const map = mapInstanceRef.current;
      if (trailheadMarkerRef.current) {
        trailheadMarkerRef.current.setLatLng([latitude, longitude]);
        trailheadMarkerRef.current.setPopupContent(`
          <div style="padding: 4px; font-family: sans-serif;">
            <div style="font-size: 11px; color: #047857; font-weight: bold; margin-bottom: 2px;">登山口起點</div>
            <div style="font-size: 15px; font-weight: bold; color: #1c1917;">${trailheadName}</div>
            <div style="font-size: 12px; color: #78716c; margin-top: 3px;">D0 住宿搜尋參考中心點</div>
          </div>
        `);
      }

      if (circleRef.current) {
        circleRef.current.setLatLng([latitude, longitude]);
        circleRef.current.setRadius(getRadiusMeters(driveTime));
      }
    }
  }, [latitude, longitude, trailheadName, driveTime]);

  // 2. 當搜尋結果 (lodgings) 更新時，直接在地圖預覽繪製所有住宿點標記
  useEffect(() => {
    const map = mapInstanceRef.current;
    const lodgingLayer = lodgingMarkersLayerRef.current;
    if (!map || !lodgingLayer) return;

    // 清空舊的住宿標記
    lodgingLayer.clearLayers();

    const boundsPoints: L.LatLngExpression[] = [[latitude, longitude]];

    lodgings.forEach((lodging) => {
      boundsPoints.push([lodging.latitude, lodging.longitude]);

      // 依住宿種類給予相應標記造型
      const isHotel = lodging.typeCategory === 'hotel';
      const isCamp = lodging.typeCategory === 'camp';
      const isHostel = lodging.typeCategory === 'hostel';
      const badgeIcon = isHotel ? '🏨' : isCamp ? '⛺' : isHostel ? '🛏️' : '🏡';
      const bgColor = isHotel ? '#1e40af' : isCamp ? '#0f766e' : isHostel ? '#7c2d12' : '#b45309';

      const lodgingIcon = L.divIcon({
        className: 'lodging-marker-pin',
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            background-color: ${bgColor};
            color: white;
            border-radius: 50%;
            border: 2.5px solid #ffffff;
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
            font-size: 16px;
            cursor: pointer;
          ">
            ${badgeIcon}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });

      const navUrl = `https://www.google.com/maps/search/${encodeURIComponent(lodging.name)}`;

      const marker = L.marker([lodging.latitude, lodging.longitude], {
        icon: lodgingIcon,
      });

      // 點擊地標彈出卡片（顯示條件、價格、評分、車程與導航）
      marker.bindPopup(`
        <div style="padding: 6px 4px; min-width: 190px; font-family: sans-serif;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 5px;">
            <span style="font-size: 11px; background-color: #f5f5f4; color: #44403c; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
              ${lodging.type}
            </span>
            <span style="font-size: 11px; color: #b45309; font-weight: bold;">
              車程約 ${lodging.driveMinutes} 分鐘
            </span>
          </div>
          <div style="font-size: 14px; font-weight: bold; color: #1c1917; margin-bottom: 4px;">
            ${lodging.name}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; margin: 4px 0 8px 0; background: #fafaf9; padding: 4px 8px; border-radius: 6px; border: 1px solid #e7e5e4;">
            <span style="color: #047857; font-weight: 700;">約 NT$ ${lodging.price.toLocaleString()}</span>
            <span style="color: #d97706; font-weight: 600;">★ ${lodging.rating.toFixed(1)}</span>
          </div>
          <div style="font-size: 11px; color: #78716c; margin-bottom: 8px;">
            地區：${lodging.area}
          </div>
          <a href="${navUrl}" target="_blank" rel="noopener noreferrer" style="
            display: block;
            text-align: center;
            background-color: #065f46;
            color: #ffffff;
            font-size: 12px;
            font-weight: 600;
            padding: 6px 10px;
            border-radius: 6px;
            text-decoration: none;
          ">
            開啟地圖查看與導航 ↗
          </a>
        </div>
      `);

      lodgingLayer.addLayer(marker);
    });

    // 自動縮放讓登山口與所有住宿搜尋結果皆能完整收納在預覽視角中
    if (boundsPoints.length > 1) {
      map.fitBounds(boundsPoints, {
        padding: [40, 40],
        maxZoom: 13,
      });
    } else {
      map.setView([latitude, longitude], 11);
    }
  }, [lodgings, latitude, longitude]);

  // 元件卸載時清理地圖
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-96 sm:h-[420px] rounded-xl overflow-hidden border border-stone-200 shadow-inner bg-stone-100">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* 地圖右上角：搜尋結果標記統計 */}
      <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-800 border border-stone-200 shadow-sm flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
        {isLoadingLodgings ? (
          <span>正在搜尋符合條件之住宿...</span>
        ) : (
          <span>符合條件：{lodgings.length} 處住宿點</span>
        )}
      </div>

      {/* 無符合條件時的友善提示 */}
      {!isLoadingLodgings && lodgings.length === 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/20 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-xs p-4 rounded-xl border border-stone-200 shadow-md text-center max-w-sm">
            <p className="text-sm font-bold text-stone-800">目前條件下暫無完全符合之住宿</p>
            <p className="text-xs text-stone-500 mt-1">建議放寬「車程」、「價格」或「住宿類型」等條件後重新搜尋</p>
          </div>
        </div>
      )}

      {/* 地圖左下角：登山口與圖例 */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-xs px-3 py-2 rounded-lg text-xs text-stone-700 border border-stone-200 shadow-sm flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-1.5 font-semibold text-stone-900">
          <span>⛰️ 登山口：{trailheadName}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-0.5 border-t border-stone-100">
          <span className="flex items-center gap-1">🏡 民宿</span>
          <span className="flex items-center gap-1">🏨 飯店旅館</span>
          <span className="flex items-center gap-1">🛏️ 背包客棧</span>
          <span className="flex items-center gap-1">⛺ 露營山莊</span>
        </div>
      </div>
    </div>
  );
};
