"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon missing issue in Next.js
const customIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function LiveMap({ issues }: { issues: any[] }) {
  // New York City default center
  const defaultCenter: [number, number] = [40.7128, -74.0060];

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden relative border border-slate-700/50 shadow-inner">
      <MapContainer 
        center={defaultCenter} 
        zoom={12} 
        scrollWheelZoom={false} 
        className="h-full w-full z-0"
        style={{ background: '#020617' }} // Matches our Dark Theme
      >
        {/* CartoDB Dark Matter Tiles - Looks incredible for dashboards */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {issues.map((issue) => {
          if (!issue.location || !issue.location.lat || !issue.location.lng) return null;
          if (issue.location.lat === 0 && issue.location.lng === 0) return null; // Ignore old test data

          return (
            <Marker 
              key={issue.id} 
              position={[issue.location.lat, issue.location.lng]} 
              icon={customIcon}
            >
              <Popup className="custom-popup">
                <div className="p-1">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-sky-500 mb-1 block">
                    {issue.vision?.issueType || "Issue"}
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm mb-1 leading-tight">
                    {issue.executiveSummary?.summary || "Reported Issue"}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Priority Score: {issue.priority?.score}/100
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
