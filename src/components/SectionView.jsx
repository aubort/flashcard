/**
 * SectionView - Minimalist section container
 * Shows level map with clean design
 */

import React from 'react';
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
      <div className="map-header" style={{ '--section-color': section.color }}>
        <button className="back-btn" onClick={onBack}>
          ← Retour
        </button>
        <div className="map-title">
          <h2>{section.icon} {section.title}</h2>
          <p>Choisis un niveau</p>
        </div>
      </div>

      {/* Content */}
      <div className="map-body">
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
