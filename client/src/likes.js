import React, { useState } from "react";

const Likes = ({ likeResults, userId }) => {
    const [isLiked, setIsLiked] = useState(false);

    const handleLike = () => {
        setIsLiked(!isLiked);
        likeResults(isLiked, userId);
    };

    return (
        <div>
            {isLiked ? (
                <span
                    style={{
                        fontSize: "2.50rem",
                        color: "#ff0000",
                        cursor: "pointer",
                    }}
                    onClick={handleLike}
                >
                    &hearts;
                </span>
            ) : (
                <span
                    style={{ fontSize: "2rem", cursor: "pointer" }}
                    onClick={handleLike}
                >
                    &#9825;
                </span>
            )}
        </div>
    );
};

export default Likes;
