// 'use client';
import clsx from 'clsx';
import React from 'react';
import { BsFillCaretDownFill } from 'react-icons/bs';

interface IDropdown {
  value: string;
  items: string[] | null;
  action: (item: string) => void;
}

export const Dropdown = ({ value, items, action }: IDropdown) => {
  const handleClick = (item: string) => {
    action(item);

    const activeEl = document.activeElement as HTMLElement;
    activeEl && activeEl.blur();
  };

  return (
    <div className='dropdown' data-cy='dropdown'>
      <div
        tabIndex={0}
        role='button'
        className={clsx(
          { 'pointer-events-none opacity-50': items && items.length <= 1 },
          'btn btn-ghost btn-sm rounded-btn underline',
        )}
      >
        {items ? (
          <>
            {value} <BsFillCaretDownFill />
          </>
        ) : (
          <span className='loading loading-spinner loading-sm text-primary'></span>
        )}
      </div>
      <ul
        tabIndex={0}
        className='menu dropdown-content rounded-box bg-base-100 z-[1] mt-2 max-h-64 w-52 flex-nowrap overflow-scroll p-2 shadow lg:max-h-96'
      >
        {items?.map((item) => (
          <li key={item} data-cy='dropdown-item'>
            <a onClick={() => handleClick(item)}>{item}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};
