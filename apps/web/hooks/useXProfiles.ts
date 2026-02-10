'use client';

import { useState, useEffect } from 'react';

export interface XProfile {
  name: string;
  username: string;
  userId: string;
  avatar: string;
  createdAt: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

// Cache for profiles
const profileCache = new Map<string, XProfile>();

/**
 * Hook to fetch watched X accounts
 */
export function useWatchedXProfiles() {
  const [profiles, setProfiles] = useState<XProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfiles() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BACKEND_URL}/api/x/watched`);

        if (response.ok) {
          const data = await response.json();

          setProfiles(data);
          // Cache profiles
          data.forEach((profile: XProfile) => {
            profileCache.set(profile.username.toLowerCase(), profile);
          });
        } else {
          setError('Failed to fetch profiles');
        }
      } catch {
        setError('Failed to connect to server');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfiles();
  }, []);

  return { profiles, isLoading, error };
}

/**
 * Hook to fetch a single X profile
 */
export function useXProfile(username: string | null) {
  const [profile, setProfile] = useState<XProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setProfile(null);

      return;
    }

    const cleanUsername = username.replace('@', '').toLowerCase();

    // Check cache first
    const cached = profileCache.get(cleanUsername);

    if (cached) {
      setProfile(cached);

      return;
    }

    async function fetchProfile() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BACKEND_URL}/api/x/profile/${cleanUsername}`);

        if (response.ok) {
          const data = await response.json();

          setProfile(data);
          profileCache.set(cleanUsername, data);
        } else {
          setError('Profile not found');
        }
      } catch {
        setError('Failed to fetch profile');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [username]);

  return { profile, isLoading, error };
}

/**
 * Format X account creation date
 */
export function formatJoinDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}
