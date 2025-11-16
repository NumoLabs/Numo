"use client"

import { Menu, Bell, Search, User, LogOut } from "lucide-react"
import { memo, useMemo, useCallback, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCavosAuthContext } from "@/components/cavos-auth-provider"

interface TopNavigationProps {
  setSidebarOpen: (open: boolean) => void
}

interface UserProfileData {
  username: string | null;
  avatar_url: string | null;
  email: string;
}

// Cache key for user profile in sessionStorage
const getProfileCacheKey = (userId: string) => `user_profile_${userId}`;

// Memoized avatar component to prevent unnecessary re-renders
const UserAvatar = memo(() => {
  const { user: authUser, isAuthenticated, accessToken, refreshToken } = useCavosAuthContext();
  const [profile, setProfile] = useState<UserProfileData | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated || !authUser?.id) {
        setProfile(null);
        return;
      }

      // Try to load from cache first
      const cacheKey = getProfileCacheKey(authUser.id);
      try {
        const cachedData = sessionStorage.getItem(cacheKey);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          // Check if cache is still valid (not older than 5 minutes)
          const cacheAge = Date.now() - (parsed.timestamp || 0);
          if (cacheAge < 5 * 60 * 1000) { // 5 minutes
            setProfile({
              username: parsed.username,
              avatar_url: parsed.avatar_url,
              email: parsed.email || authUser.email || '',
            });
            return; // Use cached data, skip fetch
          }
        }
      } catch {
        // Ignore cache errors, proceed to fetch
      }

      // Fetch from API if no valid cache
      try {
        const token = accessToken || 
          (typeof window !== 'undefined' 
            ? localStorage.getItem('cavos_access_token')
            : null);
        
        if (!token || typeof token !== 'string' || token.trim().length === 0) {
          console.warn('No access token available for profile fetch');
          return;
        }
        
        let response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        // If 401, try to refresh token and retry
        if (response.status === 401) {
          try {
            // Only attempt refresh if not already marked as invalid
            const refreshResult = await refreshToken();
            
            // Get new token after refresh
            const newToken = refreshResult?.access_token || 
              (typeof window !== 'undefined' 
                ? localStorage.getItem('cavos_access_token')
                : null);
            
            if (newToken) {
              // Retry with new token
              response = await fetch('/api/profile', {
                headers: {
                  'Authorization': `Bearer ${newToken}`,
                },
              });
            }
          } catch (refreshError: unknown) {
            // If refresh token is expired (401), signOut will be called automatically
            // Just silently fail for avatar loading
            const errorMessage = refreshError instanceof Error ? refreshError.message : String(refreshError || '')
            if (errorMessage.includes('401') || errorMessage.includes('Invalid or expired refresh token') || errorMessage.includes('Refresh token')) {
              // Session expired - signOut will be called automatically, just return
              return;
            }
            // For other errors, log and return
            return;
          }
        }
        
        if (response.ok) {
          const data = await response.json();
          const profileData = {
            username: data.username,
            avatar_url: data.avatar_url,
            email: data.email || authUser.email || '',
          };
          
          setProfile(profileData);
          
          // Cache the profile data
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify({
              ...profileData,
              timestamp: Date.now(),
            }));
          } catch {
            // Ignore cache write errors
          }
        }
      } catch {
        // Error already logged, just continue
      }
    };

    loadProfile();

    // Listen for profile updates
    const handleProfileUpdate = () => {
      // Clear cache when profile is updated
      if (authUser?.id) {
        const cacheKey = getProfileCacheKey(authUser.id);
        try {
          sessionStorage.removeItem(cacheKey);
        } catch {
          // Ignore cache errors
        }
      }
      loadProfile();
    };
    
    window.addEventListener('profile-updated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, [isAuthenticated, authUser?.id, authUser?.email, accessToken, refreshToken]);

  const username = profile?.username || authUser?.email?.split('@')[0] || 'User';
  const initials = useMemo(() => {
    return username
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  }, [username]);

  const avatarUrl = profile?.avatar_url || null;

  return (
    <Avatar className="h-8 w-8 border-2 border-white/20 ring-1 ring-black/10">
      {avatarUrl ? (
        <AvatarImage 
          key={avatarUrl}
          src={avatarUrl} 
          alt={username}
          className="object-cover"
          loading="lazy"
        />
      ) : null}
      <AvatarFallback className="bg-gradient-to-br from-bitcoin-orange to-bitcoin-gold text-white text-xs font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
});

UserAvatar.displayName = 'UserAvatar'

export function TopNavigation({ setSidebarOpen }: TopNavigationProps) {
  const router = useRouter()
  const { signOut: cavosSignOut, user: authUser, isAuthenticated, accessToken, refreshToken } = useCavosAuthContext()
  const [profile, setProfile] = useState<UserProfileData | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated || !authUser?.id) {
        setProfile(null);
        return;
      }

      // Try to load from cache first
      const cacheKey = getProfileCacheKey(authUser.id);
      try {
        const cachedData = sessionStorage.getItem(cacheKey);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          // Check if cache is still valid (not older than 5 minutes)
          const cacheAge = Date.now() - (parsed.timestamp || 0);
          if (cacheAge < 5 * 60 * 1000) { // 5 minutes
            setProfile({
              username: parsed.username,
              avatar_url: parsed.avatar_url,
              email: parsed.email || authUser.email || '',
            });
            return; // Use cached data, skip fetch
          }
        }
      } catch {
        // Ignore cache errors, proceed to fetch
      }

      // Fetch from API if no valid cache
      try {
        const token = accessToken || 
          (typeof window !== 'undefined' 
            ? localStorage.getItem('cavos_access_token')
            : null);
        
        if (!token || typeof token !== 'string' || token.trim().length === 0) {
          console.warn('No access token available for profile fetch');
          return;
        }
        
        let response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        // If 401, try to refresh token and retry
        if (response.status === 401) {
          try {
            // Only attempt refresh if not already marked as invalid
            const refreshResult = await refreshToken();
            
            // Get new token after refresh
            const newToken = refreshResult?.access_token || 
              (typeof window !== 'undefined' 
                ? localStorage.getItem('cavos_access_token')
                : null);
            
            if (newToken) {
              // Retry with new token
              response = await fetch('/api/profile', {
                headers: {
                  'Authorization': `Bearer ${newToken}`,
                },
              });
            }
          } catch (refreshError: unknown) {
            // If refresh token is expired (401), signOut will be called automatically
            // Just silently fail for avatar loading
            const errorMessage = refreshError instanceof Error ? refreshError.message : String(refreshError || '')
            if (errorMessage.includes('401') || errorMessage.includes('Invalid or expired refresh token') || errorMessage.includes('Refresh token')) {
              // Session expired - signOut will be called automatically, just return
              return;
            }
            // For other errors, log and return
            return;
          }
        }
        
        if (response.ok) {
          const data = await response.json();
          const profileData = {
            username: data.username,
            avatar_url: data.avatar_url,
            email: data.email || authUser.email || '',
          };
          
          setProfile(profileData);
          
          // Cache the profile data
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify({
              ...profileData,
              timestamp: Date.now(),
            }));
          } catch {
            // Ignore cache write errors
          }
        }
      } catch {
        // Error already logged, just continue
      }
    };

    loadProfile();

    // Listen for profile updates
    const handleProfileUpdate = () => {
      // Clear cache when profile is updated
      if (authUser?.id) {
        const cacheKey = getProfileCacheKey(authUser.id);
        try {
          sessionStorage.removeItem(cacheKey);
        } catch {
          // Ignore cache errors
        }
      }
      loadProfile();
    };
    
    window.addEventListener('profile-updated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, [isAuthenticated, authUser?.id, authUser?.email, accessToken, refreshToken]);

  const handleCavosSignOut = useCallback(async () => {
    await cavosSignOut()
    router.push('/')
  }, [cavosSignOut, router])

  const usernameDisplay = profile?.username || authUser?.email?.split('@')[0] || 'User';
  const userEmail = profile?.email || authUser?.email || '';
  const username = usernameDisplay ? `@${usernameDisplay.toLowerCase().replace(/\s+/g, '_')}` : '@user';

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-800/50 bg-black px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="h-6 w-px bg-gray-700 lg:hidden" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center">
          <div className="relative w-full max-w-lg">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-black-400" />
            </div>
            <Input
              className="block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm py-2.5 pl-10 pr-12 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg sm:text-sm"
              placeholder="Search transactions, strategies, pools..."
              type="search"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <kbd className="hidden sm:inline-flex items-center rounded border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Button variant="ghost" size="sm" className="relative hover:bg-transparent hover:text-current">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-xs text-white flex items-center justify-center animate-pulse">
              3
            </span>
          </Button>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-700" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 hover:ring-2 hover:ring-cyan-500/50 transition-all duration-200">
                <UserAvatar />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{username}</p>
                  <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleCavosSignOut} 
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-600 dark:hover:text-red-400 dark:hover:bg-red-950/50 cursor-pointer focus:text-red-500 focus:bg-red-50 dark:focus:text-red-500 dark:focus:bg-red-950/50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
