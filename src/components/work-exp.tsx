import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../css/work-exp.css';
import yaml from 'js-yaml';

interface WorkExperienceList {
  current: WorkExperienceData;
  other: WorkExperienceData[];
}

interface WorkExperienceData {
  organization: string;
  start: string;
  end?: string;
  position: string;
  detail: string[];
}

const WorkExperience = () => {
  const [currentWorkExp, setCurrentWorkExp] = useState<WorkExperienceData | undefined>(undefined);
  const [allWorkExp, setAllWorkExp] = useState<WorkExperienceData[]>([]);

  const [expanded, setExpanded] = useState(false);
  const [hideExpandBtn, setHideExpandBtn] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const shortContentRef = useRef<HTMLDivElement>(null);
  const fullContentRef = useRef<HTMLDivElement>(null);

  const adjustContentHeight = useCallback(() => {
    if (contentRef.current) {
      let targetHeight = 'auto';
      if (expanded) {
        targetHeight = fullContentRef.current ? `${fullContentRef.current.scrollHeight}px` : 'auto';
      } else {
        targetHeight = shortContentRef.current ? `${shortContentRef.current.scrollHeight}px` : 'auto';
      }
      contentRef.current.style.height = targetHeight;
    }
  }, [expanded]);

  useEffect(() => {
    const loadWorkExperienceData = async () => {
      const response = await fetch('./files/datas/work-exp.yaml');
      const rawData = await response.text();
      const workExpDatas: WorkExperienceList = yaml.load(rawData) as WorkExperienceList;

      setCurrentWorkExp(workExpDatas.current);
      setAllWorkExp([...workExpDatas.other, workExpDatas.current]);

      if (workExpDatas.other.length <= 1) {
        setHideExpandBtn(true);
      }

      adjustContentHeight();
    };

    loadWorkExperienceData();
  }, [adjustContentHeight]);

  const toggleExpansion = () => {
    setExpanded(!expanded);
    adjustContentHeight();
  };

  const getWorkDuration = (timeDiff: number) =>
  {
    const day = timeDiff / (60 * 60 * 24);
    const year = Math.floor(day / (365.25));
    const month = Math.floor(day % (365.25) / 30);

    return <>{year} year{year !== 1 ? "s" : ""} {month} month{month !== 1 ? "s" : ""}</>;
  }

  const getShortContent = () => {
    if (!currentWorkExp) return null;
    const startDate = new Date(currentWorkExp.start);
    const endDate = currentWorkExp.end ? new Date(currentWorkExp.end) : undefined;
    const totalDuration = (endDate !== undefined ? endDate.getTime() : Date.now()) - startDate.getTime();

    return (
      <div className="short-content" ref={shortContentRef}>
        <div className="work-organization">
          <h4>{currentWorkExp.organization}</h4>
        </div>
        <div className="work-position">

        </div>
        <div className="date-range">
          <span>Start Date: {formatDate(startDate)} - {endDate ? formatDate(endDate) : 'Current'}</span>
        </div>
        <div className="work-duration">
          <span>Duration: {getWorkDuration(totalDuration/1000)}</span>
        </div>
        <div className="work-detail">
          <div className="header">
            Work Detail:
          </div>
          <div className="content">
            <ul>
              {currentWorkExp.detail.map((detail, index) => (
                <li key={index} className='work-detail-item'>{detail}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const getFullContent = () => {
    if (!allWorkExp || allWorkExp.length === 0) return null;
    return (
      <div className="full-content" ref={fullContentRef}>
        {allWorkExp.map((exp, index) => (
          <div key={index}>
            <div className="organization">
              <h4>
                {exp.organization} {exp === currentWorkExp ? '(Current)' : ''}
              </h4>
            </div>
            <div className="date-range">
              <span>Start Date: {formatDate(new Date(exp.start))}</span>
              <span>End Date: {exp.end ? formatDate(new Date(exp.end)) : 'Current'}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getExpandButton = () => {
    if (hideExpandBtn) {
      return null;
    }
    return (
      <div className="expand-btn">
        <input type="button" onClick={toggleExpansion} value={expanded ? 'Show Less' : 'Show More'} />
      </div>
    );
  };

  return (
    <div className="work-experience">
      <div className="header">
        <h2>Work Experience:</h2>
      </div>
      <div className="content" ref={contentRef}>
        {expanded ? getFullContent() : getShortContent()}
      </div>
      {getExpandButton()}
    </div>
  );
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export default WorkExperience;
