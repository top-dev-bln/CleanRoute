"use client"

import { Link } from "react-router-dom"
import { useEffect } from "react"

export default function LandingPage() {
  // This helps prevent body scrolling behind the main container
  useEffect(() => {
    // Lock body scrolling
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.width = "100%"
    document.body.style.height = "100%"

    return () => {
      // Restore body scrolling when component unmounts
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
      document.body.style.height = ""
    }
  }, [])

  return (
    <div className="fixed inset-0 w-full h-full">
      <div
        className="w-full h-full overflow-y-auto overscroll-none"
        style={{
          WebkitOverflowScrolling: "touch",
          overflowScrolling: "touch",
        }}
      >
        <div className="flex flex-col items-center min-h-full">
          {/* Header Section with Tagline */}
          <div className="w-full h-[40vh] flex items-center justify-center bg-white">
            <div className="flex flex-col items-center justify-center p-8">
              <h1 className="text-6xl font-bold mb-6">
                <span className="text-[#51a72f]">Clean</span>
                <span className="text-black">Route</span>
              </h1>
              <p className="text-xl text-black font-medium text-center">Healthier routes, healthier you!</p>
            </div>
          </div>

          {/* Start Button Section */}
          <div className="w-full py-8 flex items-center justify-center bg-white">
            <Link to="/map"> 
              <button
              className="h-12 px-12 text-lg font-medium bg-[#51a72f] text-white hover:bg-[#468a28] active:bg-[#3d7523] transition duration-150 rounded-lg shadow-md"
              onClick={() => console.log("Start button clicked")}
              >
               Start
              </button>
            </Link> 
          </div>

          {/* App Description Section */}
          <div className="flex w-full bg-gray-100 min-h-[30vh]">
            <div className="w-full max-w-4xl mx-auto px-6 py-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">What is CleanRoute?</h2>

              <div className="text-gray-700 space-y-4">
                <p>
                  CleanRoute is an innovative platform designed to help users navigate their daily commutes in a healthier way.
                </p>
                
                <p>With CleanRoute, you can:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Choose a better route for your daily commute</li>
                  <li>Enhance your training</li>
                  <li>Emprove your day-to-day life</li>
                  <li>Join a community of environmentally conscious commuters</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer with Copyright */}
          <div className="w-full py-4 bg-gray-800 text-center">
            <p className="text-gray-300 text-sm">Â© {new Date().getFullYear()} CleanRoute. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}