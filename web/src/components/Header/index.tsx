import React from  'react';

import { Container } from './styles';
import logoImg from '../../assets/logo.png';
import { useAuth } from '../../context/auth';

const Header:React.FC = () => {
  const { signOut } = useAuth();
  return (<Container>
    <img width="200px" src={logoImg} alt="SexismResearch" />
    <a onClick={signOut}>Logout</a>
  </Container>)
};

export default Header;
