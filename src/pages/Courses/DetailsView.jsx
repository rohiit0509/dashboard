import React from 'react';

const DetailsView = ({ subSubtopic }) => {
    if (!subSubtopic) return <div>Select a sub-subtopic to view details.</div>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold">{subSubtopic.name}</h2>
            <div className="mt-2">
                {/* Render the description as raw HTML */}
                <div
                    dangerouslySetInnerHTML={{ __html: subSubtopic.description }}
                />
            </div>
        </div>
    );
};

export default DetailsView;
