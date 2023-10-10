import { useState } from "react"

const StepsM = ({ currentStep }) => {
  // eslint-disable-next-line no-unused-vars
  const [steps, setStep] = useState({
    stepsItems: ["Login", "Shipping Address", "Payment Method", "Place Order"],
    currentStep: 3,
  })

  return (
    <div className='mx-auto py-4 max-w-5xl px-4 md:px-0 mt-20'>
      <ul
        aria-label='Steps'
        className='items-center text-gray-600 font-medium md:flex'>
        {steps.stepsItems.map((item, idx) => (
          <li
            key={idx}
            aria-current={currentStep == idx + 1 ? "step" : false}
            className='flex-1 last:flex-none flex gap-x-2 md:items-center'>
            <div className='flex items-center flex-col gap-x-2'>
              <div
                className={`w-8 h-8 rounded-full border-2 flex-none flex items-center justify-center ${
                  currentStep > idx + 1
                    ? "bg-orange-700 border-orange-700"
                    : "" || currentStep == idx + 1
                    ? "border-orange-700"
                    : ""
                }`}>
                <span
                  className={` ${
                    currentStep > idx + 1
                      ? "hidden"
                      : "" || currentStep == idx + 1
                      ? "text-orange-700"
                      : ""
                  }`}>
                  {idx + 1}
                </span>
                {currentStep > idx + 1 ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-5 h-5 text-white'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M4.5 12.75l6 6 9-13.5'
                    />
                  </svg>
                ) : (
                  ""
                )}
              </div>
              <hr
                className={`h-12 border md:hidden ${
                  idx + 1 == steps.stepsItems.length
                    ? "hidden"
                    : "" || currentStep > idx + 1
                    ? "border-orange-700"
                    : ""
                }`}
              />
            </div>
            <div className='h-8 flex items-center md:h-auto'>
              <h3
                className={`text-sm ${
                  currentStep == idx + 1 ? "text-orange-700" : ""
                }`}>
                {item}
              </h3>
            </div>
            <hr
              className={`hidden mr-2 w-full border md:block ${
                idx + 1 == steps.stepsItems.length
                  ? "hidden"
                  : "" || currentStep > idx + 1
                  ? "border-orange-700"
                  : ""
              }`}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
export default StepsM
