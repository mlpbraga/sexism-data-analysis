import React, {useCallback, useState} from 'react';
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';

import './styles.css';

interface Props {
  
}

const Comment: React.FC<Props> = ({  }) => {
  
  return (
    <div id='comment'>
      <p>Texto do comentário aqui Texto do comentário aqui</p>
      <div className='engagement'>
        <div className='likes'>
          <FiThumbsUp /> 
          89
        </div>
        <div className='dislikes'>
          <FiThumbsDown />
          90
        </div>
      </div>
    </div>
  );
}

export default Comment;
