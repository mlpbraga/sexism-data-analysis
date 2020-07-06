import React, {useState, useEffect} from 'react';

import Button from '../../components/Button';
import { useAuth } from '../../context/auth';
import { Container, Content, Loading, VoteOptions } from './styles';
import api from '../../services/api';
import { useCallback } from 'react';
import { useToast } from '../../context/toast';
import Header from '../../components/Header';


interface CommentData {
  commentId: number;
  newsTitle: string;
  newsUrl: string;
  commentContent: string;
  replyTo: string;
}

interface CommentsResponse {
  commentId: number;
  News: {
    title: string;
    link: string;
  };
  content: string;
  replyTo: string;
}

const decodeHTML = (text: string): string => {
  var txt = document.createElement("textarea");
  txt.innerHTML = text;
  return txt.value;
}

const Dashboard: React.FC = () => {
  const {addToast} = useToast();
  const [showExemples, setShowExamples] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadComment, setReloadComment] = useState(false);
  const [commentData, setCommentData] = useState<CommentData>({
    commentId: 0,
    newsTitle: '',
    newsUrl: '',
    commentContent: '',
    replyTo: '',
  });
  const showReply = commentData.replyTo!==' ' && commentData.replyTo !== '';

  const handleVote = useCallback(async (vote: string) => {
    try {
      const response = await api.post('/votes', {
        commentId: commentData.commentId,
        vote
      });
      console.log(response);

      setReloadComment(!reloadComment);
    } catch(error) {
      addToast({
        title: 'Falha ao enviar o voto',
        type: 'error'
      })
    }
  }, [reloadComment, commentData])

  useEffect(() => {
    const loadInfo = async (): Promise<void> => {
      try {
        const response = await api.get<CommentsResponse>('/comments');
        const comment = response.data;
        setCommentData({
          commentId: comment.commentId,
          newsTitle: decodeHTML(comment.News.title),
          newsUrl: comment.News.link,
          commentContent: decodeHTML(comment.content),
          replyTo: decodeHTML(comment.replyTo),
        })
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    loadInfo();
  }, [reloadComment]);
  return (
    <>
    <Header/>
    <Container>
      <Content>
        <header>
          <strong>Conceito de sexismo</strong>
        </header>
        <p>
          Para classificar o comentário apresentado, considere que sexismo é todo o discurso com a intenção de ofender, diminuir, oprimir ou agredir pessoas do gênero feminino.
        </p>
        {showExemples && (
          <div>
            <p>
              "Deveria sair da internet e ir pra cozinha."
            </p>
            <p>
              "As pessoas só estão falando bem dela porque é mulher."
            </p>
            <p>
              "Essa vagabunda não devia estar falando nada."
            </p>
          </div>
        )}
         <button onClick={() => setShowExamples(!showExemples)}>
          { showExemples ? 'Esconder exemplos' : 'Mostrar exemplos'}
        </button>
      </Content>
      <Content>
        <header>
          <strong>Título da notícia</strong>
        </header>
        { isLoading
            ? <Loading/>
            : <>
              <h2>{commentData.newsTitle}</h2>
              Leia o conteúdo da notícia em <a href={commentData.newsUrl}>{commentData.newsUrl.substring(0,20)}...</a>
        </>}
      </Content>
      <Content>
        <header>
          <strong>Comentário em avaliação</strong>
        </header>
        { isLoading
          ? <Loading/>
          : <p>
            "{commentData.commentContent}"
          </p>
        }
        { showReply &&
          <div>
            <small>
              O comentário acima foi uma resposta ao comentário "{commentData.replyTo}"
            </small>
          </div>
        }
      </Content>

      <p>Considerando o conceito de sexismo apresentado acima, em qual das classes abaixo você colocaria o <strong>comentário em avaliação</strong>?</p>
      <VoteOptions>
        <Button onClick={() => handleVote('s')}>Sexista</Button>
        <Button onClick={() => handleVote('n')}>Não sexista</Button>
      </VoteOptions>
    </Container>
  </>
  )
};

export default Dashboard;
