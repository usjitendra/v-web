// components/ImageUpload.jsx
import { useState } from 'react';
import url_prefix from "../../data/variable";

const ImageUpload = ({
    onImageUpload,
    currentImage,
    folder = 'general',
    maxSize = 5, // in MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    fieldName = 'image' // New prop to specify the field name
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [previewUrl, setPreviewUrl] = useState(currentImage || '');

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file type
        if (!allowedTypes.includes(file.type)) {
            setUploadError(`Please select a valid image file (${allowedTypes.join(', ')})`);
            return;
        }

        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
            setUploadError(`Image must be less than ${maxSize}MB`);
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);

        // Upload to server
        await uploadImage(file);
    };

    const uploadImage = async (file) => {
        setIsUploading(true);
        setUploadError('');

        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('adminToken');
            const url = folder
                ? `http://localhost:6003/api/upload/${folder}`
                : url_prefix + '/api/upload';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            // Check if response is OK before trying to parse JSON
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error response:', errorText);
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            // Try to parse response as JSON
            let result;
            try {
                result = await response.json();
            } catch (jsonError) {
                console.error('JSON parse error:', jsonError);
                throw new Error('Invalid response from server');
            }

            if (result.success) {
                onImageUpload(result.imageUrl);
            } else {
                setUploadError(result.error || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Upload error:', error);
            setUploadError(error.message || 'Network error. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setPreviewUrl('');
        onImageUpload('');
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {fieldName === 'icon' ? 'Icon' : 'Image'}
            </label>

            {/* Image preview */}
            {previewUrl && (
                <div className="mb-3 relative">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-40 w-40 object-cover rounded-md border"
                    />
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1"
                        aria-label="Remove image"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* File input */}
            <div className="flex items-center">
                <label className="flex flex-col items-center px-4 py-2 bg-white text-blue-500 rounded-lg border border-blue-500 cursor-pointer hover:bg-blue-50">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="mt-1 text-sm">{isUploading ? 'Uploading...' : 'Choose File'}</span>
                    <input
                        type="file"
                        className="hidden"
                        accept={allowedTypes.join(',')}
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                </label>

                {isUploading && (
                    <div className="ml-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    </div>
                )}
            </div>

            {/* Help text */}
            <p className="mt-1 text-xs text-gray-500">
                Max file size: {maxSize}MB. Supported formats: {allowedTypes.map(t => t.split('/')[1]).join(', ')}.
            </p>

            {/* Error message */}
            {uploadError && (
                <p className="mt-1 text-xs text-red-500">{uploadError}</p>
            )}

            {/* Hidden input to store the image URL */}
            <input
                type="hidden"
                name={fieldName}
                value={previewUrl}
            />
        </div>
    );
};

export default ImageUpload;