import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';

const Card = ({ title, link }) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <Link to={link} className="btn">Go</Link>
    </div>
  );
};

export default Card;
