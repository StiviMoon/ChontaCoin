// /hooks/useActivities.js
import { useState, useMemo, useCallback } from 'react';
import useUserStore from '@/lib/userStore';

export const useActivities = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { 
    activities: userActivities,
    addActivity,
    updateActivity,
    completeActivity,
    removeActivity,
    isEnrolledInActivity,
    getEnrolledActivities,
    getCompletedActivities
  } = useUserStore();

  // Memoizar los arrays para evitar recreaciones
  const enrolledActivities = useMemo(() => getEnrolledActivities(), [userActivities]);
  const completedActivities = useMemo(() => getCompletedActivities(), [userActivities]);

  const enrollInActivity = useCallback(async (activity) => {
    if (isEnrolledInActivity(activity.id)) {
      throw new Error('Ya estás inscrito en esta actividad');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Agregar actividad al store
      addActivity({
        id: activity.id,
        name: activity.name,
        location: activity.location,
        date: activity.date,
        tokensEarned: activity.tokensReward,
        type: activity.category,
        status: 'enrolled',
        completed: false
      });

      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isEnrolledInActivity, addActivity]);

  const unenrollFromActivity = useCallback(async (activityId) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      removeActivity(activityId);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [removeActivity]);

  const markActivityCompleted = useCallback(async (activityId, tokensEarned) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      completeActivity(activityId, tokensEarned);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [completeActivity]);

  const clearError = useCallback(() => setError(null), []);

  return {
    // State
    userActivities,
    isLoading,
    error,
    
    // Computed (memoized)
    enrolledActivities,
    completedActivities,
    
    // Actions (memoized)
    enrollInActivity,
    unenrollFromActivity,
    markActivityCompleted,
    isEnrolledInActivity,
    
    // Utils
    clearError
  };
};