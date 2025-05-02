import React from "react";
import { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

const ProjectContent = (props) => {
  const portfolio = props.portfolio;
  const page = props.page;
  const [arr, setArr] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingImages, setLoadingImages] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const [slideDirection, setSlideDirection] = useState('right');
  const [prevPage, setPrevPage] = useState(page);

  // Track page changes to determine slide direction
  useEffect(() => {
    if (page > prevPage) {
      setSlideDirection('right');
    } else if (page < prevPage) {
      setSlideDirection('left');
    }
    setPrevPage(page);
    setIsLoaded(false);
    
    // Re-trigger animation with a slightly longer delay for smoother transition
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, [page]);

  // Initialize image loading state when portfolio changes
  useEffect(() => {
    const initialLoadingState = {};
    const initialErrorState = {};
    if (portfolio) {
      portfolio.forEach((_, index) => {
        initialLoadingState[index] = true;
        initialErrorState[index] = false;
      });
      setLoadingImages(initialLoadingState);
      setImageErrors(initialErrorState);
    }
  }, [portfolio]);

  // Handle image loading completion
  const handleImageLoad = (key) => {
    setLoadingImages(prev => ({...prev, [key]: false}));
  };

  // Handle image loading error
  const handleImageError = (key, title) => {
    setLoadingImages(prev => ({...prev, [key]: false}));
    setImageErrors(prev => ({...prev, [key]: true}));
  };

  // Generate fallback image URL with project title
  const getFallbackImageUrl = (title) => {
    return `https://dummyimage.com/600x400/000/fff.jpg&text=${encodeURIComponent(title)}`;
  };

  // Get proper animation class based on slide direction
  const getAnimationClass = () => {
    if (!isLoaded) {
      return slideDirection === 'right' 
        ? 'opacity-0 translate-x-12' 
        : 'opacity-0 -translate-x-12';
    }
    return 'opacity-100 translate-x-0';
  };

  useEffect(() => {
    const array = [];
    portfolio.map((ctx, key) => {
      array.push(
        <React.Fragment key={key}>
          <div
            className={`p-3 my-3 bg-gray-800 rounded-lg shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-500 ease-out 
              ${getAnimationClass()}`}
            style={{ transitionDelay: `${key * 100}ms` }}
          >
            <div className="flex flex-col gap-2">
              <a href={ctx.link} title={ctx.desc} className="overflow-hidden rounded-md h-40 md:h-52 lg:h-64 relative">
                {loadingImages[key] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
                    <LoadingSpinner />
                  </div>
                )}
                <img 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                  src={imageErrors[key] ? getFallbackImageUrl(ctx.title) : ctx.img}
                  alt={ctx.title}
                  onLoad={() => handleImageLoad(key)}
                  onError={() => handleImageError(key, ctx.title)}
                />
              </a>
              <div className="p-2">
                <h3 className="text-center text-lg md:text-xl lg:text-2xl font-semibold text-white mb-1 md:mb-2">{ctx.title}</h3>
                <p className="text-gray-300 text-xs md:text-sm lg:text-base line-clamp-3">{ctx.desc}</p>
                <div className="mt-2 md:mt-3 flex justify-center">
                  <a 
                    href={ctx.link} 
                    className="px-3 py-1 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-xs md:text-sm font-medium transition-colors duration-200"
                  >
                    View Project
                  </a>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    });

    setArr([...array]);
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, [portfolio, isLoaded, loadingImages, imageErrors, slideDirection]);

  return (
    <div className="w-full px-2 md:px-6 lg:px-10">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {arr}
      </div>
    </div>
  );
};

export default ProjectContent;
