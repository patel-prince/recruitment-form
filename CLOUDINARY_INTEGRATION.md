# Cloudinary Integration for Resume Storage

This document explains how the recruitment form now integrates with Cloudinary to store resume files securely.

## Overview

The application now uploads resume files to Cloudinary instead of just storing filenames. This provides:
- Secure cloud storage for resumes
- Direct access to resume files via Cloudinary URLs
- Better file management and organization

## Configuration

The Cloudinary integration is configured with the following details:
- **Cloud Name**: `daz8dkjos`
- **Upload Preset**: `resumefile`
- **API Endpoint**: `https://api.cloudinary.com/v1_1/daz8dkjos/auto/upload`
  - Uses `auto` resource type for optimal browser compatibility
  - PDFs can be viewed directly in the browser
  - Images are served with proper content types

## How It Works

### 1. Resume Upload Process
1. User selects a resume file (PDF, DOC, DOCX, JPG, PNG, GIF)
2. File is validated for type and size (max 5MB)
3. File is uploaded to Cloudinary using the `auto/upload` endpoint:
   - **All file types** are uploaded to the same endpoint for optimal browser compatibility
   - **PDFs** can be viewed directly in the browser
   - **Images** are served with proper content types
4. Cloudinary returns metadata including:
   - `public_id`: Unique identifier for the file
   - `secure_url`: HTTPS URL to access the file
   - `url`: HTTP URL to access the file
   - `format`: File format
   - `resource_type`: Resource type (auto-detected)
   - `bytes`: File size in bytes
   - `created_at`: Upload timestamp

### 2. Data Storage
- Resume file metadata is stored in the form state
- When the form is submitted, both the original file info and Cloudinary data are sent to Firebase
- Firebase stores the complete Cloudinary metadata for future reference
- **Resume URL is stored in Firebase** for direct access to the resume file

### 3. File Access
- Resumes can be accessed via the Cloudinary URLs stored in Firebase
- The `resumeUrl` field in Firebase contains the direct Cloudinary secure URL
- The `secure_url` provides HTTPS access to the resume files
- Files are organized by the upload preset and cloud name
- Users can click "View Resume" to directly access their uploaded resume

## Code Changes

### New Files
- `src/firebase/cloudinaryService.ts` - Handles file uploads to Cloudinary

### Modified Files
- `src/components/form-sections/ResumeUploadSection.tsx` - Updated to upload to Cloudinary
- `src/firebase/formService.ts` - Updated interface to include Cloudinary data
- `src/pages/FormPage.tsx` - Updated to handle Cloudinary data in form submission

## Usage

### For Users
1. Navigate to the Resume Upload step in the form
2. Drag and drop or click to select a resume file
3. The file will automatically upload to Cloudinary
4. Upload progress and success confirmation will be shown
5. The form will store the Cloudinary metadata for submission

### For Developers
The Cloudinary service provides a simple interface:

```typescript
import { uploadResumeToCloudinary } from '../firebase/cloudinaryService'

const result = await uploadResumeToCloudinary(file)
// result contains Cloudinary metadata
```

## Security Considerations

- Files are uploaded using an upload preset, which provides controlled access
- No API keys are exposed in the frontend code
- Files are stored in a dedicated cloud environment
- Access is controlled through Cloudinary's security settings

## Troubleshooting

### Common Issues
1. **Upload Fails**: Check if the upload preset is correctly configured
2. **File Size Errors**: Ensure files are under 5MB
3. **File Type Errors**: Only supported formats are allowed
4. **Network Errors**: Check internet connection and Cloudinary service status

### Debug Information
- Check browser console for detailed error messages
- Verify Cloudinary configuration in `cloudinaryService.ts`
- Ensure the upload preset `resumefile` exists in your Cloudinary account

## Future Enhancements

Potential improvements could include:
- File compression before upload
- Multiple file upload support
- File preview functionality
- Integration with other cloud storage providers
- Advanced file management features
