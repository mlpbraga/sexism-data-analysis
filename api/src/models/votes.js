module.exports = (sequelize, types) => {
  const Votes = sequelize.define('Votes', {
    voteId: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'vote_id',
    },
    commentId: {
      type: types.INTEGER,
      field: 'comment_id',
      allowNull: false,
    },
    userId: {
      type: types.STRING(100),
      field: 'user_id',
      allowNull: false,
    },
    vote: {
      type: types.INTEGER,
      field: 'vote',
      allowNull: false,
    },
    deleted: {
      type: types.BOOLEAN,
      defaultValue: false,
    },
  }, {
    schema: 'public',
    tableName: 'votes',
    timestamps: false,
  });

  Votes.associate = function (models) {
    const { Users, Comments } = models;
    Votes.belongsTo(Users, {
      foreignKey: 'email',
      sourceKey: 'user_id',
    });

    Votes.belongsTo(Comments, {
      foreignKey: 'comment_id',
      sourceKey: 'comment_id',
    });
  };
  return Votes;
};
