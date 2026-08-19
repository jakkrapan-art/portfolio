import React, { useEffect, useState } from 'react';
import '../css/project-detail-modal.css';

export interface ProjectDisplay {
  path: string;
  type: string; // 'image' | 'video'
}

export interface ProjectDetail {
  id: number;
  project_name: string;
  displays: ProjectDisplay[];
  play_url?: string;
  image?: { showing?: string; all?: string[] };
  description?: string;
  my_responsibility?: string[];
}

const ProjectDetailModal: React.FC<{
  visible: boolean;
  project: ProjectDetail | null;
  onClose: () => void;
}> = ({ visible, project, onClose }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setCurrent(0);
  }, [project]);

  if (!visible || !project) return null;

  const displays = project.displays || [];
  const currentDisplay = displays[current] || null;

  const isYouTubeUrl = (u?: string) => {
    if (!u) return false;
    return /youtube\.com|youtu\.be/.test(u);
  };

  const getYouTubeId = (u: string) => {
    try {
      const ytMatch = u.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:[&?#]|$)/);
      if (ytMatch && ytMatch[1]) return ytMatch[1];
      const short = u.match(/youtu\.be\/([0-9A-Za-z_-]{11})/);
      if (short && short[1]) return short[1];
    } catch (e) {
      // ignore
    }
    return null;
  };

  const getYouTubeEmbedUrl = (u: string) => {
    const id = getYouTubeId(u);
    return id ? `https://www.youtube.com/embed/${id}` : '';
  };

  const getYouTubeThumb = (u: string) => {
    const id = getYouTubeId(u);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
  };

  return (
    <div className="pd-modal-overlay" onClick={onClose} role="dialog">
      <div className="pd-modal" onClick={(e) => e.stopPropagation()}>
        <button className="pd-close" onClick={onClose} aria-label="Close">×</button>
        <h2 className="pd-title">{project.project_name}</h2>

        <div className="pd-main">
          <div className="pd-display">
            {currentDisplay ? (
              currentDisplay.type === 'video' ? (
                isYouTubeUrl(currentDisplay.path) ? (
                  <div className="pd-youtube-wrap">
                    <iframe
                      title="youtube-player"
                      src={getYouTubeEmbedUrl(currentDisplay.path)}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="pd-large-media"
                    />
                  </div>
                ) : (
                  <video src={currentDisplay.path} controls className="pd-large-media" />
                )
              ) : (
                <img src={currentDisplay.path} alt="display" className="pd-large-media" />
              )
            ) : (
              <div className="pd-no-media">No media</div>
            )}
          </div>

          <div className="pd-thumbs" role="list">
            {displays.map((d, i) => (
              <div key={i} className={`pd-thumb ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} role="listitem">
                {d.type === 'video' ? (
                  isYouTubeUrl(d.path) ? (
                    <img src={getYouTubeThumb(d.path)} alt={`thumb-${i}`} className="pd-thumb-media" />
                  ) : (
                    <video src={d.path} className="pd-thumb-media" muted loop />
                  )
                ) : (
                  <img src={d.path} alt={`thumb-${i}`} className="pd-thumb-media" />
                )}
              </div>
            ))}
          </div>

          <div className="pd-info">
            {project.description && <p className="pd-description">{project.description}</p>}

            {project.my_responsibility && (
              <div className="pd-resp">
                <h4>My Responsibility</h4>
                <ul>
                  {project.my_responsibility.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {project.play_url && project.play_url.trim() !== '' && (
            <div className="pd-actions pd-actions-center">
              <a href={project.play_url} target="_blank" rel="noreferrer" className="pd-play-btn">Play</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
