import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Goes back to the previous page
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.heading}>Unauthorized Access</h1>
        <p style={styles.message}>You do not have permission to access this page.</p>
        <button onClick={handleBackClick} style={styles.button}>Go Back</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width:'100vw',
    height: '100vh',
    backgroundColor: '#f4f4f4',
  },
  content: {
    textAlign: 'center',
    padding: '30px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '80%',
    maxWidth: '400px',
  },
  heading: {
    color: '#d9534f',
    fontSize: '24px',
    marginBottom: '15px',
  },
  message: {
    color: '#555',
    fontSize: '16px',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default UnauthorizedPage;
