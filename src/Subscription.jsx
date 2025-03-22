"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDownIcon, ChevronUpIcon, CheckIcon } from "lucide-react"

export default function Subscription() {
  const [expandedPlan, setExpandedPlan] = useState(null)
  const planRefs = useRef({})

  const togglePlan = (planId) => {
    // If clicking the same plan, collapse it; otherwise expand the clicked plan
    setExpandedPlan(expandedPlan === planId ? null : planId)
  }

  useEffect(() => {
    // Wait for the DOM to update after expansion
    if (expandedPlan && planRefs.current[expandedPlan]) {
      setTimeout(() => {
        const element = planRefs.current[expandedPlan]
        if (!element) return

        // Scroll the element into view with some padding
        element.scrollIntoView({ behavior: "smooth", block: "start" })

        // Add additional scroll to ensure it's fully visible with extra space at bottom
        setTimeout(() => {
          window.scrollBy({
            top: -40,
            behavior: "smooth",
          })
        }, 100)
      }, 50)
    }
  }, [expandedPlan])

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "1.99$",
      period: "month",
      description: "lorem ipsum",
      features: ["Access to basic features"],
      color: "bg-green-50",
    },
    {
      id: "pro",
      name: "Professional",
      price: "$4.99",
      period: "month",
      description: "lorem ipsum",
      features: [
        "All Basic features",
        "Ad free experience",
        "...",
      ],
      color: "bg-green-100",
      recommended: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$9.99",
      period: "month",
      description: "lorem ipsum",
      features: [
        "All Professional features",
        "AI air quality forecast"
      ],
      color: "bg-green-200",
    },
  ]

  return (
    <div className="min-h-screen bg-white py-8 px-4 overflow-auto">
      <div className="max-w-md mx-auto w-full pb-36">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
          <p className="text-gray-600">Select the subscription that works best for you</p>
        </div>

        <div className="space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              ref={(el) => (planRefs.current[plan.id] = el)}
              className={`relative p-4 rounded-lg shadow-md border-2 ${plan.color} ${
                plan.recommended ? "border-green-500" : "border-gray-200"
              } transition-all duration-200 bg-white ${
                expandedPlan === plan.id && plan.id === "enterprise" ? "mb-16" : ""
              }`}
            >
              {plan.recommended && (
                <div className="bg-[#51a72f] text-white text-xs font-medium py-1 px-3 absolute right-4 top-0 rounded-b-md">
                  Recommended
                </div>
              )}
              <div className="cursor-pointer pb-2" onClick={() => togglePlan(plan.id)}>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{plan.name}</h2>
                  {expandedPlan === plan.id ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
                </div>
                <div className="flex items-baseline mt-2">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  <span className="text-gray-600 ml-1">/{plan.period}</span>
                </div>
                <p className="mt-2 text-gray-600">{plan.description}</p>
              </div>

              {expandedPlan === plan.id && (
                <>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckIcon size={18} className="text-[#51a72f] mr-2 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <button className="w-full bg-[#51a72f] hover:bg-[#468a28] text-white py-2 rounded-lg font-medium transition-colors">
                      Subscribe Now
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

