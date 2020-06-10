import React, { useState } from 'react';
import { FiLogIn, FiInfo } from 'react-icons/fi';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import Comment from '../../components/Comment';

import './styles.css';

import logo from '../../assets/logo.png';
// interface HeaderProps {
//   title: string;
// }

const Main: React.FC = (props) => {
  const [showLogin, setShowLogin] = useState(true);
  return (
    <div id='page-main'>
      <div className='content'>
        <header>
          <Link to='/'>
            <img className='logo' src={logo} alt='Detector de Sexismo' />
          </Link>
        </header>
        <main>
          <div className='container'>
            <strong>Conceito de sexismo</strong>
            <p> </p>
            <div className='concept-content'>
                <p>
                  Para classificar o comentário apresentado, considere que <b>sexismo</b> é todo o discurso com a intenção de ofender, diminuir,
                  oprimir ou agredir pessoas do gênero feminino.São <b>exemplos</b> de comentários sexistas as seguintes frases:
                </p>
                <p>'Deveria sair da internet e ir pra cozinha.'</p>
                <p>'As pessoas só estão falando bem dela porque é mulher.'</p>
                <p>'Essa vagabunda não devia estar falando nada.'</p>
              </div>
          </div>
          <div className='container'>
            <strong>Comentário</strong>
            <Comment />
          </div>
          <div className='vote'>
            <strong>A partir do conceito de sexismo apresentado, na sua opinião, o comentário em avaliação é sexista?</strong>
            <div className='vote-box'>
              <a className='button'>
                <strong> SIM </strong>
              </a>
              <a className='button'>
                <strong> NÃO </strong>
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


export default Main;