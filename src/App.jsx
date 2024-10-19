import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [dark, changeTheme] = useState(true);
  const container=document.getElementsByClassName("container")[0];

  // Change body background color based on the theme
  useEffect(() => {
    container.className=dark?"container dark":"container white";
    // Cleanup function to reset the background color when the component unmounts
  }, [dark]);

  return (
    <>
      <div className="box">
        <div
          className={`outerbutton ${dark ? 'ta-l bg-grey' : 'ta-r bg-blue'} inline`}
          onClick={() => changeTheme(!dark)}
        >
          <div className="innerbutton" />
        </div>
        <h6>{dark ? 'Night Mode' : 'Day Mode'}</h6>
      </div>
    </>
  );
}

export default App;
