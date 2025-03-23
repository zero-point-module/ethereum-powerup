import { useState } from 'react';
import { Button } from './button';
import { Check, Copy } from 'lucide-react';

interface CopyButtonProps {
  value: string;
  displayValue?: string;
  className?: string;
}

export function CopyButton({ value, displayValue, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const displayText = displayValue || 
    (value.length > 12 ? `${value.slice(0, 6)}...${value.slice(-4)}` : value);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 ${className}`}
    >
      {displayText}
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </Button>
  );
} 