import React, {useState} from "react";
import '.app1.css';
function App() {
    const [inShown, setIsShown] = useState(false);
    const toggleMessage = () => {
        setIsShown(prevState => !prevState);
    };

    return (
        <div className="App">
        <button onClick={toggleMessage}>{isShown ? 'Hide' : 'Show'}</button>
            {isShown && <p>Welcome to React!</p>}
        </div>
        );
}