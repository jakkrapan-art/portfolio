import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import '../css/project-showcase.css';
import '../css/project-detail-modal.css';
import { useEffect, useRef, useState } from 'react';
import yaml from 'js-yaml';
import ProjectDetailModal, { ProjectDetail } from './project-detail-modal';

export interface ProjectThumbnailData {
  id: number;
  title: string;
  image: string;
  pageUrl?: string;
  engine: string;
}

const ProjectThumbnail: React.FC<ProjectThumbnailData & { onClick?: (id:number) => void }> = ({ id, title, image, pageUrl, engine, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const imageUrl = "./project-thumbnails/" + image;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = imgRef.current;
          if (img) {
            img.src = imageUrl;
            img.onload = () => setIsLoaded(true);
            img.onerror = () => setIsError(true);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(imgRef.current!);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [image, imageUrl]);

  // If an onClick handler is provided, use it to open the modal instead of navigating
  if (onClick) {
    return (
      <div className="project-thumbnail-wrapper" onClick={() => onClick(id)} role="button" tabIndex={0}>
        <div className="project-thumbnail">
          <div className="thumbnail-placeholder" style={{ display: isLoaded ? 'none' : 'block' }}></div>
          <img ref={imgRef} src={imageUrl} alt={title} style={{ display: isError ? 'none' : 'block' }} />
        </div>
        <div className="project-engine">
          <img src={"./files/icons/" + engine + ".png"} alt={engine} className="project-engine-image" />
        </div>
        <h3 className="thumbnail-name">{title}</h3>
      </div>
    );
  }

  if (pageUrl) {
    return (
      <a href={pageUrl} target='_blank' rel='noreferrer'>
        <div className="project-thumbnail">
          <div className="thumbnail-placeholder" style={{ display: isLoaded ? 'none' : 'block' }}></div>
          <img ref={imgRef} src={imageUrl} alt={title} style={{ display: isError ? 'none' : 'block' }} />
        </div>
        <div className="project-engine">
          <img src={"./files/icons/" + engine + ".png"} alt={engine} className="project-engine-image" />
        </div>
        <h3 className="thumbnail-name">{title}</h3>
      </a>
    );
  }

  return (
    <Link to={`/projects/${id}`}>
      <div className="project-thumbnail">
        <div className="thumbnail-placeholder" style={{ display: isLoaded ? 'none' : 'block' }}></div>
        <img ref={imgRef} src={imageUrl} alt={title} style={{ display: isError ? 'none' : 'block' }} />
      </div>
      <h3 className="thumbnail-name">{title}</h3>
    </Link>
  );
};

const ProjectShowcase = () => {
  const [projects, setProjects] = useState<ProjectThumbnailData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalProject, setModalProject] = useState<ProjectDetail | null>(null);

  useEffect(() => {
    const loadProjects = async ()=>
    {
      try{
        const response = await fetch('./files/datas/project-thumbnails.yaml'); // Adjust the path to your YAML file
        const yamlData = await response.text();
        const parsedData: ProjectThumbnailData[] = yaml.load(yamlData) as ProjectThumbnailData[];
        setProjects(parsedData);
      } catch (err: any)
      {
        if(err instanceof Error)
        {
          throw new Error(err.message);
        }
      }
    }

    loadProjects();
  }, [])

  const openProjectModal = async (id: number) => {
    try {
      const resp = await fetch('./files/project-data/project-detail.yaml');
      const text = await resp.text();
      const parsed = yaml.load(text) as ProjectDetail[];
      const found = parsed?.find(p => p.id === id) || null;
      setModalProject(found);
      setModalVisible(true);
    } catch (err) {
      console.error('Failed to load project detail', err);
    }
  }

  const closeModal = () => {
    setModalVisible(false);
    setModalProject(null);
  }

  return (
    <div className="project-showcase">
      <div className="header">
        <h2>My Projects:</h2>
      </div>
      <div className="thumbnails-container">
        {projects.map(project => (
          <ProjectThumbnail key={project.id} id={project.id} image={project.image} title={project.title} pageUrl={project.pageUrl} engine={project.engine} onClick={openProjectModal} />
        ))}
      </div>

      <ProjectDetailModal visible={modalVisible} project={modalProject} onClose={closeModal} />
    </div>
  );
};

export default ProjectShowcase;
