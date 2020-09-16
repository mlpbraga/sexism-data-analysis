const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

module.exports = (sequelize, models) => {
  const {
    Users,
    Comments,
    News,
    Votes,
  } = models;

  sequelize.sync({ force: true })
    .then(async () => {
      await Users.create({
        username: 'teste',
        email: 'teste@email.com',
        name: 'teste teste',
        birth: Date('1997-10-10'),
        gender: 'fem',
        password: bcrypt.hashSync('123'),
      });

      await News.create({
        title: 'O Título desta notícia é NOTICIA',
        link: 'www.noticia.com',
      });

      await Comments.create({
        content: 'Odiei essa notícia grrr',
        newsId: 1,
      });

      await Comments.create({
        content: 'Amei essa notícia grrr',
        replyTo: 'AAHAHHAHAAHA',
        newsId: 1,
      });

      await Comments.create({
        content: 'Lorem IPSUM e tal e pa',
        newsId: 1,
      });

      await Votes.create({
        commentId: 1,
        userId: 'teste@email.com',
        vote: 1,
      });

      await Votes.create({
        commentId: 2,
        userId: 'teste@email.com',
        vote: 1,
      });

      logger.info('Database & tables created! Sync happened.');
    });
};
