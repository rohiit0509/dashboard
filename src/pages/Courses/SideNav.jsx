import React, { useState } from 'react';

const SideNav = ({ topics, onTopicSelect, onSubtopicSelect, onSubSubtopicSelect }) => {
    const [expandedTopicIndex, setExpandedTopicIndex] = useState(null);
    const [expandedSubtopicIndex, setExpandedSubtopicIndex] = useState(null);

    const handleTopicClick = (index) => {
        setExpandedTopicIndex(expandedTopicIndex === index ? null : index);
        onTopicSelect(index);
    };

    const handleSubtopicClick = (topicIndex, subtopicIndex) => {
        setExpandedSubtopicIndex(expandedSubtopicIndex === subtopicIndex ? null : subtopicIndex);
        onSubtopicSelect(topicIndex, subtopicIndex);
    };

    const handleSubSubtopicClick = (topicIndex, subtopicIndex, subSubtopicIndex) => {
        onSubSubtopicSelect(topicIndex, subtopicIndex, subSubtopicIndex);
    };

    return (
        <div className="w-[14vw] bg-white px-[18px] py-[16px]">
            <ul>
                {topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="mb-4">
                        <button 
                            onClick={() => handleTopicClick(topicIndex)} 
                            className="flex items-center justify-between font-semibold text-[16px] text-[#2D3748]"
                        >
                            {topic.name}
                            <svg
                                className={`w-4 h-4 ml-2 transform ${expandedTopicIndex === topicIndex ? 'rotate-180' : 'rotate-0'} transition-transform duration-200`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                ></path>
                            </svg>
                        </button>
                        {expandedTopicIndex === topicIndex && (
                            <ul className="ml-4 mt-2">
                                {topic.subtopics.map((subtopic, subtopicIndex) => (
                                    <li key={subtopicIndex} className="mb-2">
                                        <button 
                                            onClick={() => handleSubtopicClick(topicIndex, subtopicIndex)} 
                                            className="flex items-center justify-between text-[12px] text-[#2D3748] hover:underline"
                                        >
                                            {subtopic.name}
                                            <svg
                                                className={`w-4 h-4 ml-2 transform ${expandedSubtopicIndex === subtopicIndex ? 'rotate-180' : 'rotate-0'} transition-transform duration-200`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M19 9l-7 7-7-7"
                                                ></path>
                                            </svg>
                                        </button>
                                        {expandedSubtopicIndex === subtopicIndex && (
                                            <ul className="ml-4 mt-2">
                                                {subtopic.subSubtopics.map((subSubtopic, subSubtopicIndex) => (
                                                    <li key={subSubtopicIndex}>
                                                        <button 
                                                            onClick={() => handleSubSubtopicClick(topicIndex, subtopicIndex, subSubtopicIndex)} 
                                                            className="text-[12px] text-[#2D3748] hover:underline"
                                                        >
                                                            {subSubtopic.name}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SideNav;
