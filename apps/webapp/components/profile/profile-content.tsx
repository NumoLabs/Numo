'use client';

import { useState, useEffect } from 'react';
import { useCavosAuthContext } from '@/components/cavos-auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Loader2, Save, Edit2, X, Upload } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  primary_wallet_address: string | null;
  primary_wallet_network: string | null;
  created_at: string;
  updated_at: string;
}

export function ProfileContent() {
  const { user: authUser, isAuthenticated, accessToken: contextAccessToken, refreshToken } = useCavosAuthContext();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    avatarUrl: '',
  });

  // Store original form data to restore on cancel
  const [originalFormData, setOriginalFormData] = useState({
    username: '',
    avatarUrl: '',
  });

  // Avatar upload state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated || !authUser?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Get access token from context first, then localStorage as fallback
        const accessToken = contextAccessToken || 
          (typeof window !== 'undefined' 
            ? localStorage.getItem('cavos_access_token')
            : null);
        
        if (!accessToken || typeof accessToken !== 'string' || accessToken.trim().length === 0) {
          throw new Error('Access token is required. Please sign in again.');
        }
        
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        };
        
        let response = await fetch('/api/profile', {
          headers,
        });
        
        // If 401, try to refresh token and retry
        if (response.status === 401) {
          try {
            // Only attempt refresh if not already marked as invalid
            const refreshResult = await refreshToken();
            
            // Get new token after refresh (from result or localStorage)
            const newToken = refreshResult?.access_token || 
              (typeof window !== 'undefined' 
                ? localStorage.getItem('cavos_access_token')
                : null);
            
            if (newToken) {
              // Retry with new token
              const newHeaders: HeadersInit = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${newToken}`,
              };
              
              response = await fetch('/api/profile', {
                headers: newHeaders,
              });
            } else {
              throw new Error('Failed to get new token after refresh');
            }
          } catch (refreshError: unknown) {
            // If refresh token is expired (401), signOut will be called automatically
            // Just throw a user-friendly error
            const errorMessage = refreshError instanceof Error ? refreshError.message : String(refreshError || '')
            if (errorMessage.includes('401') || errorMessage.includes('Invalid or expired refresh token') || errorMessage.includes('Refresh token')) {
              throw new Error('Your session has expired. Please sign in again.');
            }
            throw refreshError;
          }
        }
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to load profile');
        }

        const data = await response.json();
        setProfile(data);
        const initialFormData = {
          username: data.username || '',
          avatarUrl: data.avatar_url || '',
        };
        setFormData(initialFormData);
        setOriginalFormData(initialFormData);
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to load profile data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, authUser?.id, toast, contextAccessToken, refreshToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !authUser?.id) {
      toast({
        title: 'Error',
        description: 'You must be authenticated to update your profile',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);

      // Upload avatar if a new file was selected
      let avatarUrl: string | null = formData.avatarUrl || null;
      if (avatarFile) {
        try {
          const uploadedUrl = await uploadAvatar(avatarFile);
          if (!uploadedUrl) {
            throw new Error('Failed to upload avatar');
          }
          avatarUrl = uploadedUrl;
        } catch (error) {
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Failed to upload avatar',
            variant: 'destructive',
          });
          return;
        }
      }

      const accessToken = contextAccessToken || 
        (typeof window !== 'undefined' 
          ? localStorage.getItem('cavos_access_token')
          : null);
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (!accessToken || typeof accessToken !== 'string' || accessToken.trim().length === 0) {
        throw new Error('Access token is required. Please sign in again.');
      }
      
      headers['Authorization'] = `Bearer ${accessToken}`;
      
      let response = await fetch('/api/profile', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          username: formData.username || null,
          avatar_url: avatarUrl || null,
        }),
      });

      // If 401, try to refresh token and retry
      if (response.status === 401) {
        try {
          const refreshResult = await refreshToken();
          
          // Get new token after refresh
          const newToken = refreshResult?.access_token || 
            (typeof window !== 'undefined' 
              ? localStorage.getItem('cavos_access_token')
              : null);
          
          if (newToken) {
            // Retry with new token
            const newHeaders: HeadersInit = {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${newToken}`,
            };
            
            response = await fetch('/api/profile', {
              method: 'PUT',
              headers: newHeaders,
              body: JSON.stringify({
                username: formData.username || null,
                avatar_url: avatarUrl || null,
              }),
            });
          } else {
            throw new Error('Failed to get new token after refresh');
          }
        } catch {
          throw new Error('Your session has expired. Please sign in again.');
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      
      // Update original form data to match saved data
      const savedFormData = {
        username: updatedProfile.username || '',
        avatarUrl: updatedProfile.avatar_url || '',
      };
      setFormData(savedFormData);
      setOriginalFormData(savedFormData);
      
      // Clear avatar upload state
      setAvatarFile(null);
      setAvatarPreview(null);
      
      // Exit edit mode after successful save
      setIsEditing(false);
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('profile-updated'));
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Restore original form data
    setFormData(originalFormData);
    setAvatarFile(null);
    setAvatarPreview(null);
    setIsEditing(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPEG, PNG, GIF, or WebP image.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setAvatarFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!authUser?.id) {
      throw new Error('User ID is required');
    }

    try {
      setIsUploadingAvatar(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', authUser.id);

      const response = await fetch('/api/profile/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Use message if available, otherwise use error, include details if available
        let errorMessage = errorData.message || errorData.error || 'Failed to upload avatar';
        if (errorData.details) {
          errorMessage += `: ${errorData.details}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      throw error;
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-bitcoin-orange" />
      </div>
    );
  }

  const username = profile?.username || authUser?.email?.split('@')[0] || 'User';
  const initials = username
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Upload a profile picture to personalize your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0">
            <div className="flex flex-col items-center space-y-4 m-4">
              <Avatar className="h-24 w-24">
                <AvatarImage 
                  src={
                    avatarPreview || 
                    (isEditing ? (formData.avatarUrl || profile?.avatar_url || '') : (profile?.avatar_url || formData.avatarUrl || ''))
                  } 
                  alt={username} 
                />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-bitcoin-orange to-bitcoin-gold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="relative">
                  <label
                    htmlFor="avatar-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-bitcoin-orange via-orange-600 to-bitcoin-orange hover:from-orange-400 hover:via-orange-500 hover:to-orange-400 rounded-lg transition-all"
                  >
                    {isUploadingAvatar ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Upload Image
                      </>
                    )}
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={isUploadingAvatar}
                  />
                </div>
              )}
              <div className="text-center">
                <p className="text-sm font-medium">
                  {isEditing ? (formData.username || username) : username}
                </p>
                <p className="text-xs text-muted-foreground">{profile?.email || authUser?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your personal information and account details</CardDescription>
              </div>
              {!isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleEdit}
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email || authUser?.email || ''}
                    disabled
                    className="pl-10 bg-muted/50 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    disabled={!isEditing}
                    className="pl-10 bg-muted/50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Wallet Address (Read-only) */}
              {profile?.primary_wallet_address && (
                <div className="space-y-2">
                  <Label htmlFor="wallet">Wallet Address</Label>
                  <Input
                    id="wallet"
                    type="text"
                    value={profile.primary_wallet_address}
                    disabled
                    className="bg-muted/50 cursor-not-allowed font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Network: {profile.primary_wallet_network || 'mainnet'}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-gradient-to-r from-bitcoin-orange via-orange-600 to-bitcoin-orange hover:from-orange-400 hover:via-orange-500 hover:to-orange-400 text-white"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

