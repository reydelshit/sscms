import React, { useRef } from 'react';
import { SchoolDepartment } from '@/data/department';
interface Department {
  course_name: string;
}

interface SchoolDepartmentsProps {
  Dep: string;
}

const SchoolDepartments: React.FC<SchoolDepartmentsProps> = ({ Dep }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -300, // Adjust scroll amount
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 300, // Adjust scroll amount
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-300 p-2"
      >
        &#8592;
      </button>

      {/* Scrollable container */}

      {/* Right arrow */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-300 p-2"
      >
        &#8594;
      </button>
    </div>
  );
};

export default SchoolDepartments;
