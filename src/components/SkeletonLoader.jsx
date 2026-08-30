import React from 'react';

export const RequestCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-6 w-24 bg-slate-200 rounded-md"></div>
        <div className="h-5 w-16 bg-slate-200 rounded-full"></div>
      </div>

      <div className="space-y-2">
        <div className="h-5 w-3/4 bg-slate-200 rounded-lg"></div>
        <div className="h-3.5 w-1/2 bg-slate-200 rounded-md"></div>
      </div>

      <div className="space-y-2 pt-1">
        <div className="h-3.5 w-full bg-slate-200 rounded-md"></div>
        <div className="h-3.5 w-5/6 bg-slate-200 rounded-md"></div>
      </div>

      <div className="h-10 w-full bg-slate-100 rounded-xl"></div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="h-4 w-20 bg-slate-200 rounded"></div>
        <div className="h-8 w-28 bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  );
};

export const DashboardStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 animate-pulse flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0"></div>
          <div className="space-y-2 flex-grow">
            <div className="h-3 w-20 bg-slate-200 rounded"></div>
            <div className="h-6 w-12 bg-slate-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
