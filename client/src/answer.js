export default function Answer({ answer, changedText, index, submit }) {
    return (
        <div>
            <div className="singleAnswer">
                <h3>Your card</h3>
                <hr className="dividerTwo" />
                <h4
                    onClick={() => {
                        changedText(index);
                        submit(answer);
                    }}
                >
                    {answer}
                </h4>
            </div>
        </div>
    );
}
