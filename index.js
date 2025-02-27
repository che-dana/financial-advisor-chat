// This file redirects to the actual app
import { useEffect } from 'react';

export default function Index() {
  useEffect(() => {
    window.location.href = '/src/app/page';
  }, []);
  
  return <p>Redirecting...</p>;
} 