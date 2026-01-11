/**
 * SectionView - Container for section's level map and game play
 * Manages navigation between level selection and playing
 */

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import LevelMap from './LevelMap';
import './SectionView.css';

const SectionView = ({
  section,
  progressData,
  onBack,
  onLevelStart,
  children,
  showMap = true
}) => {
  const sectionProgress = progressData.sections[section.id];

  return (
    <div className="section-view">
      {/* Header */}
      <div className="section-view-header" style={{ backgroundColor: section.color }}>
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <div className="section-view-title">
          <span className="section-view-icon">{section.icon}</span>
          <div>
            <h1>{section.title}</h1>
            <p>{section.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="section-view-content">
        {showMap ? (
          <LevelMap
            section={section}
            levelsData={sectionProgress?.levelsData || {}}
            currentLevel={sectionProgress?.currentLevel || 1}
            totalLevels={section.totalLevels}
            onLevelSelect={onLevelStart}
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default SectionView;
