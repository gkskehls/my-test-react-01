// src/components/library/SongCard.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Song } from '../../songs';
import './SongCard.css';

interface SongCardProps {
    song: Song;
    isActive: boolean; // 현재 선택된 곡인지 여부를 나타내는 prop
    onSelect: () => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, isActive, onSelect }) => {
  const { t } = useTranslation();
  // [추가] 모바일 환경에서 카드의 확장 상태를 관리하기 위한 상태
  const [isExpanded, setIsExpanded] = useState(false);

  // [추가] 정보 아이콘 클릭 핸들러. 이벤트 버블링을 막아 카드 선택이 동시에 일어나는 것을 방지합니다.
  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(prev => !prev);
  };

  // [수정] isActive와 isExpanded 상태에 따라 클래스를 동적으로 추가합니다.
  const cardClassName = `song-card ${isActive ? 'active' : ''} ${isExpanded ? 'is-expanded' : ''}`;

  return (
    <div className={cardClassName} onClick={onSelect}>
      <div className="song-card-main">
        {/* [추가] title 속성을 추가하여 말줄임표로 잘린 전체 제목을 툴팁으로 보여줍니다. */}
        <div className="song-card-title" title={t(song.titleKey)}>{t(song.titleKey)}</div>
        <button className="card-expander" onClick={handleToggleExpand} aria-label={isExpanded ? 'Collapse' : 'Expand'}>
          <span className="chevron" />
        </button>
      </div>
      <div className="song-card-tags"><span className="tag tag-category">{t(song.categoryKey)}</span><span className="tag tag-difficulty">{t(song.difficultyKey)}</span></div>
    </div>
  );
};

export default SongCard;