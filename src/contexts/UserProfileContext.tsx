"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for user profile
export type PersonalityTrait = 'High' | 'Low';
export type EducationLevel = 'High School' | 'Bachelor\'s' | 'Master\'s' | 'PhD';
export type IncomeLevel = 'Low' | 'Medium' | 'High';
export type HousingStatus = 'Renting' | 'Own House' | 'Living with Family';
export type VehicleOwnership = 'None' | 'Car' | 'Motorcycle';
export type WorkNature = 'Salaried' | 'Self-employed' | 'Freelancer' | 'Retired';
export type BehavioralTrait = 'Saver' | 'Spender' | 'Investor';
export type ProductStatus = 'Yes' | 'No';

export interface UserProfile {
  // Personality Traits
  openness: PersonalityTrait;
  conscientiousness: PersonalityTrait;
  extraversion: PersonalityTrait;
  agreeableness: PersonalityTrait;
  neuroticism: PersonalityTrait;
  
  // Demographics & Financial Status
  educationLevel: EducationLevel;
  incomeLevel: IncomeLevel;
  housingStatus: HousingStatus;
  vehicleOwnership: VehicleOwnership;
  workNature: WorkNature;
  familyDependants: number;
  age: number;
  behavioralTrait: BehavioralTrait;
  
  // Investment Product Status
  danaPlus: ProductStatus;
  reksadana: ProductStatus;
  eMAS: ProductStatus;
}

// Default user profile
const defaultUserProfile: UserProfile = {
  openness: 'High',
  conscientiousness: 'High',
  extraversion: 'High',
  agreeableness: 'High',
  neuroticism: 'Low',
  
  educationLevel: 'Bachelor\'s',
  incomeLevel: 'Medium',
  housingStatus: 'Renting',
  vehicleOwnership: 'Car',
  workNature: 'Salaried',
  familyDependants: 0,
  age: 30,
  behavioralTrait: 'Saver',
  
  danaPlus: 'No',
  reksadana: 'No',
  eMAS: 'No',
};

// Create context
interface UserProfileContextType {
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  resetUserProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

// Provider component
export const UserProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const resetUserProfile = () => {
    setUserProfile(defaultUserProfile);
  };

  return (
    <UserProfileContext.Provider value={{ userProfile, updateUserProfile, resetUserProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

// Custom hook to use the context
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}; 