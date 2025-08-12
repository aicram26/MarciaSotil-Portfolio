import React, { useState, useEffect, useRef, useCallback } from 'react';
import ProjectModal from './ProjectModal';
import LoadingSpinner from './LoadingSpinner';
import PortfolioItem from './PortfolioItem';
import { throttle } from '../utils';

const PAGE_SIZE = 8;

export default function Gallery() {
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  const allProjects = React.useMemo(
    () =>
      Array(50)
        .fill(null)
        .map((_, i) => ({
          id: i + 1,
          title: `Project #${i + 1}`,
          image: `/assets/project${(i % 4) + 1}.jpg`,
          description: `This is the description for Project #${i + 1}.`,
        })),
    []
  );

  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      const newProjects = allProjects.slice(0, page * PAGE_SIZE);
      setDisplayedProjects(newProjects);
      setLoading(false);
    }, 700);
    return () => clearTimeout(timeoutId);
  }, [page, allProjects]);

  const handleLoadMore = useCallback(
    throttle(() => {
      setPage((prev) => {
        if (prev * PAGE_SIZE >= allProjects.length) return prev;
        return prev + 1;
      });
    }, 1000),
    [allProjects.length]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          handleLoadMore();
        }
      },
      { rootMargin: '100px' }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleLoadMore, loading]);

  function openModal(project) { setSelectedProject(project); }
  function closeModal() { setSelectedProject(null); }

  return (
    <>
      <div className="gallery-grid">
        {displayedProjects.map((project) => (
          <PortfolioItem key={project.id} project={project} onClick={() => openModal(project)} />
        ))}
      </div>

      <div ref={loaderRef} style={{ height: 80 }}>
        {loading && <LoadingSpinner />}
      </div>

      <ProjectModal project={selectedProject} isOpen={!!selectedProject} onClose={closeModal} />
    </>
  );
}
