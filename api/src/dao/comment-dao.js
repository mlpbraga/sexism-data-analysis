const { models } = require('../models');
const { db } = require('../models');

const { Comments, News, Votes } = models;

const querys = {
  voteQuantFreq : `
  with c as (select comment_id,count(vote_id) as qtd from votes group by (comment_id))
  select qtd, count(qtd) from c group by (qtd);
  `,
  voteQuantPerClass : `
  select vote, count(vote_id) from votes group by (vote);
  `,
  usersByGender: `
  select count(*), gender from users group by gender;
  `,
  sexistQuant: `
  select count(*) from results where avg>0.5;
  `,
  notSexistQuant: `
  select count(*) from results where avg<0.5;
  `,
  notLabeledQuant: `
  select count(*) from results where avg=0.5;
  `,
  votesPerUser: `
  select * from votes_per_user;
  `,
  usersAges: `
  select distinct age from votes_per_user order by age asc;
  `,
  maleCorrectSexistVotesPerAge: `
  select age, count(age)
  from votes_per_user
  where gender = 'masc'
    and avg > 0.5
    and vote = 1
  group by (age)
  order by age asc;
  `,
  maleIncorrectSexistVotesPerAge: `
  select age, count(age)
  from votes_per_user
  where gender = 'masc'
    and avg < 0.5
    and vote = 1
  group by (age)
  order by age asc;
  `,
  femaleCorrectSexistVotesPerAge: `
  select age, count(age)
  from votes_per_user
  where gender = 'fem'
    and avg > 0.5
    and vote = 1
  group by (age)
  order by age asc;
  `,
  femaleIncorrectSexistVotesPerAge: `
  select age, count(age)
  from votes_per_user
  where gender = 'fem'
    and avg < 0.5
    and vote = 1
  group by (age)
  order by age asc;
  `,
  maleCorrectNotSexistVotesPerAge: `
  select age, count(age)
  from votes_per_user
  where gender = 'masc'
    and avg < 0.5
    and vote = 0
  group by (age)
  order by age asc;
  `,
  maleIncorrectNotSexistVotesPerAge: `
  select age, count(age)
  from votes_per_user
  where gender = 'masc'
    and avg < 0.5
    and vote = 1
  group by (age)
  order by age asc;
  `,
  femaleCorrectNotSexistVotesPerAge: `
  select age, count(age)
  from votes_per_user
  where gender = 'fem'
    and avg < 0.5
    and vote = 0
  group by (age)
  order by age asc;
  `,
  femaleIncorrectNotSexistVotesPerAge: `
  select age, count(age)
  from votes_per_user
  where gender = 'fem'
    and avg < 0.5
    and vote = 1
  group by (age)
  order by age asc;
  `,
}

const formatAgeVoteDistribution = (response) => {
  const object = {};
  for(let i=0; i< response.length;i++) {
    object[response[i].age] = parseInt(response[i].count);
  }
  return object;
}

const CommentDao = {
  async randomOne(reqParams) {
    const { email } = reqParams;

    let where;
    let response = {};
    response = await Comments.findAll({
      where,
      include: [Votes, News],
    });
    const chosen = [];
    const min = 2;
    response.forEach((comment) => {
      if (comment.dataValues.Votes.length === 2) {
        let alreadyVoted = false;
        comment.dataValues.Votes.forEach((vote) => {
          if (vote.dataValues.userId === email) {
            alreadyVoted = true;
          }
        });
        if (!alreadyVoted) {
          chosen.push(comment.dataValues);
        }
      }
    });

    if (chosen.length === 0) {
      if (comment.dataValues.Votes.length === 1) {
        let alreadyVoted = false;
        comment.dataValues.Votes.forEach((vote) => {
          if (vote.dataValues.userId === email) {
            alreadyVoted = true;
          }
        });
        if (!alreadyVoted) {
          chosen.push(comment.dataValues);
        }
      }
    }
    if (chosen.length === 0) {   
      let alreadyVoted = false;
      comment.dataValues.Votes.forEach((vote) => {
        if (vote.dataValues.userId === email) {
          alreadyVoted = true;
        }
      });
      if (!alreadyVoted) {
        chosen.push(comment.dataValues);
      }
    }
    return chosen.sort(() => Math.random() - 0.5)[0];
  },
  async metrics() {
    const commentsCount = await Comments.count();
    const voteQuantFreq = await db.sequelize.query(querys.voteQuantFreq);
    const voteQuantPerClass = await db.sequelize.query(querys.voteQuantPerClass);
    const usersByGender = await db.sequelize.query(querys.usersByGender);
    const sexistQuant = await db.sequelize.query(querys.sexistQuant);
    const notSexistQuant = await db.sequelize.query(querys.notSexistQuant);
    const notLabeledQuant = await db.sequelize.query(querys.notLabeledQuant);
    const votesPerUser = await db.sequelize.query(querys.votesPerUser);
    const usersAges = await db.sequelize.query(querys.usersAges);
    const ages = usersAges[0].map(age => (age.age));
    const maleCorrectSexistVotesPerAge = await db.sequelize.query(querys.maleCorrectSexistVotesPerAge);
    const femaleCorrectSexistVotesPerAge = await db.sequelize.query(querys.femaleCorrectSexistVotesPerAge);
    const maleInorrectSexistVotesPerAge = await db.sequelize.query(querys.maleIncorrectSexistVotesPerAge);
    const femaleInorrectSexistVotesPerAge = await db.sequelize.query(querys.femaleIncorrectSexistVotesPerAge);
    const maleCorrectNotSexistVotesPerAge = await db.sequelize.query(querys.maleCorrectNotSexistVotesPerAge);
    const femaleCorrectNotSexistVotesPerAge = await db.sequelize.query(querys.femaleCorrectNotSexistVotesPerAge);
    const maleInorrectNotSexistVotesPerAge = await db.sequelize.query(querys.maleIncorrectNotSexistVotesPerAge);
    const femaleInorrectNotSexistVotesPerAge = await db.sequelize.query(querys.femaleIncorrectNotSexistVotesPerAge);
    return {
      comments: {
        quant: commentsCount,
        sexistQuant: parseInt(sexistQuant[0][0].count),
        notSexistQuant: parseInt(notSexistQuant[0][0].count),
        notLabeledQuant: parseInt(notLabeledQuant[0][0].count),
      },
      votes: {
        voteQuantFreq: voteQuantFreq[0],
        voteQuantPerClass: voteQuantPerClass[0],
        votesPerUser: votesPerUser[0][0],
        voteAnalysis: {
          maleCorrectSexistVotesPerAge: formatAgeVoteDistribution(maleCorrectSexistVotesPerAge[0]),
          femaleCorrectSexistVotesPerAge: formatAgeVoteDistribution(femaleCorrectSexistVotesPerAge[0]),
          maleInorrectSexistVotesPerAge: formatAgeVoteDistribution(maleInorrectSexistVotesPerAge[0]),
          femaleInorrectSexistVotesPerAge: formatAgeVoteDistribution(femaleInorrectSexistVotesPerAge[0]),
          maleCorrectNotSexistVotesPerAge: formatAgeVoteDistribution(maleCorrectNotSexistVotesPerAge[0]),
          femaleCorrectNotSexistVotesPerAge: formatAgeVoteDistribution(femaleCorrectNotSexistVotesPerAge[0]),
          maleInorrectNotSexistVotesPerAge: formatAgeVoteDistribution(maleInorrectNotSexistVotesPerAge[0]),
          femaleInorrectNotSexistVotesPerAge: formatAgeVoteDistribution(femaleInorrectNotSexistVotesPerAge[0]),
        },
      },
      users: {
        femaleQuant: usersByGender[0].find(obj => obj.gender === 'fem').count,
        maleQuant: usersByGender[0].find(obj => obj.gender === 'masc').count,
        ages,
      },
    }; 
  },
};

module.exports = CommentDao;
