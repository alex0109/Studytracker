/* eslint-disable @typescript-eslint/no-explicit-any */

export interface UserSupabase {
  id: string; // Unique identifier for the user (UUID)
  aud: string; // Audience of the JWT token
  role: string; // User's role, used for Row Level Security (RLS) in Postgres
  email: string | undefined; // User's email address (if provided)
  email_confirmed_at: string | undefined; // Timestamp when the email was confirmed
  phone: string | undefined; // User's phone number (if provided)
  phone_confirmed_at: string | undefined; // Timestamp when the phone was confirmed
  confirmed_at: string | undefined; // Timestamp when the user was generally confirmed (either email or phone)
  last_sign_in_at: string | undefined; // Timestamp of the last sign-in
  app_metadata: {
    provider?: string; // The primary provider used for sign-up (e.g., 'email', 'google')
    providers?: string[]; // Array of providers used for login
    [key: string]: any; // Other application-specific metadata
  };
  user_metadata: {
    [key: string]: any; // Custom user metadata (editable by the user)
  };
  identities: IdentitySupabase[]; // Array of identities linked to the user
  created_at: string; // Timestamp when the user was created
  updated_at: string; // Timestamp when the user was last updated
  is_anonymous: boolean; // Indicates if the user is anonymous
}

export interface IdentitySupabase {
  id: string; // Unique identifier for the identity
  user_id: string; // ID of the associated user
  identity_data: {
    [key: string]: any; // Provider-specific identity data (e.g., Google profile info)
  };
  provider: string; // The authentication provider for this identity (e.g., 'google', 'github')
  last_sign_in_at: string; // Timestamp of the last sign-in using this identity
  created_at: string; // Timestamp when the identity was created
  updated_at: string; // Timestamp when the identity was last updated
}
