import React, { useState, useEffect } from 'react';
import './home.css';
import homeContent from './homeContent.json'; // Import the JSON content

const Home = () => {
  const [content, setContent] = useState(null);

  // Load the content from the JSON file
  useEffect(() => {
    setContent(homeContent);
  }, []);

  if (!content) {
    return <div>Loading...</div>; // Show loading state while the content is being loaded
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">{content.title}</h1>
        <p className="home-subtitle">{content.subtitle}</p>
      </header>

      
      <main className="home-main">
        {content.sections.map((section) => (
          <section key={section.id} className="home-content">
            <h2>{section.title}</h2>
            <p>{section.content}</p>
            {section.list && (
              <ul>
                {section.list.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </main>
    </div>
  );
};

export default Home;
