import React from 'react';
import './Quiz.css';

const Question = ({ question, options, selectedOption, onOptionChange, multipleAnswer }) => {
  return (
    <div>
      <h2 className="mb-[53px]">{question}</h2>
      <div className="space-y-[16px]">
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center custom-radio px-[20px] py-[14px] border-[1px] border-[#EDEDED] rounded-[10px] shadow-md text-[20px] font-normal"
            onClick={() => onOptionChange(index)}
          >
              <input
                type="radio"
                name="option"
                className="mr-2 rounded-none"
                checked={selectedOption === index}
                onChange={() => onOptionChange(index)}
              />
            <label className='text-[20px] font-normal'>
              {typeof option === 'object' ? option.text : option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;
