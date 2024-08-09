// src/components/QuestionNavigation.js

import React from "react";

const QuestionNavigation = ({
  totalQuestions,
  currentQuestion,
  onSelectQuestion,
  attempted,
  skipped
}) => {
  return (
    <div className="px-[28px] py-[24px] border-[1.5px] border-[#EDEDED] shadow-md rounded-[10px] h-fit flex flex-col gap-[62px] w-[385px]">
      <div>
        <h3 className="text-[16px] mb-4">Section</h3>
        <div className="flex flex-col gap-[19px]">
          <div className="px-[18px] py-[11px] rounded-lg border-[1px] border-[#A4A4A4] bg-[#EDEDED] w-fit">
            MCQ Section
          </div>
          <div className="px-[18px] py-[11px] rounded-lg border-[1px] border-[#A4A4A4] w-fit">
            Practical Section
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-[16px] mb-4">All Questions</h3>
        <div className="flex gap-[20px] w-[267px] flex-wrap">
          {Array.from({ length: totalQuestions }).map((_, index) => (
            <button
              key={index}
              className={`border rounded text-[18px] w-[37.2px] h-[37.2px] ${
                skipped[index] ? "bg-[#FFC107]" : 
                attempted[index] ? "bg-[#C4ED2F]" : 
                "bg-white"
              } ${
                currentQuestion === index ? "bg-[#EDEDED] text-[#A4A4A4]" : ""
              }`}
              onClick={() => onSelectQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigation;
