"use client"

import { Menu, Bell, Search, User, LogOut, ArrowLeft } from "lucide-react"
import { memo, useMemo, useCallback, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
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
import { useWalletStatus } from "@/hooks/use-wallet"
import { useWallet } from "@/hooks/use-wallet"

interface TopNavigationProps {
  setSidebarOpen: (open: boolean) => void
}

interface UserProfileData {
  username: string | null;
  avatar_url: string | null;
  wallet_address: string;
}

// Cache key for user profile in sessionStorage
const getProfileCacheKey = (walletAddress: string) => `user_profile_${walletAddress}`;

// Memoized avatar component to prevent unnecessary re-renders
const UserAvatar = memo(() => {
  const { isConnected, address } = useWalletStatus();
  const [profile, setProfile] = useState<UserProfileData | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!isConnected || !address) {
        setProfile(null);
        return;
      }

      // Try to load from cache first
      const cacheKey = getProfileCacheKey(address);
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
              wallet_address: parsed.wallet_address || address,
            });
            return; // Use cached data, skip fetch
          }
        }
      } catch {
        // Ignore cache errors, proceed to fetch
      }

      // Fetch from API if no valid cache
      try {
        const response = await fetch('/api/profile', {
          headers: {
            'Content-Type': 'application/json',
            'x-wallet-address': address,
            'x-wallet-network': 'mainnet',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const profileData = {
            username: data.username,
            avatar_url: data.avatar_url,
            wallet_address: data.wallet_address || address,
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
      if (address) {
        const cacheKey = getProfileCacheKey(address);
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
  }, [isConnected, address]);

  const username = profile?.username || address?.slice(0, 8) || 'User';
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
  const pathname = usePathname()
  const isProfilePage = pathname === "/profile"
  const router = useRouter()
  const { isConnected, address } = useWalletStatus();
  const { disconnect } = useWallet();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [mounted, setMounted] = useState(false);

  // Only render DropdownMenu after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!isConnected || !address) {
        setProfile(null);
        return;
      }

      // Try to load from cache first
      const cacheKey = getProfileCacheKey(address);
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
              wallet_address: parsed.wallet_address || address,
            });
            return; // Use cached data, skip fetch
          }
        }
      } catch {
        // Ignore cache errors, proceed to fetch
      }

      // Fetch from API if no valid cache
      try {
        const response = await fetch('/api/profile', {
          headers: {
            'Content-Type': 'application/json',
            'x-wallet-address': address,
            'x-wallet-network': 'mainnet',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const profileData = {
            username: data.username,
            avatar_url: data.avatar_url,
            wallet_address: data.wallet_address || address,
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
      if (address) {
        const cacheKey = getProfileCacheKey(address);
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
  }, [isConnected, address]);

  const handleDisconnect = useCallback(async () => {
    await disconnect()
    router.push('/')
  }, [disconnect, router])

  const usernameDisplay = profile?.username || address?.slice(0, 8) || 'User';
  const walletDisplay = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  const username = usernameDisplay ? `@${usernameDisplay.toLowerCase().replace(/\s+/g, '_')}` : '@user';

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-800/50 bg-black px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {isProfilePage ? (
        <Button 
          variant="ghost" 
          size="sm" 
          className="lg:hidden flex items-center gap-2 hover:bg-transparent hover:text-current active:bg-transparent transition-none" 
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm">Back to Dashboard</span>
        </Button>
      ) : (
        <>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="h-6 w-px bg-gray-700 lg:hidden" />
        </>
      )}

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {!isProfilePage && (
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
        )}
        <div className={`flex items-center gap-x-4 lg:gap-x-6 ${isProfilePage ? 'ml-auto' : ''}`}>
          <Button variant="ghost" size="sm" className="relative hover:bg-transparent hover:text-current">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-xs text-white flex items-center justify-center animate-pulse">
              3
            </span>
          </Button>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-700" />

          {mounted ? (
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
                    {walletDisplay && (
                      <p className="text-xs leading-none text-muted-foreground font-mono">{walletDisplay}</p>
                    )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                  onClick={handleDisconnect} 
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-600 dark:hover:text-red-400 dark:hover:bg-red-950/50 cursor-pointer focus:text-red-500 focus:bg-red-50 dark:focus:text-red-500 dark:focus:bg-red-950/50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                  Disconnect Wallet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          ) : (
            <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 hover:ring-2 hover:ring-cyan-500/50 transition-all duration-200">
              <UserAvatar />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
