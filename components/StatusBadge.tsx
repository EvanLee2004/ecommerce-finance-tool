import React from 'react';
import { ReconStatus } from '../types';

interface StatusBadgeProps {
  status: ReconStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgColor = 'bg-slate-100';
  let textColor = 'text-slate-800';
  let borderColor = 'border-slate-200';

  switch (status) {
    case ReconStatus.NORMAL:
      bgColor = 'bg-emerald-50';
      textColor = 'text-emerald-700';
      borderColor = 'border-emerald-200';
      break;
    case ReconStatus.MISMATCH:
      bgColor = 'bg-amber-50';
      textColor = 'text-amber-700';
      borderColor = 'border-amber-200';
      break;
    case ReconStatus.MISSING_PAYMENT:
      bgColor = 'bg-rose-50';
      textColor = 'text-rose-700';
      borderColor = 'border-rose-200';
      break;
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${bgColor} ${textColor} ${borderColor}`}>
      {status}
    </span>
  );
};