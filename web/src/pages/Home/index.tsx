import React, { useState } from 'react';
import { FiLogIn, FiInfo } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import Comment from '../../components/Comment';

import './styles.css';

import logo from '../../assets/logo.png';
// interface HeaderProps {
//   title: string;
// }

const Home: React.FC = (props) => {
  const [showLogin, setShowLogin] = useState(true);
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img className='logo' src={logo} alt='Detector de Sexismo' />
        </header>
        <main>
          <div className='text'>
            <h1>Esses comentários são sexistas?</h1>
            <p>Estamos estudando formas de detectar automaticamente comentários sexistas em redes sociais, pretendemos fazer isso ensinando para um programa que tipo de comentário pode ser considerado sexista.</p>
            <p>Para fazer isso, precisamos que pessoas diversas nos digam quais dos comentários coletados por nós são sexistas e quais não são, e você pode nos ajudar rotulando alguns comentários aqui :)</p>
            <p>Saiba mais sobre o projeto clicando <Link to='/about'>aqui</Link></p>
          </div>
          <div className='examples'>
            <Comment />
            <Comment />
            <Link className='link-button' to='/sign'>
              <span>
                <FiLogIn />
              </span>
              <strong>Rotular comentários</strong>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}


export default Home;