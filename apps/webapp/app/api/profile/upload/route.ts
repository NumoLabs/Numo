import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSession } from '@/lib/auth/session';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Use service role key for server-side operations
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

/**
 * POST /api/profile/upload
 * Upload avatar image to Supabase Storage
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate before anything else, so an anonymous caller learns nothing
    // about how the server is configured.
    //
    // Storage costs money and never expires: without a verified session anyone
    // could fill the bucket with 5 MB files indefinitely.
    const session = getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required. Sign in with your wallet first.' },
        { status: 401 }
      );
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Identifier comes from the session, never from the request body: it is what
    // scopes the uploaded object to its owner.
    const userId = session.address;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Sanitize userId for use in filename (remove/replace invalid characters)
    // Supabase Storage doesn't allow: |, :, /, \, ?, *, ", <, >, and some other special chars
    const sanitizedUserId = userId
      .replace(/[|:/?*"<>]/g, '_')  // Replace invalid characters with underscore
      .replace(/\s+/g, '_')           // Replace spaces with underscore
      .replace(/_{2,}/g, '_')         // Replace multiple underscores with single
      .replace(/^_+|_+$/g, '');       // Remove leading/trailing underscores
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8); // Add random string for uniqueness
    const fileName = `${sanitizedUserId}-${timestamp}-${randomStr}.${fileExt}`;
    const filePath = fileName;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // The bucket is infrastructure, not something to provision per request:
    // listBuckets/createBucket added two round-trips to every upload and needed
    // elevated privileges. Create it once (see .env.example / README) instead.
    const bucketName = 'avatars';

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      // Storage errors carry bucket names, policy text and provider internals.
      // Keep them in the server log; hand the client a flat message.
      console.error('Error uploading avatar:', uploadError);

      const errorMessage = uploadError.message || '';

      if (/permission|forbidden|403/i.test(errorMessage)) {
        return NextResponse.json(
          { error: 'Permission denied' },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return NextResponse.json({
      url: urlData.publicUrl,
      path: filePath
    });
  } catch (error) {
    console.error('Error in upload route:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

