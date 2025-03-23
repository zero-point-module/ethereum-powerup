'use client';

import { Item } from '@/types';
import { BaseButton, BaseButtonProps } from './BaseButton';

interface UninstallButtonProps extends Omit<BaseButtonProps, 'label'> {
  selectedItem?: Item;
  isWorkbenchActive?: boolean;
  onWorkbenchClick?: () => void;
}

export function UninstallButton({
  onClick,
  disabled = false,
  className = '',
  isLoading = false,
  tvState,
  isWorkbenchActive = false,
  onWorkbenchClick,
}: UninstallButtonProps) {
  const getButtonLabel = () => {
    if (isLoading) return 'UNINSTALLING';
    if (isWorkbenchActive) return 'CLOSE WORKBENCH';

    return 'UNINSTALL';
  };

  const handleClick = () => {
    if (isWorkbenchActive && onWorkbenchClick) {
      onWorkbenchClick();
    } else {
      onClick();
    }
  };

  const xIcon = (
    <span className="ml-1 inline-flex items-center justify-center">
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
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </span>
  );

  return (
    <BaseButton
      label={getButtonLabel()}
      onClick={handleClick}
      disabled={disabled}
      className={className}
      tvState={tvState}
      isLoading={isLoading}
      icon={xIcon}
    />
  );
}
