import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

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
      .replace(/[|:/\?*"<>]/g, '_')  // Replace invalid characters with underscore
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

    // Check if bucket exists, create if it doesn't
    const bucketName = 'avatars';
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (!listError) {
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        // Try to create the bucket
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
          fileSizeLimit: 5242880 // 5MB in bytes
        });
        
        if (createError) {
          console.error('Error creating bucket:', createError);
          // If bucket creation fails, provide detailed instructions
          return NextResponse.json(
            { 
              error: 'Storage bucket not configured',
              message: 'Please create an "avatars" bucket in Supabase Storage:\n1. Go to your Supabase project\n2. Navigate to Storage\n3. Create a new bucket named "avatars"\n4. Make it public\n5. Set allowed file types: image/jpeg, image/jpg, image/png, image/gif, image/webp\n6. Set max file size to 5MB',
              details: createError.message
            },
            { status: 500 }
          );
        }
      }
    }

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      console.error('Upload error message:', uploadError.message);
      console.error('Full upload error:', JSON.stringify(uploadError, Object.getOwnPropertyNames(uploadError)));
      
      const errorMessage = uploadError.message || 'Unknown error';
      
      // If bucket still doesn't exist after creation attempt
      if (errorMessage.includes('Bucket not found') || 
          errorMessage.includes('not found') ||
          errorMessage.includes('does not exist')) {
        return NextResponse.json(
          { 
            error: 'Storage bucket not configured',
            message: 'Please create an "avatars" bucket in Supabase Storage:\n1. Go to your Supabase project\n2. Navigate to Storage\n3. Create a new bucket named "avatars"\n4. Make it public\n5. Set allowed file types: image/jpeg, image/jpg, image/png, image/gif, image/webp\n6. Set max file size to 5MB',
            details: errorMessage
          },
          { status: 500 }
        );
      }
      
      // Check for permission errors
      if (errorMessage.includes('permission') || 
          errorMessage.includes('Forbidden') ||
          errorMessage.includes('403')) {
        return NextResponse.json(
          { 
            error: 'Permission denied',
            message: 'You do not have permission to upload to this bucket. Please check your Supabase Storage policies.',
            details: errorMessage
          },
          { status: 403 }
        );
      }
      
      // Check for file already exists
      if (errorMessage.includes('already exists') || 
          errorMessage.includes('duplicate')) {
        // Try again with upsert
        const { error: upsertError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, buffer, {
            contentType: file.type,
            upsert: true
          });
          
        if (upsertError) {
          return NextResponse.json(
            { 
              error: 'Failed to upload file',
              message: 'File upload failed even with overwrite enabled',
              details: upsertError.message || 'Unknown error'
            },
            { status: 500 }
          );
        }
        
        // Get public URL after successful upsert
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);
          
        return NextResponse.json({
          url: urlData.publicUrl,
          path: filePath
        });
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to upload file',
          message: uploadError.message || 'Unknown upload error',
          details: JSON.stringify(uploadError, Object.getOwnPropertyNames(uploadError))
        },
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
      { error: 'Failed to upload image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

