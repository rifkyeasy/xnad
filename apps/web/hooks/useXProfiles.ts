'use client';

import { useQuery } from '@tanstack/react-query';

export interface XProfile {
  name: string;
  username: string;
  userId: string;
  avatar: string;
  createdAt: string;
}

const BACKEND_URL = 'https://api.xnad.fun';

async function fetchWatchedProfiles(): Promise<XProfile[]> {
  // Try local Next.js API route first, fall back to backend
  let response = await fetch('/api/x/watched');

  if (!response.ok) {
    response = await fetch(`${BACKEND_URL}/api/x/watched`);
  }

  if (!response.ok) throw new Error('Failed to fetch profiles');

  return response.json();
}

async function fetchXProfile(username: string): Promise<XProfile> {
  const cleanUsername = username.replace('@', '').toLowerCase();

  let response = await fetch(`/api/x/profile/${cleanUsername}`);

  if (!response.ok) {
    response = await fetch(`${BACKEND_URL}/api/x/profile/${cleanUsername}`);
  }

  if (!response.ok) throw new Error('Profile not found');

  return response.json();
}

export function useWatchedXProfiles() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['watchedXProfiles'],
    queryFn: fetchWatchedProfiles,
    staleTime: 10 * 60 * 1000, // 10 min
  });

  return {
    profiles: data ?? [],
    isLoading,
    error: error?.message ?? null,
  };
}

export function useXProfile(username: string | null) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['xProfile', username],
    queryFn: () => fetchXProfile(username!),
    enabled: !!username,
    staleTime: 10 * 60 * 1000,
  });

  return {
    profile: data ?? null,
    isLoading,
    error: error?.message ?? null,
  };
}

export function formatJoinDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}
