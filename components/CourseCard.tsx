import React from 'react';
import { CourseRecommendation } from '../types';
import { Calendar, Building2, MapPin, Banknote, ScrollText, ExternalLink, GraduationCap } from 'lucide-react';

interface CourseCardProps {
  course: CourseRecommendation;
  index: number;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, index }) => {
  // Use a deterministic placeholder based on index
  const imageId = 40 + index; 

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6 hover:shadow-md transition-shadow duration-300">
      {/* Header Image Area */}
      <div className="h-32 w-full relative">
        <img 
          src={`https://picsum.photos/id/${imageId}/800/400`} 
          alt="University Campus" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-4 text-white">
          <div className="flex items-center gap-1.5 text-xs font-medium opacity-90 mb-0.5">
            <Building2 size={12} />
            <span>{course.university}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs opacity-75">
            <MapPin size={12} />
            <span>{course.location}</span>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight flex items-start gap-2">
          <GraduationCap className="shrink-0 mt-1 text-indigo-600" size={20} />
          {course.courseName}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Eligibility Section */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs mb-1">
              <ScrollText size={14} className="text-indigo-500" />
              Eligibility
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {course.eligibility}
            </p>
          </div>

          {/* Fees Section */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs mb-1">
              <Banknote size={14} className="text-green-600" />
              Est. Fees
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {course.fees}
            </p>
          </div>
        </div>

        {/* Schedule Strip */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 bg-orange-50 text-orange-800 px-3 py-2 rounded-lg border border-orange-100">
          <Calendar size={14} />
          <span className="font-medium">Intakes/Schedule:</span>
          <span>{course.schedule}</span>
        </div>

        <p className="text-sm text-slate-600 italic mb-4 border-l-2 border-indigo-200 pl-3">
          "{course.matchReason}"
        </p>

        <button className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors">
          View Program Details <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
};