import { useEffect, useState } from 'react';

const OnlyClientRender = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  return children;
};

export default OnlyClientRender;
