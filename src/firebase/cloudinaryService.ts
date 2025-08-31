export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  width?: number;
  height?: number;
}

export const uploadResumeToCloudinary = async (file: File): Promise<CloudinaryUploadResponse> => {
  try {
    // Create FormData for the upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'resumefile');
    formData.append('cloud_name', 'daz8dkjos');

    // Use 'auto' for all file types to ensure proper browser handling
    // This allows PDFs to be viewed directly in the browser
    const resourceType = 'auto';

    // Upload to Cloudinary with auto resource type
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/daz8dkjos/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result: CloudinaryUploadResponse = await response.json();
    
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload resume to Cloudinary');
  }
};
