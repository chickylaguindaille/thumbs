import React, { useState } from 'react';
import AssociationForm from '../components/signup/association';
import UserForm from '../components/signup/user';

const SignUpPage = () => {
  const [role, setRole] = useState(null);
  const [step, setStep] = useState(0);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleNext = () => {
    if (role) {
      setStep(step + 1);
    }
  };

  const handleBack = (stepNumber = 0) => {
    setStep(stepNumber);
  };

  const renderForm = () => {
    if (step === 0) {
      return (
        <div className="py-20 px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl font-bold mb-4">Inscription</h1>
            <h2 className="text-lg mb-8">Êtes-vous une association, un bénévole ou un utilisateur ?</h2>
          </div>
          <div className="flex flex-col space-y-4">
            <label>
              <input
                type="radio"
                name="role"
                value="association"
                checked={role === 'association'}
                onChange={() => handleRoleChange('association')}
              />
              <span className="p-2">
                  Je suis une association
              </span>
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === 'user'}
                onChange={() => handleRoleChange('user')}
              />
              <span className="p-2">
                Je suis un utilisateur
              </span>
            </label>
          </div>
          {/* Boutons Retour et Suivant */}
          <div className="flex justify-between mt-6">
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => window.location.href = '/login'}
            >
              Retour
            </button>
            <button
              className={`bg-blue-500 text-white px-4 py-2 rounded ${!role ? 'opacity-50' : ''}`}
              disabled={!role}
              onClick={handleNext}
            >
            Suivant
            </button>
          </div>
        </div>
      );
    } else {
      switch (role) {
        case 'association':
          return <AssociationForm onBack={handleBack} onNext={handleNext} />;
        case 'user':
          return <UserForm onBack={handleBack} onNext={handleNext} />;
        default:
          return null;
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      {renderForm()}
    </div>
  );
};

export default SignUpPage;
