/**
 * Common TypeScript interfaces and types used throughout the application
 */

/**
 * Generic API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Error handling types
 */
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
}

/**
 * Loading state management
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated?: Date | undefined;
}

/**
 * Pagination interface
 */
export interface PaginationParams {
  page: number;
  limit: number;
  total?: number | undefined;
}

/**
 * Code formatting types
 */
export interface CodeBlock {
  code: string[];
  language: string;
  startLine: number;
  endLine: number;
}

export interface CodeDetectionResult {
  isCode: boolean;
  language: string;
  confidence: number;
}

/**
 * Blog post content formatting
 */
export interface FormattedContent {
  type: 'text' | 'code' | 'heading' | 'list';
  content: string;
  language?: string | undefined;
  metadata?: Record<string, unknown> | undefined;
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime?: number;
  memoryUsage?: number;
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
}

/**
 * Navigation item structure
 */
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  isActive?: boolean;
  isExternal?: boolean;
}

/**
 * SEO metadata
 */
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

/**
 * Component props with common patterns
 */
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

/**
 * Form validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Analytics event
 */
export interface AnalyticsEvent {
  name: string;
  category: string;
  properties?: Record<string, unknown>;
  timestamp: Date;
}

/**
 * Feature flag configuration
 */
export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description?: string;
  rolloutPercentage?: number;
}

/**
 * Environment configuration
 */
export interface EnvironmentConfig {
  isDevelopment: boolean;
  isProduction: boolean;
  apiBaseUrl: string;
  enableAnalytics: boolean;
  enableLogging: boolean;
}

/**
 * Utility type for making all properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Utility type for making all properties required
 */
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Utility type for extracting array element type
 */
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

/**
 * Utility type for function parameters
 */
export type FunctionParams<T> = T extends (...args: infer P) => unknown ? P : never;

/**
 * Utility type for async function return type
 */
export type AsyncReturnType<T> = T extends (...args: unknown[]) => Promise<infer R> ? R : never;
