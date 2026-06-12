import React, { useState, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Camera } from 'lucide-react';
import { THEME } from '@/constants/config';

// Added maxSizeInMB prop with a default of 2
const ImageInputField = ({ initialPhoto, maxSizeInMB = 2 }) => {
  // Extracted 'errors' from formState to show the validation message
  const {
    register,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useFormContext();

  console.log(initialPhoto);

  const [imgURL, setImgURL] = useState(initialPhoto);
  const fileInputRef = useRef(null);
  let photoFile = watch('photo');
  const prevPhotoFile = useRef(photoFile);

  useEffect(() => {
    if (photoFile && photoFile.length > 0) {
      prevPhotoFile.current = Array.from(photoFile);
      const file = photoFile[0];
      const objectUrl = URL.createObjectURL(file);
      setImgURL(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (photoFile && !photoFile.length) {
      // Preserve Previous File Input When The User Cancels OS File Form
      setValue('photo', prevPhotoFile.current);
      return;
    }

    setImgURL(initialPhoto);
  }, [photoFile, initialPhoto]);

  const handleRemove = (e) => {
    e.stopPropagation();

    setValue('photo', '', { shouldDirty: true });
  };

  const isPhotoSelected = dirtyFields.photo;

  return (
    <div className="flex flex-col items-center sm:flex-row gap-8 pb-8 border-b border-slate-50">
      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
        <div className={`w-32 h-32 rounded-full border-4 ${THEME.primaryYellowBorder} p-1 overflow-hidden bg-slate-50`}>
          <img src={imgURL} alt="Profile" className="w-full h-full object-cover rounded-full" />
        </div>

        {/* Camera Icon (Upload) */}
        <div
          className={`absolute bottom-1 right-1 ${THEME.primaryYellow} p-2 rounded-full shadow-lg border-2 border-white group-hover:scale-110 transition-transform`}
        >
          <Camera className="w-4 h-4 text-slate-900" />
        </div>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          // Added validation logic here
          {...register('photo', {
            validate: {
              checkSize: (value) => {
                if (!value || value.length === 0) return true; // Pass if empty
                const file = value[0];
                const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
                return file.size <= maxSizeInBytes || `Image must be smaller than ${maxSizeInMB}MB`;
              },
            },
          })}
          ref={(e) => {
            register('photo').ref(e);
            fileInputRef.current = e;
          }}
        />
      </div>

      <div className="text-center sm:text-left">
        <h3 className="font-bold text-slate-900">Profile Picture</h3>
        <p className="text-sm text-slate-500 mb-3">
          {/* Made the text dynamic based on the prop */}
          JPG, GIF or PNG. Max size of {maxSizeInMB}MB
        </p>
        <div className={`flex flex-col sm:block ${!isPhotoSelected && 'items-center'} gap-2`}>
          <div className={`flex ${!isPhotoSelected && 'justify-center sm:justify-normal'} gap-2`}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-bold py-2 px-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Upload New Photo
            </button>

            {isPhotoSelected && (
              <button
                type="button"
                onClick={handleRemove}
                className="text-xs font-bold py-2 px-4 rounded-full text-red-500 hover:bg-red-50 transition-colors"
              >
                Remove
              </button>
            )}
          </div>

          {/* Added Error Message Display */}
          {errors.photo && <p className="text-xs text-red-500 font-medium mt-2">{errors.photo.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ImageInputField;
