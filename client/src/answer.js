export default function Answer({ answer, changedText, index, submit }) {
    return (
        <>
            <h3
                onClick={() => {
                    changedText(index);
                    submit(answer);
                }}
            >
                {answer}
            </h3>
        </>
    );
}
