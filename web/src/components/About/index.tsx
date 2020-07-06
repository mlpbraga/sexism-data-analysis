import React from 'react';
import { Link } from 'react-router-dom';

import { Container } from './styles';

const About: React.FC = () => (
      <Container>
        <div>
          <h1> O que é o projeto?</h1>

          <p>
            Em 2018, no Instituto de Computação da Universidade Federal do Amazonas {'(UFAM)'},
            iniciamos um Projeto de Iniciação Científica {'(PIBIC)'} voltado para a detecção de comentários
            sexistas em redes sociais.
          </p>
          <p>
            Coletamos diversos comentários em notícias do G1 e do UOL, afim de construir uma base
            de dados para a nossa pesquisa e queremos usar essa base de dados para fazer com que um
            programa seja capaz de identificar automaticamente se um comentário feito é sexista ou não. Mas para que isso seja possível, precisamos ensinar ao programa
            <strong> o que são comentários sexistas</strong>, e é ai que você entra :)
          </p>
          <p>
            Nosso programa precisa de exemplos de comentários classificados, mas não podemos classificar
            todos os comentários que coletamos, pois não queremos enviesar o programa com o nosso ponto de vista,
            queremos ter vários pontos de vista diferentes sobre os comentários, pois o que eu considero sexista
            talvez não seja sexista pra você, entendeu? ;)
          </p>
        </div>
        <div>
          <h1> Como eu posso ajudar?</h1>
          <p>
            Você pode se cadastrar aqui no site, é bem fácil! Pedimos o seu e-mail, nome, data de nascimento,
            e pronto, você já é redirecionado para a nossa tela de classificação e pode começar a rotular todos
            os comentários que quiser. Dos dados que coletamos aqui, os únicos que são utlizados nas pesquisa são
            os gêneros e as idades, não vamos utilizar seu nome e seu e-mail para nada além de te identificar dentro
            do nosso site. Então pode se cadastrar <Link to='/'>aqui</Link> sem medo :)
          </p>
        </div>
        <div>
          <h1> Como funciona?</h1>
          <p>
            Cada pessoa que se cadastra aqui se torna um rotulador e passa a ter acesso aos comentários que
            da nossa base de dados. Alguns comentários são selecionados e exibidos para o rotulador e ele deve
            indicar se os comentário exibidos são sexistas ou não. A base de dados tem cerca de 3200 comentários {'(por enquanto)'}
            e os rotuladores podem classificar quantos comentários quiserem, e não são obrigados a classificar todo eles.
          </p>
          <p>
            O rótulo final de cada comentário é atribuído utilizando a média dos votos que o comentário recebeu.
            Os votos que classificam o comentário como sexista tem peso 1, e os votos que classificam como não sxista tem peso 0.
            Comentários com média de votos maior que 0.5 não considerados sexistas, equanto os comentários com média menor que 0.5
            são considerados não sexistas. Mas e os comentários com média <strong>igual</strong> a 0.5? Bom, esses são
            os comentários que tiveram empate nos votos, e eles ficam aguardando a classificação de novos rotuladores até
            que sua média mude.
          </p>
        </div>
        <div>
          <h1> Quem está fazendo isso?</h1>
          <p>
            A pesquisa está sendo realizada por mim, Maria Luísa Pereira Braga, aluna de mestrado do Programa de Pós
            Graduação do Instituto de Computação da UFAM. O projeto é orientado pelos professores Eduardo Nakamura e
            Fabiola Nakamura, que tiveram toda a ideia do projeto.
          </p>
          <p> Caso você tenha qualquer dúvida e queira entrar em contato, mande um email para mlpb@icomp.ufam.edu.br.</p>
        </div>
      </Container>
  );

export default About;
