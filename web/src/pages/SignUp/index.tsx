import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiUser, FiMail, FiLock, FiCalendar } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { Link, useHistory } from 'react-router-dom';
import logoImg from '../../assets/logo.png';

import Button from '../../components/Button';
import Input from '../../components/Input';

import { Container, Content, GenderInput, AnimatedContainer } from './styles';
import { getValidationErrors } from '../../utils/getValidationErrors';
import api from '../../services/api';
import { useToast } from '../../context/toast';
import About from '../../components/About';
import { useState } from 'react';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  gender: 'fem' | 'masc';
  birth: Date;
}
const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [gender, setGender] = useState('masc');
  const history = useHistory();
  const { addToast } = useToast();

  const handleSubmit = useCallback(async (data: SignupFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        birth: Yup.date().required('Data de nascimento obrigatória'),
        gender: Yup.string().required('Gênero obrigatório'),
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string().min(
          6,
          'A senha precisa ter no mínimo 6 dígitos',
        ),
      });
      const body = {
        ...data,
        gender,
        username: data.email,
        birth: new Date(data.birth)
      };
      await schema.validate(body, { abortEarly: false });
      console.log(body);
      await api.post('/users', body);
      addToast({
        title: 'Cadastro realizado com sucesso',
        description: 'Você já pode fazer seu login',
        type: 'success',
      });
      history.push('/');
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);
      } else {
        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer cadastro, tente novamente',
        });
      }
    }
  }, [gender]);

  return (
    <Container>
      <Content>
        <AnimatedContainer>
          <img width="300px" src={logoImg} alt="SexismResearch" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu cadastro</h1>
            <Input name="name" icon={FiUser} placeholder="Nome" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              name="password"
              icon={FiLock}
              placeholder="Senha"
              type="password"
            />
            <Input
              name="birth"
              icon={FiCalendar}
              placeholder="Data de nascimento"
              type="date"
            />
            <GenderInput>
              <label className='radio-label'>Gênero  </label>
              <div className='signup-input-radio'>
                <input type="radio" name='gender' value='fem' checked={gender==='fem'} onChange={(event) => {
                  console.log(event.target.value);
                  setGender(event.target.value)}}/>
                <label className='radio-label'> Feminino </label>
              </div>
              <div className='signup-input-radio'>
                <input type="radio" name='gender' value='masc' checked={gender==='masc'} onChange={(event) => {
                  console.log(event.target.value);
                  setGender(event.target.value)}}/>
                <label className='radio-label'> Masculino </label>
              </div>
            </GenderInput>
            <Button type="submit">Cadastrar</Button>
          </Form>
          <Link to="/">
            <FiArrowLeft />
            Voltar para login
          </Link>
        </AnimatedContainer>
      </Content>
      <About/>
    </Container>
  );
};

export default SignUp;
