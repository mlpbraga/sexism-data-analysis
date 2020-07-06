import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { Link, useHistory } from 'react-router-dom';
import logoImg from '../../assets/logo.png';

import Button from '../../components/Button';
import Input from '../../components/Input';
import About from '../../components/About';

import { Container, Content, AnimatedContainer } from './styles';
import { getValidationErrors } from '../../utils/getValidationErrors';
import { useAuth } from '../../context/auth';
import { useToast } from '../../context/toast';

interface SignInCredentials {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: SignInCredentials) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().required('Senha obrigatória'),
        });
        await schema.validate(data, { abortEarly: false });

        await signIn({
          email: data.email,
          password: data.password,
        });

        history.push('/home');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
        } else {
          addToast({
            type: 'error',
            title: 'Erro na autenticação',
            description:
              'Ocorreu um erro ao fazer login, cheque as credenciais',
          });
        }
      }
    },
    [signIn, addToast],
  );
  return (
    <Container>
      <Content>
        <AnimatedContainer>
          <img width="300px" src={logoImg} alt="SexismResearch" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu login</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              name="password"
              icon={FiLock}
              placeholder="Senha"
              type="password"
            />
            <Button type="submit">Entrar</Button>
            {/* <a href="forgot">Esqueci minha senha</a> */}
          </Form>
          <Link to="signup">
            <FiLogIn />
            Criar conta
          </Link>
        </AnimatedContainer>
      </Content>
      <About/>
    </Container>
  );
};

export default SignIn;
