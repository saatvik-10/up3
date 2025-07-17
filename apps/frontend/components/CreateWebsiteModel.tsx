import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function CreateWebsiteModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: (url: string | null) => void;
}) {
  const [url, setUrl] = useState('');
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md'>
        <h2 className='text-xl font-semibold mb-4 dark:text-white'>
          Add New Website
        </h2>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            URL
          </label>
          <Input
            type='url'
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white'
            placeholder='https://example.com'
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className='flex justify-end space-x-3 mt-6'>
          <Button
            type='button'
            onClick={() => onClose(null)}
            className='px-4 py-2 text-sm font-medium hover-bg-white/20 rounded-md'
          >
            Cancel
          </Button>
          <Button
            type='submit'
            onClick={() => onClose(url)}
            className='px-4 py-2 text-sm font-medium bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 hover:from-violet-700 hover:via-blue-700 hover:to-cyan-700 text-white rounded-md'
          >
            Add Website
          </Button>
        </div>
      </div>
    </div>
  );
}
