import { useEffect } from 'react';
import { useHistory } from 'react-router';

function ScrollToTop() {
  const history = useHistory();

  useEffect(() => {
    return history.listen(() => {
      window.scrollTo(0, 0);
    });
  }, []);

  return null;
}

export default ScrollToTop;
