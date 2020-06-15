import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { FiLogIn, FiInfo } from 'react-icons/fi';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import Comment from '../../components/Comment';

import './styles.css';

import logo from '../../assets/logo.png';
// interface HeaderProps {
//   title: string;
// }

const Sign: React.FC = (props) => {
  const [showLogin, setShowLogin] = useState(true);

  const handleLogin = async (event: FormEvent) => { }
  const handleSubmit = async (event: FormEvent) => { }


  return (
    <div id='page-sign'>
      <div className='content'>
        <header>
          <Link to='/'>
            <img className='logo' src={logo} alt='Detector de Sexismo' />
          </Link>
        </header>
        <main>
          <form onSubmit={handleLogin}>
            {showLogin ? (
              <fieldset>
                <legend>
                  <h2>Login</h2>
                </legend>
                <div className="field">
                  <label htmlFor="email"> E-mail</label>
                  <input
                    type='text'
                    name='email'
                    id='email'
                    onChange={() => { }}
                  />
                </div>
                <div className="field">
                  <label htmlFor="password"> Senha</label>
                  <input
                    type='password'
                    name='password'
                    id='password'
                    onChange={() => { }}
                  />
                </div>
              </fieldset>
            ) : (
                <fieldset>
                  <legend>
                    <h2>Login</h2>
                  </legend>
                  <div className="field">
                    <label htmlFor="name"> Nome</label>
                    <input
                      type='text'
                      name='name'
                      id='name'
                      onChange={() => { }}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="email"> E-mail</label>
                    <input
                      type='text'
                      name='email'
                      id='email'
                      onChange={() => { }}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="password"> Senha</label>
                    <input
                      type='password'
                      name='password'
                      id='password'
                      onChange={() => { }}
                    />
                  </div>
                </fieldset>
              )}
            <Link to='/main' className='button'>
              <span>
                <FiLogIn />
              </span>
              <strong>Cadastrar</strong>
            </Link>
            <a className='button' onClick={() => { setShowLogin(!showLogin) }}>
              <span>
                <FiLogIn />
              </span>
              <strong>Já tenho um login</strong>
            </a>
          </form>
          <div className='content'>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Sign;
