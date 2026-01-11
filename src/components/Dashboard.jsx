/**
 * Dashboard - Home screen showing all learning sections
 * Inspired by Duolingo's home screen with section cards
 */

import React from 'react';
import { Flame, Trophy, Star } from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ sections, progressData, streak, onSectionSelect }) => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <span className="title-emoji">🎓</span>
          Apprends en t'amusant!
        </h1>
        <p className="dashboard-subtitle">Choisis une activité pour commencer</p>
      </div>

      {/* Streak Display */}
      <div className="streak-card">
        <div className="streak-icon">
          <Flame size={32} color="#FF6B35" fill={streak.current > 0 ? '#FF6B35' : 'none'} />
        </div>
        <div className="streak-info">
          <div className="streak-current">{streak.current} jour{streak.current !== 1 ? 's' : ''}</div>
          <div className="streak-label">Série actuelle</div>
        </div>
        {streak.longest > 0 && (
          <div className="streak-record">
            <Trophy size={20} color="#FFD700" />
            <span>Record: {streak.longest}</span>
          </div>
        )}
      </div>

      {/* Section Cards */}
      <div className="sections-grid">
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
              onClick={() => onSectionSelect(section.id)}
              style={{ borderTopColor: section.color }}
            >
              <div className="section-icon">{section.icon}</div>
              <div className="section-content">
                <h2 className="section-title">{section.title}</h2>
                <p className="section-subtitle">{section.subtitle}</p>

                {/* Progress Bar */}
                <div className="section-progress">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: section.color
                      }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    {completedLevels} / {section.totalLevels} niveaux
                  </div>
                </div>

                {/* Stars */}
                <div className="section-stars">
                  <Star size={16} fill="#FFD700" color="#FFD700" />
                  <span className="stars-count">
                    {totalStars} / {maxStars}
                  </span>
                </div>
              </div>

              {completedLevels === section.totalLevels && (
                <div className="section-completed">
                  <Trophy size={24} color="#FFD700" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add more sections prompt */}
      <div className="add-section-hint">
        <p>Plus d'activités bientôt disponibles! 🚀</p>
      </div>
    </div>
  );
};

export default Dashboard;
