import { h } from 'preact';
import { useContext } from 'preact/hooks';

import {
  Image,
  Box,
  ResponsiveContext,
} from 'grommet';

import loginImage from 'Assets/login.png';

const LoginSignup = ({ children }) => {
  const size = useContext(ResponsiveContext);
  const isLargeScreen = size === 'large';
  const templateDirection = isLargeScreen ? 'row' : 'column-reverse';
  const formContainerSize = isLargeScreen ? '1/2' : '3/4';
  const imageContainerSize = isLargeScreen ? '1/2' : '1/4';

  return (
    <Box flex={isLargeScreen ? 'grow' : 'shrink' } direction={templateDirection} overflow="hidden">
      <Box basis={imageContainerSize} justify="center">
        <Box fit="cover" width={{ max: '500px', min: '250px' }}>
          <Image responsive src={loginImage} alt="" />
        </Box>
      </Box>
      <Box basis={formContainerSize} justify="center" pad={{ horizontal: isLargeScreen ? 'medium' : 'large' }}>
        {children}
      </Box>
    </Box>
  );
};

export default LoginSignup;