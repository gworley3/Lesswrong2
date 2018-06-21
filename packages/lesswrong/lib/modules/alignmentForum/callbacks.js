import Users from "meteor/vulcan:users";
import { Votes } from "meteor/vulcan:voting";
import { addCallback } from 'meteor/vulcan:core';
import { getVotePower } from '../voting/new_vote_types.js'
import { getCollection } from 'meteor/vulcan:lib';

export const recalculateAFBaseScore = (document) => {
  const votes = Votes.find({ documentId: document._id, afPower: {$exists: true} }).fetch() || [];
  return votes.reduce((sum, vote) => { return vote.afPower + sum}, 0)
}

function updateAlignmentKarmaServer (newDocument, vote, userMultiplier) {
  const voter = Users.findOne(vote.userId)
  const author = Users.findOne(newDocument.userId)
  if (
    Users.canDo(voter, "votes.alignment") &&
    Users.canDo(author, "votes.alignment") &&
    newDocument.af
  ) {
    const votePower = getVotePower(voter.afKarma, vote.voteType)
    Votes.update({_id:vote._id}, {$set:{afPower: votePower}})

    const newAFBaseScore = recalculateAFBaseScore(newDocument)

    const collection = getCollection(vote.collectionName)
    collection.update({_id: newDocument._id}, {$set: {afBaseScore: newAFBaseScore}});
    Users.update({_id:author._id}, {$inc:{afKarma: userMultiplier * votePower}})
  }
}

function updateAlignmentKarmaClient (newDocument, vote, userMultiplier) {
  const voter = Users.findOne(vote.userId)
  const author = Users.findOne(newDocument.userId)
  if (
    Users.canDo(voter, "votes.alignment") &&
    Users.canDo(author, "votes.alignment") &&
    newDocument.af
  ) {
    const votePower = getVotePower(voter.afKarma, vote.voteType)
    Votes.update({_id:vote._id}, {$set:{afPower: votePower}})

    const collection = getCollection(vote.collectionName)
    collection.update({_id: newDocument._id}, {$inc: {afBaseScore: userMultiplier * votePower}});
    Users.update({_id:author._id}, {$inc:{afKarma: userMultiplier * votePower}})
  }
}
function updateAlignmentKarmaServerCallback ({newDocument, vote}) {
  updateAlignmentKarmaServer(newDocument, vote, 1)
}

addCallback("votes.bigDownvote.async", updateAlignmentKarmaServerCallback);
addCallback("votes.bigUpvote.async", updateAlignmentKarmaServerCallback);
addCallback("votes.smallDownpvote.async", updateAlignmentKarmaServerCallback);
addCallback("votes.smallUpvote.async", updateAlignmentKarmaServerCallback);

// function updateAlignmentKarmaClientCallback ({newDocument, vote}) {
// function updateAlignmentKarmaClientCallback ({ document, collection, voteType, user, voteId }) {
//   console.log(document)
//   console.log(collection)
//   console.log(voteType)
//   console.log(user)
//   console.log(voteId)
//
//   // const votePower = getVotePower(voter.afKarma, vote.voteType)
//   const newDocument = {
//     ...document,
//     baseScore: document.baseScore || 0,
//     __typename: collection.options.typeName,
//     currentUserVotes: document.currentUserVotes || [],
//   };
//
//   // create new vote and add it to currentUserVotes array
//   // const vote = createVote({ document, collectionName: collection.options.collectionName, voteType, user, voteId });
//   // newDocument.currentUserVotes = [...newDocument.currentUserVotes, vote];
//   //
//   // // increment baseScore
//   newDocument.afBaseScore += 1;
//   // newDocument.score = recalculateScore(newDocument);
//   console.log(newDocument)
//   return newDocument;
//   // updateAlignmentKarmaClient(newDocument, vote, 1)
// }
//
// addCallback("votes.bigDownvote.sync", updateAlignmentKarmaClientCallback);
// addCallback("votes.bigUpvote.sync", updateAlignmentKarmaClientCallback);
// addCallback("votes.smallDownpvote.sync", updateAlignmentKarmaClientCallback);
// addCallback("votes.smallUpvote.sync", updateAlignmentKarmaClientCallback);

function cancelAlignmentKarmaCallback ({newDocument, vote}) {
  updateAlignmentKarmaServer(newDocument, vote, -1)
}

addCallback("votes.cancel.async", cancelAlignmentKarmaCallback);






// const updateAlignmentKarmaClientCallback = ({ document, collection, voteType, user, voteId }) => {
//
  // const newDocument = {
  //   ...document,
  //   baseScore: document.baseScore || 0,
  //   __typename: collection.options.typeName,
  //   currentUserVotes: document.currentUserVotes || [],
  // };
  //
  // // create new vote and add it to currentUserVotes array
  // const vote = createVote({ document, collectionName: collection.options.collectionName, voteType, user, voteId });
  // newDocument.currentUserVotes = [...newDocument.currentUserVotes, vote];
  //
  // // increment baseScore
  // newDocument.baseScore += vote.power;
  // newDocument.score = recalculateScore(newDocument);
  //
  // return newDocument;
// }
