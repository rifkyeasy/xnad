'use client';

import { Avatar } from '@heroui/avatar';
import { Card, CardBody } from '@heroui/card';
import { Skeleton } from '@heroui/skeleton';

import { type XProfile, formatJoinDate } from '@/hooks/useXProfiles';

interface XProfileCardProps {
  profile: XProfile;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function XProfileCard({ profile, isSelected, onClick, size = 'md' }: XProfileCardProps) {
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };

  const avatarSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <Card
      className={`${isSelected ? 'border-2 border-success bg-success/5' : 'border border-success/40 shadow-none bg-transparent'} transition-all`}
      isPressable={!!onClick}
      onPress={onClick}
    >
      <CardBody className={`${sizeClasses[size]} flex flex-row items-center gap-3`}>
        <Avatar
          showFallback
          className={`${avatarSizes[size]} flex-shrink-0`}
          name={profile.name}
          src={profile.avatar}
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{profile.name}</p>
          <p className="text-sm text-default-500 truncate">@{profile.username}</p>
        </div>
        {profile.createdAt && size !== 'sm' && (
          <div className="text-xs text-default-400 flex-shrink-0">
            Joined {formatJoinDate(profile.createdAt)}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

interface XProfileListProps {
  profiles: XProfile[];
  isLoading?: boolean;
  selectedUsername?: string;
  onSelect?: (profile: XProfile) => void;
}

export function XProfileList({
  profiles,
  isLoading,
  selectedUsername,
  onSelect,
}: XProfileListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-success/40 shadow-none bg-transparent">
            <CardBody className="p-3 flex flex-row items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  if (profiles.length === 0) {
    return <div className="text-center text-default-500 py-4">No profiles found</div>;
  }

  return (
    <div className="space-y-2">
      {profiles.map((profile) => (
        <XProfileCard
          key={profile.username}
          isSelected={selectedUsername?.toLowerCase() === profile.username.toLowerCase()}
          profile={profile}
          onClick={onSelect ? () => onSelect(profile) : undefined}
        />
      ))}
    </div>
  );
}

interface XProfileBadgeProps {
  profile: XProfile;
}

export function XProfileBadge({ profile }: XProfileBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-default-100">
      <Avatar showFallback className="w-5 h-5" name={profile.name} src={profile.avatar} />
      <span className="text-sm font-medium">@{profile.username}</span>
    </div>
  );
}
