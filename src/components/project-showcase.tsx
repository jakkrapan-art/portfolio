import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import '../css/project-showcase.css';
import { useEffect, useRef, useState } from 'react';
import yaml from 'js-yaml';

export interface ProjectThumbnailData {
  id: number;
  title: string;
  image: string;
  pageUrl?: string;
  engine: string;
}

const ProjectThumbnail: React.FC<ProjectThumbnailData> = ({ id, title, image, pageUrl, engine }) => {
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
  } else {
    return (
      <Link to={`/projects/${id}`}>
        <div className="project-thumbnail">
          <div className="thumbnail-placeholder" style={{ display: isLoaded ? 'none' : 'block' }}></div>
          <img ref={imgRef} src={imageUrl} alt={title} style={{ display: isError ? 'none' : 'block' }} />
        </div>
        <h3 className="thumbnail-name">{title}</h3>
      </Link>
    );
  }
};

const ProjectShowcase = () => {
  const [projects, setProjects] = useState<ProjectThumbnailData[]>([]);

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

  return (
    <div className="project-showcase">
      <div className="header">
        <h2>My Projects:</h2>
      </div>
      <div className="thumbnails-container">
        {projects.map(project => (
          <ProjectThumbnail key={project.id} id={project.id} image={project.image} title={project.title} pageUrl={project.pageUrl} engine={project.engine} />
        ))}
      </div>
    </div>
  );
};

export default ProjectShowcase;
