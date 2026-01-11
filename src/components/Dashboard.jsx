/**
 * Dashboard - Minimalist home screen
 * Shows learning sections with clean, focused design
 */

import React from 'react';
import './Dashboard.css';

const Dashboard = ({ sections, progressData, streak, onSectionSelect }) => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="greeting">Bonjour 👋</h1>
        <p className="subtext">Continue ton apprentissage</p>

        <div className="streak-card">
          <div className="streak-icon">🔥</div>
          <div className="streak-text">
            <h3>{streak.current} jour{streak.current !== 1 ? 's' : ''}</h3>
            <p>Record: {streak.longest} jour{streak.longest !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <div className="sections">
        {sections.map((section) => {
          const progress = progressData.sections[section.id];
          const completedLevels = progress?.completedLevels?.length || 0;
          const percentage = (completedLevels / section.totalLevels) * 100;
          const totalStars = progress?.totalStars || 0;
          const maxStars = section.totalLevels * 3;

          return (
            <div
              key={section.id}
              className="section-card"
              style={{ '--section-color': section.color }}
              onClick={() => onSectionSelect(section.id)}
            >
              <div className="section-top">
                <div className="section-icon-box">{section.icon}</div>
                <div className="section-text">
                  <h3>{section.title}</h3>
                  <p>{section.subtitle}</p>
                </div>
              </div>

              <div className="progress-container">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
                </div>
              </div>

              <div className="section-meta">
                <span>Niveau {completedLevels + 1} / {section.totalLevels}</span>
                <span>⭐ {totalStars} / {maxStars}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
