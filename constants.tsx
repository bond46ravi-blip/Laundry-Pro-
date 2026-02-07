
import React from 'react';

export const COLORS = {
  primary: '#0F172A', // Slate 900
  accent: '#2563EB',  // Blue 600
  success: '#10B981', // Emerald 500
  warning: '#F59E0B', // Amber 500
  danger: '#EF4444',  // Red 500
};

export const SERVICES_CONFIG = [
  { id: 'wash_fold', name: 'Wash & Fold', price: 49, icon: '🧺' },
  { id: 'wash_iron', name: 'Wash & Iron', price: 69, icon: '👔' },
  { id: 'quick_service', name: 'Quick Service', price: 89, icon: '🏃' },
  { id: 'steam_iron', name: 'Steam Iron', price: 29, icon: '💨' },
  { id: 'dry_clean', name: 'Dry Clean', price: 149, icon: '✨' },
  { id: 'shoe_wash', name: 'Shoe Wash', price: 199, icon: '👟' },
  { id: 'blanket', name: 'Blanket Cleaning', price: 299, icon: '🛏️' },
  { id: 'express', name: 'Express Service', price: 99, icon: '⚡' },
];

export const STATUS_FLOW_CONFIG = {
  CREATED: { label: 'Order Created', color: 'bg-blue-100 text-blue-700' },
  PARTNER_ASSIGNED: { label: 'Partner Assigned', color: 'bg-indigo-100 text-indigo-700' },
  PICKED_UP: { label: 'Picked Up', color: 'bg-yellow-100 text-yellow-700' },
  IN_PROCESSING: { label: 'Processing', color: 'bg-purple-100 text-purple-700' },
  READY: { label: 'Ready', color: 'bg-orange-100 text-orange-700' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'bg-cyan-100 text-cyan-700' },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
};
