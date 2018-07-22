/**
 * Function to issue the rewards to the user
 * @param  {org.apptellect.swayloyalty.IssueRewards} issueRewards 
 * @transaction
 */

async function IssueRewards(issueRewards) {
  
    const NS = 'org.apptellect.swayloyalty';

 // Increase the member's point balance
 issueRewards.receivingCard.coinBalance += issueRewards.offer.coinAmount;

 // Create an IssuePointsEvent
 var issueRewardsEvent = getFactory().newEvent(NS, 'IssueRewardsEvent');
 issueRewardsEvent.receivingCard = issueRewards.receivingCard;
 issueRewardsEvent.offer = issueRewards.offer;

 // Commit changes to the network

  const ar = await getAssetRegistry(NS +'.RewardsCard');
  await ar.update(issueRewards.receivingCard);
    await emit(issueRewardsEvent);

 /* This is the old way through promises. async/await is a new way to implement promises
 return getAssetRegistry('org.loyal.tuber.RewardsCard')
     .then(function (cardRegistry) {
         return cardRegistry.update(issueRewards.receivingCard);
     }).then(function (receivingCard) {
         // Emit the point issue event to the network.
         emit(issueRewardsEvent);
     });
  */
}

/**
* Redeem  the Rewards
* @param  {org.apptellect.swayloyalty.RedeemRewards} redeemCoins transaction
* @transaction
*/

async function RedeemRewards(redeemRewards) {

   const NS = 'org.apptellect.swayloyalty';

 // Reduce the amount of coins from the member's card if the card has enough balance to redeeem the offer.
 if (redeemRewards.redeemingCard.coinBalance >= redeemRewards.offer.coinAmount) {
     redeemRewards.redeemingCard.coinBalance -= redeemRewards.offer.coinAmount;
 } else {
     throw new Error('Insufficient balance to redeem this offer.');
 }

 // Create a RedeemPointsEvent
 var redeemRewardsEvent = getFactory().newEvent(NS, 'RedeemRewardsEvent');
 redeemRewardsEvent.redeemingCard = redeemRewards.redeemingCard;
 redeemRewardsEvent.offer = redeemRewards.offer;

 // Commit changes to the network

 const ar = await getAssetRegistry(NS + '.RewardsCard');
 await ar.update(redeemRewards.redeemingCard);
   await emit(redeemRewardsEvent);

/* The above 3 lines replace the following promises block
 return getAssetRegistry('org.loyal.tuber.RewardsCard')
     .then(function (cardRegistry) {
         return cardRegistry.update(redeemRewards.redeemingCard);
     }).then(function (redeemingCard) {
         // Emit the point redemption event to the network.
         emit(redeemRewardsEvent);
     });
*/
}