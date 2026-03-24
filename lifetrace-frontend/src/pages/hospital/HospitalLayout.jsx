import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { hospitalService } from '../../services/hospitalService';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export default function HospitalLayout() {
  const [profileStatus, setProfileStatus] = useState(null); 
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await hospitalService.getProfile();
        // Extract inner data if paginated/wrapped, else take raw response
        const profile = response.data || response;
        
        // If the backend returns a generic error mapping inside a 200/404 JSON response body
        if (profile?.status === 404 || profile?.status === "404" || profile?.error === "Error: response status is 404" || profile?.message?.includes("Complete hospital profile first")) {
            setProfileStatus('NO_PROFILE');
            return;
        }

        // If string returned or empty object, assume no profile
        if (!profile || (typeof profile === 'object' && Object.keys(profile).length === 0) || typeof profile === 'string') {
           setProfileStatus('NO_PROFILE');
        } else {
           // The profile details are likely nested in 'data' based on Spring Boot envelope
           const innerData = profile.data ? profile.data : profile;
           
           let status = 'APPROVED';
           if (innerData.blocked === true || innerData.blocked === "true") {
               status = 'BLOCKED';
           } else if (innerData.approved === false || innerData.approved === "false") {
               status = 'PENDING';
           } 
           
           setProfileStatus(status);
        }
      } catch (err) {
        // Checking for actual Axios 404 Error object
        if (err.response?.status === 404 || err.response?.data?.status === 404 || err.response?.status === 400 || err.response?.status === 204) {
           setProfileStatus('NO_PROFILE');
        } else {
           // For any unknown network failures, safest is to assume NO_PROFILE and prompt to re-login if needed
           setProfileStatus('NO_PROFILE'); 
        }
      } finally {
        setLoading(false);
      }
    };
    checkProfile();
  }, []); // Run only once on mount of the layout

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-200 border-t-brand-600"></div>
      </div>
    );
  }

  const isCreateProfileRoute = location.pathname === '/hospital/create-profile';

  // Strict Routing Policies
  if (profileStatus === 'NO_PROFILE' && !isCreateProfileRoute) {
     return <Navigate to="/hospital/create-profile" replace />;
  }

  if (isCreateProfileRoute && profileStatus !== 'NO_PROFILE') {
     return <Navigate to="/hospital/dashboard" replace />;
  }

  if ((profileStatus === 'PENDING' || profileStatus === 'BLOCKED') && !isCreateProfileRoute) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
           <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 text-center border border-slate-100">
               {profileStatus === 'BLOCKED' ? (
                   <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
               ) : (
                   <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
               )}
               <h2 className="text-2xl font-bold text-slate-900 mb-2">
                   {profileStatus === 'BLOCKED' ? 'Account Blocked' : 'Verification Pending'}
               </h2>
               <p className="text-slate-500 mb-6">
                   {profileStatus === 'BLOCKED' 
                       ? 'Your hospital account has been blocked by the system administrators. You cannot perform operations at this time.' 
                       : 'Your profile has been submitted and is currently under review by administrators. You will be able to access the dashboard once verified.'}
               </p>
           </div>
        </div>
     );
  }

  return <Outlet />;
}
