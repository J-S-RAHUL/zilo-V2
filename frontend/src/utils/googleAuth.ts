/**
 * Official Google Identity Services (GIS) Client Integration
 * Documentation: https://developers.google.com/identity/gsi/web/guides/overview
 */

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number | string;
              locale?: string;
            }
          ) => void;
          prompt: (momentListener?: (notification: any) => void) => void;
          revoke: (hint: string, done?: () => void) => void;
        };
      };
    };
  }
}

export interface GoogleCredentialResponse {
  credential: string; // JWT ID token signed by Google
  select_by: string;
}

export interface GoogleUserPayload {
  iss: string;
  nbf: number;
  aud: string;
  sub: string; // Unique Google User ID
  email: string;
  email_verified: boolean;
  azp: string;
  name: string;
  picture: string; // URL of Google user profile image
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
}

/**
 * Safely decodes a Google JWT Credential without external libraries.
 */
export const decodeGoogleCredential = (credential: string): GoogleUserPayload | null => {
  try {
    const parts = credential.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as GoogleUserPayload;
  } catch (err) {
    console.error('Failed to decode Google JWT token:', err);
    return null;
  }
};

/**
 * Default public / demo client ID for localhost development or from Vite environment variable.
 */
export const getGoogleClientId = (): string => {
  return (
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    localStorage.getItem('zilo_google_client_id') ||
    '1084291845186-google-demo-client.apps.googleusercontent.com'
  );
};
