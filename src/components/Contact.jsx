import React, { useEffect, useState } from "react";
import Requests from "../utils/requests";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [isInProgress, setIsInProgress] = useState(false);
  const [progress, setProgress] = useState(0);

  var x = 0;

  useEffect(() => {
    const changeToFalse = setTimeout(() => {
      setIsSubmit(false);
      setIsInProgress(false);
      x = 0;
    }, 2000);

    return () => clearTimeout(changeToFalse);
  }, [isSubmit]);

  const handleSubmit = () => {
    if (!name || !email) return;
    setIsInProgress(true);
    var id = setInterval(() => {
      if (x >= 100) {
        clearInterval(id);
      }
      setProgress(x);
      x += 5;
    }, 10);
    const request = new Requests();
    const data = {
      user_name: name.toString(),
      user_email: email,
      user_company: company,
      user_reason: reason,
    };
    request.post("/test", JSON.stringify(data)).then(() => {
      setIsSubmit(true);
    });
  };

  return (
    <>
      <div className="h-fit flex flex-col">
        <div className="w-full relative text-white h-fit gap-5 flex flex-col items-center justify-center">
          <h1 className="text-4xl">Contact Me</h1>
          
          <form
            className="w-full max-w-md md:max-w-lg lg:max-w-xl my-5 flex flex-col items-center justify-center"
            method="post"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="flex w-full max-w-md items-center border-b border-teal-500 py-2 mt-4">
              <input
                className="appearance-none bg-transparent border-none text-white w-full mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="text"
                placeholder="Full Name"
                aria-label="Full name"
                name="fullName"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
              />
            </div>

            <div className="flex w-full max-w-md items-center border-b border-teal-500 py-2 mt-4">
              <input
                className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="email"
                placeholder="Email"
                aria-label="Email"
                name="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
              />
            </div>

            <div className="flex w-full max-w-md items-center border-b border-teal-500 py-2 mt-4">
              <input
                className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="text"
                placeholder="Company"
                aria-label="Company"
                name="company"
                onChange={(e) => {
                  setCompany(e.target.value);
                }}
                value={company}
              />
            </div>
            
            <div className="flex w-full max-w-md items-center border-b border-teal-500 py-2 mt-4">
              <input
                className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="text"
                placeholder="Reason"
                aria-label="Reason"
                name="reason"
                onChange={(e) => {
                  setReason(e.target.value);
                }}
                value={reason}
              />
              <button
                className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-md border-4 text-white py-1 px-2 rounded"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <span> {isSubmit ? "✓" : "Send"}</span>
              </button>
            </div>

            {isInProgress && (
              <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: progress + "%" }}
                ></div>
              </div>
            )}

            <a href="https://github.com/hyoinkyouma" className="mt-8">
              <div className="flex flex-col items-center gap-3 justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="60"
                  height="60"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-white"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <p className="text-white text-center">Visit My Github</p>
              </div>
            </a>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;
