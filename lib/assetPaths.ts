/**
 * Centralized asset path constants for images in public/
 * Single source of truth for brand, modules, and catalog images.
 */

// Brand assets
export const BRAND_LOGO = '/shared/brand/logo-navaa.png';

// Module illustrations
export const MODULES = {
  onboarding: '/shared/modules/onboarding.png',
  foundation: '/shared/modules/foundationcase.png',
  expert: '/shared/modules/expertcase.png',
} as const;

// Catalog images (course tiles)
export const CATALOG = {
  strategy: '/shared/catalog/strategy-track.png',
  po: '/shared/catalog/po-track.png',
  cfo: '/shared/catalog/cfo-track.png',
  communication: '/shared/catalog/communication.png',
  hardDecisions: '/shared/catalog/hard-decisions.png',
  kiManager: '/shared/catalog/ki-manager.png',
  negotiation: '/shared/catalog/negotiation.png',
} as const;

// Helpers (optional)
export type ModuleKey = keyof typeof MODULES;
export type CatalogKey = keyof typeof CATALOG;

export const moduleByKey = (key: ModuleKey) => MODULES[key];
export const catalogByKey = (key: CatalogKey) => CATALOG[key];
