'use client';

import { Item } from '@/types';
import { BaseButton, BaseButtonProps } from './BaseButton';

interface InstallButtonProps extends Omit<BaseButtonProps, 'label'> {
  selectedItem?: Item;
}

export function InstallButton({
  onClick,
  disabled = false,
  className = '',
  isLoading = false,
  tvState,
}: InstallButtonProps) {
  const getButtonLabel = () => {
    if (isLoading) return 'INSTALLING';
    return 'INSTALL';
  };

  const arrowIcon = (
    <span className="ml-1 inline-flex items-center justify-center arrow-bounce">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    </span>
  );

  return (
    <BaseButton
      label={getButtonLabel()}
      onClick={onClick}
      disabled={disabled}
      className={className}
      tvState={tvState}
      isLoading={isLoading}
      icon={arrowIcon}
    />
  );
}
