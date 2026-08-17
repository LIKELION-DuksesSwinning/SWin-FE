import './StepIndicator.css';

const STEPS = [
  '수영 패턴',
  '피부',
];

function StepIndicator({ currentStep }) {
  return (
    <div className="step-indicator">

      <h1>
        {STEPS[currentStep - 1]}
      </h1>

      <div className="step-lines">
        {STEPS.map((step, index) => (
          <span
            key={step}
            className={`step-line ${
              index < currentStep ? 'active' : ''
            }`}
          />
        ))}
      </div>

    </div>
  );
}

export default StepIndicator;