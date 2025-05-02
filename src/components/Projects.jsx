import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Requests from "../utils/requests";
import Button from "./Button";
import LoadingSpinner from "./LoadingSpinner";
import ProjectContent from "./ProjectContent";

const Projects = (props) => {
  const [portfolioJSON, setPortfolioJSON] = useState(null);
  const [slice, setSlice] = useState(null);
  const [page, setPage] = useState(0);
  const [rerender, setRerender] = useState(false);
  const isMobile = props.isMobile;
  const [isLoaded, setIsLoaded] = useState(false);

  const nextBtnHandler = async (e) => {
    if (page < portfolioJSON.length - 3)
      return setPage(page + 4);
  };

  const backBtnHandler = async (e) => {
    if (page >= 4)
      return setPage(page - 4);
  };


  useEffect(() => {
    const api = new Requests();
    api.get("/getPortfolio").then((data) => {
      const items = Object.keys(data.data).map((it) => {
        var item = data.data[it];
        item["title"] = it;
        return item;
      });

      setPortfolioJSON(items);
      if (portfolioJSON) {
        setSlice(portfolioJSON.slice(page, page + 4));
      }
    });
  }, []);

  useEffect(() => {
    if (portfolioJSON) {
      setSlice(portfolioJSON.slice(page, page + 4));
    }
  }, [page, portfolioJSON]);

  return (
    <div className="w-full h-fit text-white flex sm:gap-10 flex-col align-center">
      <h1 className="p-4 text-4xl text-center">Projects</h1>

      {slice || rerender ? (
        <div
          className="flex w-full h-fit flex-col items-center justify-center gap-5"
        >
          <ProjectContent
            isLoaded={isLoaded}
            setIsLoaded={setIsLoaded}
            portfolio={slice}
            page={page}
          />
        </div>
      ) : (
        <div className="w-100 flex items-center justify-center h-[10vh]">
          <LoadingSpinner />
        </div>
      )}
      <div className="w-100 mb-5 flex justify-center">
      <Button
          title="Back"
          onClick={() => {
            backBtnHandler();
          }}
          disabled={page === 0}
        />
        
        <Button
          title="Next"
          onClick={() => {
            nextBtnHandler();
          }}
          disabled={
            portfolioJSON ? page + 4 >= portfolioJSON.length : false 
          }
        />
               
      </div>
    </div>
  );
};

export default Projects;
