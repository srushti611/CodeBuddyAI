import React, { useState } from 'react';

function App() {
  const [inputs, setInputs] = useState({ skillLevel: 'Absolute Beginner', language: 'Python', goal: '' });
  const [course, setCourse] = useState(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateCourse = async (e) => {
    e.preventDefault();
    if (!inputs.goal.trim()) return alert("Please clarify your custom milestone learning goal!");
    
    setLoading(true);
    setFeedback('');
    try {
      const res = await fetch('https://codebuddy-backend-s9hc.onrender.com/api/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });
      const data = await res.json();
      setCourse(data);
      setActiveModuleIndex(0);
      setUserCode('');
    } catch (err) {
      alert("Error setting up connection to the syllabus matrix engine.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!userCode.trim()) return alert("Type or paste your answer code string first!");
    setLoading(true);
    try {
     const res = await fetch('https://codebuddy-backend-s9hc.onrender.com/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeInput: userCode, moduleId: course.modules[activeModuleIndex].id })
      });
      const data = await res.json();
      setFeedback(data.feedback);
    } catch (err) {
      setFeedback("Failed to extract evaluation analytics metrics from verification engines.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Segoe UI, sans-serif', maxWidth: '1200px', margin: '0 auto', color: '#2c3e50' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2980b9' }}>🎓 Adaptive StudyBuddy AI Academy</h1>
        <p style={{ color: '#7f8c8d' }}>Generative Course Syllabus Architecture backed by Contextual RAG Memory Arrays</p>
      </header>

      {!course ? (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '30px', border: '1px solid #e0e0e0', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h3>Configure Your Personalized Course Setup</h3>
          <form onSubmit={handleGenerateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Current Skill Level:</label>
              <select value={inputs.skillLevel} onChange={(e) => setInputs({...inputs, skillLevel: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px' }}>
                <option>Absolute Beginner</option>
                <option>Intermediate Dev</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Target Language Ecosystem:</label>
              <select value={inputs.language} onChange={(e) => setInputs({...inputs, language: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px' }}>
                <option>Python</option>
                <option>JavaScript</option>
                <option>C++</option>
                <option>Java</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>What practical goal do you want to achieve?</label>
              <textarea placeholder="e.g., I want to build an automated Instagram DM auto-reply system for content creators." value={inputs.goal} onChange={(e) => setInputs({...inputs, goal: e.target.value})} rows="3" style={{ width: '100%', padding: '10px', borderRadius: '6px', fontFamily: 'inherit' }} />
            </div>
            <button type="submit" disabled={loading} style={{ background: '#2980b9', color: 'white', padding: '14px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              {loading ? 'Compiling Custom Learning Modules via AI...' : 'Generate My RAG Course Layout'}
            </button>
          </form>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            {course.modules.map((mod, index) => (
              <button key={mod.id} onClick={() => { setActiveModuleIndex(index); setFeedback(''); setUserCode(''); }} style={{ padding: '12px 20px', flex: 1, border: 'none', background: activeModuleIndex === index ? '#2980b9' : '#ecf0f1', color: activeModuleIndex === index ? 'white' : '#34495e', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }}>
                Module {index + 1}: {mod.title}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '30px' }}>
            {/* Left Box: Lecture Context Reading Panel */}
            <div style={{ flex: 1, background: '#fcfcfc', border: '1px solid #e0e0e0', padding: '25px', borderRadius: '8px', maxHeight: '550px', overflowY: 'auto' }}>
              <h2 style={{ color: '#2980b9' }}>{course.courseTitle}</h2>
              <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>{course.modules[activeModuleIndex].title}</h3>
              <p style={{ whiteSpace: 'pre-line', lineHeight: '1.7', color: '#34495e' }}>{course.modules[activeModuleIndex].content}</p>
            </div>

            {/* Right Box: Code Workspace Coding Lab Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ background: '#2c3e50', color: '#ecf0f1', padding: '20px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#f1c40f' }}>📝 Interactive Module Milestone Challenge:</h4>
                <p style={{ margin: '0', lineHeight: '1.5' }}>{course.modules[activeModuleIndex].quizQuestion}</p>
              </div>

              <textarea rows="10" placeholder="Type your source code solution compiler metrics here..." value={userCode} onChange={(e) => setUserCode(e.target.value)} style={{ width: '100%', fontFamily: 'Courier New, monospace', fontSize: '14px', padding: '15px', borderRadius: '6px', border: '1px solid #bdc3c7', boxSizing: 'border-box' }} />
              
              <button onClick={handleVerifyCode} disabled={loading} style={{ background: '#27ae60', color: 'white', padding: '15px', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                {loading ? 'Evaluating via Contextual RAG Memory Arrays...' : 'Submit Code for Verification Analysis'}
              </button>

              {feedback && (
                <div style={{ padding: '20px', background: '#edf7ed', borderLeft: '6px solid #27ae60', borderRadius: '4px', marginTop: '10px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#1e4620' }}>Grading Assistant Feedback:</h4>
                  <p style={{ margin: '0', whiteSpace: 'pre-line', lineHeight: '1.6' }}>{feedback}</p>
                </div>
              )}
            </div>
          </div>
          <button onClick={() => setCourse(null)} style={{ marginTop: '30px', padding: '10px 20px', background: '#7f8c8d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>← Build Another Different Course</button>
        </div>
      )}
    </div>
  );
}

export default App;