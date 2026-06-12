import { FormProvider } from 'react-hook-form';
import { ASSETS } from '@/assets';
import InputField from '@/components/common/InputField';
import SelectField from '@/components/common/SelectField';
import { Modal } from '@/components/common/Modal';
import { THEME } from '@/constants/config';
import { Calendar, Smile } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import ImageInputField from '@/components/common/ImageInputField';
import { getLocalFile } from '@/utils/file.js';
import { namePattern } from '@/constants/pattern';
import { useCreateChild, useUpdateChild } from '@/hooks/child';
import { useGetUser } from '@/hooks/user';

export const ProfileModal = ({ onClose, mode, initialData }) => {
  const form = useForm({
    defaultValues: {
      name: '',
      age: '',
      gender: '',
      photo: '',
    },
  });

  const useMutation = useRef(mode === 'ADD' ? useCreateChild : useUpdateChild);

  const childMutation = useMutation.current();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty, dirtyFields },
  } = form;

  const photoFileInput = watch('photo');

  useEffect(() => {
    if (mode === 'EDIT') {
      reset({
        name: initialData.name,
        age: initialData.age,
        gender: initialData.gender,
        photo: '',
      });
    }
  }, [initialData, mode, reset]);

  useEffect(() => {
    if (!photoFileInput && !initialData?.photo)
      getLocalFile(ASSETS.childAvatars[0]).then((fileList) => setValue('photo', fileList, { shouldDirty: true }));
  }, [photoFileInput]);

  async function handleSelectPhoto(url) {
    const fileList = await getLocalFile(url);

    setValue('photo', fileList, { shouldDirty: true });

    return fileList;
  }

  const onSubmit = async (data) => {
    const changedData = Object.keys(dirtyFields).reduce(
      (acc, updatedField) => ({ ...acc, [updatedField]: data[updatedField] }),
      {},
    );

    if (changedData.photo?.length) changedData.photo = changedData.photo[0];

    const formData = new FormData();

    for (const k in changedData) formData.append(k, changedData[k]);

    const requestData = mode === 'ADD' ? formData : { newData: formData, id: initialData.id };

    childMutation
      .mutateAsync(requestData)
      .then((res) => onClose())
      .catch((err) => {});
  };

  return (
    <FormProvider {...form}>
      <Modal onClose={() => !childMutation.isPending && onClose()}>
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
            {mode === 'ADD' ? 'Add Child' : 'Edit Profile'}
          </h2>

          <form className="space-y-4 mt-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-center justify-center mb-6">
              <ImageInputField initialPhoto={`${import.meta.env.VITE_IMG_BASE_URL}/${initialData?.photo}`} />

              <div className="flex gap-1.5 justify-center w-full">
                {ASSETS.childAvatars.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={childMutation.isPending}
                    onClick={() => handleSelectPhoto(url)}
                    className={`w-12 h-12 rounded-full border-2 transition-all border-transparent hover:scale-105 opacity-70 hover:opacity-100 ${childMutation.isPending ? 'cursor-not-allowed' : ''}`}
                  >
                    <img src={url} alt={`Icon ${i}`} className="w-full h-full rounded-full object-cover bg-gray-50" />
                  </button>
                ))}
              </div>
            </div>

            <InputField
              {...register('name', {
                required: 'Required',
                pattern: {
                  value: namePattern.pattern,
                  message: namePattern.description,
                },
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
              disabled={childMutation.isPending}
              placeholder="Child's Nickname"
              type="text"
              icon={Smile}
              error={errors.name?.message}
            />

            <div className="grid grid-cols-2 gap-3">
              <InputField
                {...register('age', {
                  required: 'Required',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Age must be valid' },
                  max: { value: 12, message: 'Age must be under 12' },
                })}
                disabled={childMutation.isPending}
                placeholder="Age"
                type="number"
                icon={Calendar}
                error={errors.age?.message}
              />
              <SelectField
                {...register('gender', { required: 'Requirede' })}
                disabled={childMutation.isPending}
                label="Gender"
                options={[
                  { value: 'M', label: 'Male' },
                  { value: 'F', label: 'Female' },
                ]}
                error={errors.gender?.message}
              />
            </div>

            <button
              type="submit"
              disabled={childMutation.isPending || !isDirty}
              className={`w-full mt-6 ${THEME.primaryYellow} ${THEME.textBlack} font-bold py-4 px-4 rounded-full ${childMutation.isPending ? 'opacity-70 cursor-not-allowed' : THEME.primaryYellowHover} transition-colors text-lg flex justify-center items-center gap-2`}
            >
              {childMutation.isPending && (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              )}
              {childMutation.isPending ? 'Processing...' : mode === 'ADD' ? 'Create Profile' : 'Save Changes'}
            </button>
          </form>
        </div>
      </Modal>
    </FormProvider>
  );
};
